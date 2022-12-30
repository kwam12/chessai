import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vncokpktgnffojvcmzva.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuY29rcGt0Z25mZm9qdmNtenZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIzOTU4MjgsImV4cCI6MTk4Nzk3MTgyOH0.uLsV3ONqSWru7G35-mLmwI3Bkzv1xSXrjIYF5V875xc";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
