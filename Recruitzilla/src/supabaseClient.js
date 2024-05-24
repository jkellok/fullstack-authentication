import { createClient } from '@supabase/supabase-js'

//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
//const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

// test supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_TEST_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_TEST_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)