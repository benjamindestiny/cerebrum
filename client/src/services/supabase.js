// services/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: Check if env variables exist
console.log('🔍 Supabase URL:', supabaseUrl)
console.log('🔍 Supabase Key exists:', !!supabaseAnonKey)
console.log('🔍 Supabase Key preview:', supabaseAnonKey?.substring(0, 20) + '...')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Check your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-application-name': 'cerebrum',
    },
  },
})

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...')
    const startTime = Date.now()
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .timeout(10000) // 10 second timeout
    
    const elapsed = Date.now() - startTime
    console.log(`⏱️ Connection test took ${elapsed}ms`)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return { success: false, error, elapsed }
    }
    
    console.log('✅ Supabase connection successful!')
    return { success: true, data, elapsed }
  } catch (err) {
    console.error('❌ Supabase connection error:', err)
    return { success: false, error: err, elapsed: 0 }
  }
}