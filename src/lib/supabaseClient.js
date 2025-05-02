// movie-database/src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evzgbggzirbdfvjwdpqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2emdiZ2d6aXJiZGZ2andkcHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDIxOTksImV4cCI6MjA2MTUxODE5OX0.19f_J-Va6Cv0FhUdhEURc0Y5hO0zh-Tw3m88-CWhuDM';
export const supabase = createClient(supabaseUrl, supabaseKey);
