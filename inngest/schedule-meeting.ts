import * as chrono from 'chrono-node'
import { z } from 'zod'
import { inngest } from './clint'
import { supabaseAdmin } from '@/lib/supabase-admin'

const DEFAULT_DURATION_MINUTES = 60
const SUGGESTION_LOOKAHEAD_DAYS = 7
const MAX_SUGGESTIONS = 3

const scheduleMeetingEventSchema = z.object({
  prompt: z.string().min(1),
  requesterId: z.string().uuid().optional(),
  durationMinutes: z.number().int().positive().max(480).optional(),
  overrideStart: z.string().datetime().optional(),
  overrideEnd: z.string().datetime().optional(),
  acceptSuggestion: z.boolean().optional(),
  selectedSlotId: z.string().optional(),
  participantIds: z.array(z.string().uuid()).optional(),
  groupKey: z.string().optional()
})

type ScheduleMeetingEvent = z.infer<typeof scheduleMeetingEventSchema>

type ProfileRecord = {
  id: string
  full_name?: string | null
  email?: string | null
}

type MeetingRecord = {
  id: string
  title: string | null
  start_time: string
  end_time: string
}

type MeetingParticipantConflictRow = {
  profile_id: string
  meetings: MeetingRecord | MeetingRecord[] | null
}

type ParsedPrompt = {
  title: string
  groupName?: string
  agendaItems: string[]
  proposedStart: Date
  proposedEnd: Date
}

type Conflict = {
  type: 'meeting' | 'calendar_slot'
  participantId: string
  label: string
  start: string
  end: string
}

type Suggestion = {
  slotId?: string
  start: string
  end: string
  participants: string[]
}

const scheduleMeetingFn = inngest.createFunction(
  { id: 'meeting-scheduler' },
  { event: 'meeting/schedule' },
  async ({ event, step }) => {
    if (!supabaseAdmin) {
      return {
        status: 'error',
        message: 'Supabase service credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
      }
    }

    const parsedEvent = scheduleMeetingEventSchema.parse(event.data)

    const parsedPrompt = parseMeetingPrompt(
      parsedEvent.prompt,
      parsedEvent.durationMinutes ?? DEFAULT_DURATION_MINUTES
    )

    const meetingWindow = await resolveMeetingWindow(parsedEvent, parsedPrompt)

    const participants = await fetchParticipants(parsedEvent, parsedPrompt, supabaseAdmin!)

    if (!participants.length) {
      return {
        status: 'no_participants',
        message: `Couldn't resolve any participants for group "${
          parsedEvent.groupKey ?? parsedPrompt.groupName ?? 'unknown'
        }".`
      }
    }

    const participantIds = participants.map((p) => p.id)

    const conflicts = await step.run('check conflicts', async () =>
      findConflicts(participantIds, meetingWindow.start, meetingWindow.end, supabaseAdmin!)
    )

    if (conflicts.length && !parsedEvent.acceptSuggestion && !parsedEvent.selectedSlotId) {
      const suggestions = await step.run('generate suggestions', async () =>
        suggestSlots(participantIds, meetingWindow.durationMinutes, supabaseAdmin!)
      )

      return {
        status: 'conflict',
        conflicts,
        suggestions,
        proposed: meetingWindow
      }
    }

    const scheduledMeeting = await step.run('schedule meeting', async () =>
      scheduleMeeting({
        participants: participantIds,
        requesterId: parsedEvent.requesterId,
        parsedPrompt,
        meetingWindow,
        selectedSlotId: parsedEvent.selectedSlotId,
        supabase: supabaseAdmin!
      })
    )

    await step.sendEvent('broadcast meeting update', {
      name: 'meeting/created',
      data: {
        meetingId: scheduledMeeting.meeting.id,
        start: scheduledMeeting.meeting.start_time,
        end: scheduledMeeting.meeting.end_time,
        title: scheduledMeeting.meeting.title,
        agenda: scheduledMeeting.agendaItems,
        participants: scheduledMeeting.participants
      }
    })

    return {
      status: 'scheduled',
      meeting: scheduledMeeting.meeting,
      agendaItems: scheduledMeeting.agendaItems,
      participants: scheduledMeeting.participants
    }
  }
)

async function resolveMeetingWindow(
  parsedEvent: ScheduleMeetingEvent,
  parsedPrompt: ParsedPrompt
) {
  if (parsedEvent.overrideStart && parsedEvent.overrideEnd) {
    return {
      start: parsedEvent.overrideStart,
      end: parsedEvent.overrideEnd,
      durationMinutes: differenceInMinutes(
        new Date(parsedEvent.overrideStart),
        new Date(parsedEvent.overrideEnd)
      )
    }
  }

  return {
    start: parsedPrompt.proposedStart.toISOString(),
    end: parsedPrompt.proposedEnd.toISOString(),
    durationMinutes: differenceInMinutes(
      parsedPrompt.proposedStart,
      parsedPrompt.proposedEnd
    )
  }
}

