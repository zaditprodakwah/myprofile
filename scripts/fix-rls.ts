import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixRLS() {
  const tables = ['radar_items', 'radar_sources', 'tools', 'problems', 'industries'];
  
  console.log('Enabling RLS and adding policies...');
  
  for (const table of tables) {
    // Enable RLS
    const { error: rlsError } = await supabase.rpc('enable_rls', { tname: table });
    if (rlsError) {
      // Fallback: Try raw SQL if RPC fails
      console.log(`RPC enable_rls failed for ${table}, trying raw SQL...`);
      await supabase.rpc('exec_sql', { sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;` });
    }

    // Add SELECT policy
    const policyName = `Allow public read access for ${table}`;
    const sql = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = '${table}' AND policyname = '${policyName}'
        ) THEN
          CREATE POLICY "${policyName}" ON ${table} FOR SELECT USING (true);
        END IF;
      END
      $$;
    `;
    
    const { error: policyError } = await supabase.rpc('exec_sql', { sql });
    if (policyError) {
      console.error(`Error adding policy for ${table}:`, policyError);
    } else {
      console.log(`Policy added for ${table}`);
    }
  }
}

fixRLS();
