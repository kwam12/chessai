import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rgtblzirqqbfujhjhwdm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJndGJsemlycXFiZnVqaGpod2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI1ODk5MzksImV4cCI6MTk4ODE2NTkzOX0.GXSJBJod6wH2zpMx6J2kaWe1lhK3IXB-5mXnTY9SqKU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