async function fetchParticipants(
  parsedEvent: ScheduleMeetingEvent,
  parsedPrompt: ParsedPrompt,
  supabase: NonNullable<typeof supabaseAdmin>
): Promise<ProfileRecord[]> {
  if (parsedEvent.participantIds?.length) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', parsedEvent.participantIds)

    if (error) {
      throw new Error(`Failed to load participants: ${error.message}`)
    }

    return data ?? []
  }

  const groupName = parsedEvent.groupKey ?? parsedPrompt.groupName
  if (!groupName) {
    return []
  }

  // Since we don't have team/group columns, search by name pattern
  const normalized = groupName.trim().replace(/"/g, '')

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .ilike('full_name', `%${normalized}%`)

  if (error) {
    throw new Error(`Failed to load group members: ${error.message}`)
  }

  return (data ?? []).filter((profile) => Boolean(profile?.id))
}

async function findConflicts(
  participantIds: string[],
  startISO: string,
  endISO: string,
  supabase: NonNullable<typeof supabaseAdmin>
): Promise<Conflict[]> {
  if (!participantIds.length) {
    return []
  }

  const [meetingParticipantConflicts, calendarConflicts] = await Promise.all([
    supabase
      .from('meeting_participants')
      .select('profile_id, meetings!inner(id, title, start_time, end_time)')
      .in('profile_id', participantIds)
      .lt('meetings.start_time', endISO)
      .gt('meetings.end_time', startISO),
    supabase
      .from('calendar_slots')
      .select('id, profile_id, start_time, end_time, status')
      .in('profile_id', participantIds)
      .eq('status', 'busy')
      .lt('start_time', endISO)
      .gt('end_time', startISO)
  ])

  const conflicts: Conflict[] = []

  if (meetingParticipantConflicts.error) {
    throw new Error(
      `Failed to evaluate meeting conflicts: ${meetingParticipantConflicts.error.message}`
    )
  }

  if (calendarConflicts.error) {
    throw new Error(
      `Failed to evaluate calendar conflicts: ${calendarConflicts.error.message}`
    )
  }

  meetingParticipantConflicts.data?.forEach((rowRaw) => {
    const row = rowRaw as MeetingParticipantConflictRow
    if (!row.meetings) return

    const meeting = Array.isArray(row.meetings) ? row.meetings[0] : row.meetings
    if (!meeting) return

    conflicts.push({
      type: 'meeting',
      participantId: row.profile_id,
      label: meeting.title ?? 'Existing meeting',
      start: meeting.start_time,
      end: meeting.end_time
    })
  })

  calendarConflicts.data?.forEach((row) => {
    conflicts.push({
      type: 'calendar_slot',
      participantId: row.profile_id,
      label: row.status ?? 'Busy slot',
      start: row.start_time,
      end: row.end_time
    })
  })

  return conflicts
}

async function suggestSlots(
  participantIds: string[],
  requiredDurationMinutes: number,
  supabase: NonNullable<typeof supabaseAdmin>
): Promise<Suggestion[]> {
  if (!participantIds.length) {
    return []
  }

  const now = new Date()
  const lookaheadEnd = addDays(now, SUGGESTION_LOOKAHEAD_DAYS)

  const { data, error } = await supabase
    .from('calendar_slots')
    .select('id, profile_id, start_time, end_time, status')
    .in('profile_id', participantIds)
    .eq('status', 'available')
    .gte('start_time', now.toISOString())
    .lte('end_time', lookaheadEnd.toISOString())

  if (error) {
    throw new Error(`Failed to fetch suggested slots: ${error.message}`)
  }

  if (!data?.length) {
    return []
  }

  const slotMap = new Map<string, Suggestion>()

  for (const slot of data) {
    if (!slot.start_time || !slot.end_time) continue

    const slotDuration = differenceInMinutes(
      new Date(slot.start_time),
      new Date(slot.end_time)
    )

    if (slotDuration < requiredDurationMinutes) {
      continue
    }

    const key = `${slot.start_time}-${slot.end_time}`
    const existing = slotMap.get(key)
    if (existing) {
      existing.participants.push(slot.profile_id)
      continue
    }

    slotMap.set(key, {
      slotId: slot.id,
      start: slot.start_time,
      end: slot.end_time,
      participants: [slot.profile_id]
    })
  }

  const completeSuggestions = Array.from(slotMap.values())
    .filter((s) => s.participants.length === participantIds.length)
    .slice(0, MAX_SUGGESTIONS)

  return completeSuggestions
}

