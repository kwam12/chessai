import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://slkrvdtrtoltpaacecfr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsa3J2ZHRydG9sdHBhYWNlY2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAwOTU4NzEsImV4cCI6MTk4NTY3MTg3MX0.phcGdTW19YJKD86_gf3VE6SRZ5ohN7cEW5b94waO89U";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
