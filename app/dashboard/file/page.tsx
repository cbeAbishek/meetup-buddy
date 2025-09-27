'use client'
import React, { useRef, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)

    // new state to hold files from the 'learn' bucket
    const [filesList, setFilesList] = useState<{ name: string; publicUrl: string }[]>([])

    // try several candidates to avoid bucket-name typos
    const bucketCandidates = [
        process.env.NEXT_PUBLIC_SUPABASE_BUCKET,
        'learn',
        'learm',
    ].filter(Boolean) as string[]

    // keep track of which bucket actually worked
    const [selectedBucket, setSelectedBucket] = useState<string>(bucketCandidates[0] ?? 'learn')

    // fetch all files and their public URLs from the bucket candidates
    async function fetchFiles() {
        setStatus('Loading files...')
        let lastError: any = null

        // try each bucket candidate
        for (const candidate of bucketCandidates) {
            // try a few path variants: undefined (omit), empty string, single slash
            const pathCandidates: Array<string | undefined> = [undefined, '', '/']

            for (const path of pathCandidates) {
                try {
                    // ensure we pass a proper string path ('' for root) and options as second arg
                    const resolvedPath = typeof path === 'undefined' ? '' : path
                    const { data, error } = await supabase.storage.from(candidate).list(resolvedPath, { limit: 100, offset: 0 })

                    console.debug('supabase.list', { candidate, path: resolvedPath, data, error })

                    if (error) {
                        lastError = error
                        // try next path variant
                        continue
                    }

                    // If call succeeded but returned empty array, show that explicitly
                    if (!data || (Array.isArray(data) && data.length === 0)) {
                        setFilesList([])
                        setSelectedBucket(candidate)
                        setStatus(`No files found in bucket "${candidate}" (path: ${resolvedPath || '/'})`)
                        return
                    }

                    // map file entries to names and build public URLs
                    const filesWithUrls = (data ?? []).map((f: any) => {
                        const name = f.name ?? f.id ?? f.path ?? ''
                        const { data: urlData } = supabase.storage.from(candidate).getPublicUrl(name)
                        const publicUrl = urlData?.publicUrl ?? ''
                        return { name, publicUrl }
                    })

                    setFilesList(filesWithUrls)
                    setSelectedBucket(candidate)
                    setStatus(`Loaded ${filesWithUrls.length} file(s) from "${candidate}" (path: ${resolvedPath || '/'})`)
                    return
                } catch (err: any) {
                    lastError = err
                    console.error('list attempt failed', { candidate, path, err })
                    // try next path variant
                }
            }
        }

        // none succeeded
        console.error('Failed to list files for candidates:', bucketCandidates, lastError)
        setFilesList([])
        setStatus(lastError?.message ? `Failed to load files: ${lastError.message}` : 'Failed to load files')
    }

    useEffect(() => {
        fetchFiles()
    }, [])

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setFileName(file.name)
        setStatus('Uploading...')
        try {
            // capture values from `file` before any await so TypeScript knows they're non-null
            const originalName = file.name
            const fileToUpload = file
            const filePath = `${Date.now()}_${originalName}`

            // upload file to the selectedBucket (use selectedBucket state)
            const { error: uploadError } = await supabase.storage
                .from(selectedBucket)
                .upload(filePath, fileToUpload)

            if (uploadError) throw uploadError

            // refresh list after successful upload
            await fetchFiles()

            // get public URL (if bucket is public)
            const { data: urlData } = supabase.storage.from(selectedBucket).getPublicUrl(filePath)
            const publicUrl = urlData.publicUrl

            setStatus(`Upload successful: ${filePath}\nPublic URL: ${publicUrl}`)
        } catch (err: any) {
            console.error(err)
            setStatus(err.message || 'Upload failed')
        }
    }

    return (
        <div style={{ maxWidth: 520, margin: 24 }}>
            <Label htmlFor="file">Upload file</Label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                    id="file"
                    ref={fileRef}
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <Button
                    onClick={() => fileRef.current?.click()}
                    aria-label="Choose file to upload"
                >
                    Choose file
                </Button>
                <Input
                    readOnly
                    value={fileName ?? ''}
                    placeholder="No file chosen"
                    style={{ flex: 1 }}
                />
                <Button onClick={() => fetchFiles()}>Refresh</Button>
            </div>

            <div style={{ marginTop: 12, color: status?.toLowerCase().includes('failed') ? 'red' : 'black', whiteSpace: 'pre-wrap' }}>
                {status ?? 'No action yet'}
            </div>

            <div style={{ marginTop: 16 }}>
                <Label>Files in "{selectedBucket}"</Label>
                <div style={{ marginTop: 8 }}>
                    {filesList.length === 0 ? (
                        <div>No files found</div>
                    ) : (
                        filesList.map((f) => (
                            <div key={f.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '6px 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>
                                    {f.name}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <a href={f.publicUrl} target="_blank" rel="noopener noreferrer">
                                        <Button>Open</Button>
                                    </a>
                                    <a href={f.publicUrl} download={f.name}>
                                        <Button>Download</Button>
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}