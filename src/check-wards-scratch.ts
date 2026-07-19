import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nudnznwbnfdkoroaonyl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZG56bndibmZka29yb2FvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODU3MjcsImV4cCI6MjA5OTk2MTcyN30.vkx03oB1CdBZLc1dZeAD0w4NbeDfY8Ju1_u4-fR7PcE";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const r1 = await supabase.from('sub_counties').select('*', { count: 'exact', head: true });
  console.log('sub_counties:', r1.count, r1.error?.message);

  const r2 = await supabase.from('subcounties').select('*', { count: 'exact', head: true });
  console.log('subcounties:', r2.count, r2.error?.message);
}

run();
