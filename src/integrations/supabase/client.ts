// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cqyvgmjmcffnkgpkpwiv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeXZnbWptY2ZmbmtncGtwd2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMTQ5ODcsImV4cCI6MjA1MDU5MDk4N30.qS1MRsoZumBFKIpKMtNaQ-QyA6KBac9JcKUtZmZofco";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);