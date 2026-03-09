import { createClient } from "@supabase/supabase-js";

const supabaseUrl = processLock.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = processLock.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