async function scheduleMeeting({
  participants,
  requesterId,
  parsedPrompt,
  meetingWindow,
  selectedSlotId,
  supabase
}: {
  participants: string[]
  requesterId?: string
  parsedPrompt: ParsedPrompt
  meetingWindow: { start: string; end: string; durationMinutes: number }
  selectedSlotId?: string
  supabase: NonNullable<typeof supabaseAdmin>
}): Promise<{
  meeting: MeetingRecord
  agendaItems: string[]
  participants: string[]
}> {
  const meetingInsert = {
    title: parsedPrompt.title,
    start_time: meetingWindow.start,
    end_time: meetingWindow.end,
    created_by: requesterId ?? null,
    group_name: parsedPrompt.groupName ?? null,
    prompt_source: parsedPrompt.title
  }

  const { data: meetingData, error: meetingInsertError } = await supabase
    .from('meetings')
    .insert(meetingInsert)
    .select('id, title, start_time, end_time')
    .single()

  if (meetingInsertError || !meetingData) {
    throw new Error(
      `Failed to insert meeting: ${meetingInsertError?.message ?? 'Unknown error'}`
    )
  }

  if (participants.length) {
    const participantRows = participants.map((profileId) => ({
      meeting_id: meetingData.id,
      profile_id: profileId
    }))

    const { error: participantError } = await supabase
      .from('meeting_participants')
      .insert(participantRows)

    if (participantError) {
      throw new Error(`Failed to add participants: ${participantError.message}`)
    }
  }

  const agendaItems = parsedPrompt.agendaItems.length
    ? parsedPrompt.agendaItems
    : ['General discussion']

  const agendaRows = agendaItems.map((content, index) => ({
    meeting_id: meetingData.id,
    content,
    created_by: requesterId ?? null,
    order_index: index
  }))

  const { error: prepNotesError } = await supabase
    .from('prep_notes')
    .insert(agendaRows)

  if (prepNotesError) {
    throw new Error(`Failed to save agenda items: ${prepNotesError.message}`)
  }

  if (selectedSlotId) {
    await supabase
      .from('calendar_slots')
      .update({ status: 'busy', meeting_id: meetingData.id })
      .eq('id', selectedSlotId)
  }

  return {
    meeting: meetingData,
    agendaItems,
    participants
  }
}

function parseMeetingPrompt(
  prompt: string,
  durationMinutes: number
): ParsedPrompt {
  const cleaned = prompt.trim()
  const chronoDate = chrono.parseDate(cleaned, new Date(), { forwardDate: true })

  if (!chronoDate) {
    throw new Error('Could not determine meeting time from prompt')
  }

  const meetingStart = chronoDate

  const durationOverride = extractDuration(cleaned) ?? durationMinutes
  const meetingEnd = addMinutes(meetingStart, durationOverride)

  const groupName = extractGroupName(cleaned)
  const agendaItems = extractAgenda(cleaned)
  const title = buildTitle(cleaned, groupName)

  return {
    title,
    groupName,
    agendaItems,
    proposedStart: meetingStart,
    proposedEnd: meetingEnd
  }
}

function extractGroupName(prompt: string) {
  const groupMatch = prompt.match(/for the ([^,]*?)(?: group| team| meeting)/i)
  if (groupMatch?.[1]) {
    return groupMatch[1].trim()
  }

  const genericMatch = prompt.match(/with the ([^,]*?) (?:group|team)/i)
  return genericMatch?.[1]?.trim()
}

function extractAgenda(prompt: string): string[] {
  const agendaMatch = prompt.match(/(?:agenda|about|to discuss) ([^\.]+)(?:\.|$)/i)
  if (!agendaMatch?.[1]) {
    return []
  }

  return agendaMatch[1]
    .split(/,| and /i)
    .map((item) => item.trim())
    .filter(Boolean)
}

function extractDuration(prompt: string): number | undefined {
  const durationMatch = prompt.match(/for (\d+)\s*(minutes|min|hours|hrs|hour)/i)
  if (!durationMatch) return undefined

  const value = Number(durationMatch[1])
  const unit = durationMatch[2].toLowerCase()

  if (['hour', 'hours', 'hr', 'hrs'].includes(unit)) {
    return value * 60
  }

  return value
}

function buildTitle(prompt: string, groupName?: string) {
  const agendaMatch = prompt.match(/with agenda (.+)$/i)
  if (agendaMatch?.[1]) {
    return `${capitalize(groupName ?? 'Team')} meeting: ${agendaMatch[1].trim()}`
  }

  return `${capitalize(groupName ?? 'Team')} meeting`
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function differenceInMinutes(start: Date, end: Date) {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

export default scheduleMeetingFn
