import fs from 'fs';
import { STATIC_SUB_COUNTIES } from './lib/location-data.js';

function run() {
  const sqlLines: string[] = [];
  sqlLines.push('-- Seed all 290 subcounties matching static location data IDs');
  sqlLines.push('INSERT INTO public.subcounties (id, county_id, name) VALUES');

  const valueStrings = STATIC_SUB_COUNTIES.map(sc => {
    // Escape single quotes in name just in case (e.g. Chuka/Igambang'ombe)
    const escapedName = sc.name.replace(/'/g, "''");
    return `(${sc.id}, ${sc.county_id}, '${escapedName}')`;
  });

  sqlLines.push(valueStrings.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET county_id = EXCLUDED.county_id, name = EXCLUDED.name;');
  sqlLines.push('');
  sqlLines.push('-- Sync the primary key sequence');
  sqlLines.push("SELECT setval('public.subcounties_id_seq', COALESCE((SELECT MAX(id)+1 FROM public.subcounties), 1), false);");
  sqlLines.push('');
  sqlLines.push('-- Seed a default ward for every subcounty that currently has no wards');
  sqlLines.push('-- Column name is subcounty_id');
  sqlLines.push('INSERT INTO public.wards (county_id, subcounty_id, name)');
  sqlLines.push('SELECT county_id, id, name');
  sqlLines.push('FROM public.subcounties sc');
  sqlLines.push('WHERE NOT EXISTS (');
  sqlLines.push('  SELECT 1 FROM public.wards w WHERE w.subcounty_id = sc.id');
  sqlLines.push(');');
  sqlLines.push('');
  sqlLines.push('-- Update any remaining wards that have NULL subcounty_id but match county_id');
  sqlLines.push('UPDATE public.wards w SET subcounty_id = s.id');
  sqlLines.push('FROM public.subcounties s');
  sqlLines.push('WHERE s.county_id = w.county_id AND w.subcounty_id IS NULL;');

  const sqlContent = sqlLines.join('\n');
  const targetPath = 'c:/Users/SBS/Desktop/vutabiz/supabase/migrations/20260719152000_seed_all_subcounties_and_default_wards.sql';
  fs.writeFileSync(targetPath, sqlContent, 'utf-8');
  console.log('Successfully generated SQL migration at:', targetPath);
}

run();
