import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vbogyhjacxcldwatukkf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tMHvKATbmNeTwwH_K2NTRw_Ixsm4V0c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);