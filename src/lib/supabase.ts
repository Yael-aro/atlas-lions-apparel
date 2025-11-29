import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qlmgtsqphjkmezkdcomp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TA_CLeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsbWd0c3FwaGprbWV6a2Rjb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTE2NjUsImV4cCI6MjA3OTgyNzY2NX0._Mag3Zw89A-f6RDtxEF6pNzOUyeSM96mm6FAcEKdQ38E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)