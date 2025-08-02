import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gmbcepywutbrhppxbwkk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtYmNlcHl3dXRicmhwcHhid2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjMyMDYsImV4cCI6MjA2OTY5OTIwNn0.3ot0SzgqmjkX7bWZwHZ6ObmBMgIzbH5rt4cH8v_eGiM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)