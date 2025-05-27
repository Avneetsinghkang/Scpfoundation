import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lpyklhignujkifoftemx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweWtsaGlnbnVqa2lmb2Z0ZW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2MzEsImV4cCI6MjA2MjA1NjYzMX0.rD-j-o8JwmSk12YxnrILxYylw-LcW2KqXH_K5Sr6Xe8';
export const supabase = createClient(supabaseUrl, supabaseKey);
