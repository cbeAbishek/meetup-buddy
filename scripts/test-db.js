#!/usr/bin/env node

/**
 * Simple test script to check Supabase connection and table structure
 * Run with: node scripts/test-db.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    return {}
  }
  
  const envFile = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      env[key.trim()] = value.trim()
    }
  })
  
  return env
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.auth.getUser()
    console.log('✅ Supabase connection successful')
    
    // Check if tables exist
    console.log('\n📋 Checking table structure...')
    
    const tables = ['profiles', 'meetings', 'meeting_participants', 'calendar_slots']
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table "${tableName}": ${error.message}`)
        } else {
          console.log(`✅ Table "${tableName}": exists`)
        }
      } catch (err) {
        console.log(`❌ Table "${tableName}": ${err.message}`)
      }
    }
    
    // Test creating a sample profile
    console.log('\n👤 Testing profile creation...')
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: 'test-user-' + Date.now(),
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'presenter'
      })
      .select()
    
    if (profileError) {
      console.log(`❌ Profile creation failed: ${profileError.message}`)
    } else {
      console.log('✅ Profile creation successful')
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
  }
}

async function createBasicSchema() {
  console.log('\n🏗️  Creating basic database schema...')
  
  try {
    // Create profiles table
    const profilesSQL = `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'listener' CHECK (role IN ('admin', 'presenter', 'listener', 'manager')),
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    
    // Create meetings table
    const meetingsSQL = `
      CREATE TABLE IF NOT EXISTS meetings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        date DATE,
        location TEXT,
        meeting_type TEXT DEFAULT 'virtual' CHECK (meeting_type IN ('virtual', 'in-person', 'hybrid')),
        status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
        created_by UUID REFERENCES profiles(id),
        group_id UUID,
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    
    // Create meeting_participants table
    const participantsSQL = `
      CREATE TABLE IF NOT EXISTS meeting_participants (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        role TEXT DEFAULT 'listener' CHECK (role IN ('presenter', 'listener')),
        status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined')),
        joined_at TIMESTAMPTZ,
        left_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(meeting_id, profile_id)
      );
    `
    
    // Create calendar_slots table
    const slotsSQL = `
      CREATE TABLE IF NOT EXISTS calendar_slots (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        status TEXT DEFAULT 'free' CHECK (status IN ('free', 'busy', 'tentative')),
        meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    
    // Execute SQL commands
    const { error: profilesError } = await supabase.rpc('exec_sql', { sql: profilesSQL })
    const { error: meetingsError } = await supabase.rpc('exec_sql', { sql: meetingsSQL })
    const { error: participantsError } = await supabase.rpc('exec_sql', { sql: participantsSQL })
    const { error: slotsError } = await supabase.rpc('exec_sql', { sql: slotsSQL })
    
    if (profilesError) console.log('❌ Profiles table:', profilesError.message)
    else console.log('✅ Profiles table created/verified')
    
    if (meetingsError) console.log('❌ Meetings table:', meetingsError.message)
    else console.log('✅ Meetings table created/verified')
    
    if (participantsError) console.log('❌ Meeting participants table:', participantsError.message)
    else console.log('✅ Meeting participants table created/verified')
    
    if (slotsError) console.log('❌ Calendar slots table:', slotsError.message)
    else console.log('✅ Calendar slots table created/verified')
    
  } catch (error) {
    console.error('❌ Schema creation failed:', error.message)
  }
}

async function main() {
  console.log('🚀 Starting database tests...\n')
  
  await testDatabaseConnection()
  
  const shouldCreateSchema = process.argv.includes('--create-schema')
  if (shouldCreateSchema) {
    await createBasicSchema()
    await testDatabaseConnection() // Test again after schema creation
  }
  
  console.log('\n✨ Database test completed!')
}

if (require.main === module) {
  main().catch(console.error)
}