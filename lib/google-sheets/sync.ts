import { fetchSheetData } from './client';
import { upsertDoctor, logSync } from '../db/queries';
import { isValidNPI } from '../utils/slugify';
import { SyncStats, SheetRow } from '../types';

// Parse a row from Google Sheets into a SheetRow object
function parseSheetRow(row: string[]): SheetRow | null {
  const [
    npi,
    fullName,
    specialty,
    subSpecialty,
    practiceName,
    website,
    city,
    state,
    email,
    phone,
    linkedin,
    profileStatus,
    verified,
    featured,
    priority,
  ] = row;

  // Validate required fields
  if (!npi || !fullName || !specialty || !city || !state) {
    return null;
  }

  // Validate NPI format
  if (!isValidNPI(npi)) {
    return null;
  }

  return {
    npi: npi.trim(),
    fullName: fullName.trim(),
    specialty: specialty.trim(),
    subSpecialty: subSpecialty?.trim() || null,
    practiceName: practiceName?.trim() || null,
    website: website?.trim() || null,
    city: city.trim(),
    state: state.trim().toUpperCase(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    linkedin: linkedin?.trim() || null,
    profileStatus: profileStatus?.trim() || 'Active',
    isVerified: verified?.toLowerCase() === 'yes',
    isFeatured: featured?.toLowerCase() === 'yes',
    priority: parseInt(priority) || 50,
  };
}

// Sync data from Google Sheets to the database
export async function syncFromGoogleSheets(): Promise<SyncStats> {
  const stats: SyncStats = {
    processed: 0,
    added: 0,
    updated: 0,
    unchanged: 0,
    errors: [],
  };

  try {
    // Fetch data from Google Sheets
    const rows = await fetchSheetData();

    if (rows.length <= 1) {
      stats.errors.push('No data found in sheet (only header row or empty)');
      return stats;
    }

    // Skip header row
    const dataRows = rows.slice(1);

    // Process each row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      stats.processed++;

      try {
        const parsed = parseSheetRow(row);

        if (!parsed) {
          stats.errors.push(`Row ${i + 2}: Invalid or missing required fields`);
          continue;
        }

        const result = upsertDoctor({
          npi: parsed.npi,
          fullName: parsed.fullName,
          specialty: parsed.specialty,
          subSpecialty: parsed.subSpecialty,
          practiceName: parsed.practiceName,
          website: parsed.website,
          city: parsed.city,
          state: parsed.state,
          email: parsed.email,
          phone: parsed.phone,
          linkedin: parsed.linkedin,
          profileStatus: parsed.profileStatus,
          isVerified: parsed.isVerified,
          isFeatured: parsed.isFeatured,
          priority: parsed.priority,
        });

        switch (result.action) {
          case 'added':
            stats.added++;
            break;
          case 'updated':
            stats.updated++;
            break;
          case 'unchanged':
            stats.unchanged++;
            break;
        }
      } catch (error) {
        stats.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Log the sync operation
    logSync(stats);

  } catch (error) {
    stats.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return stats;
}
