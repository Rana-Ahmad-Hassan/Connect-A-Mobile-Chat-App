import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fvjjuajypppiwhrmodxj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2amp1YWp5cHBwaXdocm1vZHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NjY1NzksImV4cCI6MjA1NDI0MjU3OX0.y3ok-2erQRA23byVeJdaSgVCU8yI3CR93_pFg7YDwJE";

export const supabase = createClient(supabaseUrl, supabaseKey);
