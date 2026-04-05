import { supabaseAdmin } from './supabase-server';
import { HOMEPAGE_DEFAULTS } from './defaults';

export type HomepageContent = Record<string, Record<string, string>>;

/**
 * Fetch all site_content from Supabase, merge with defaults.
 * If Supabase is down or empty → returns pure defaults.
 * Called at build time (SSR) — cached by Next.js.
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  // Start with defaults (deep copy)
  const content: HomepageContent = {};
  for (const [section, fields] of Object.entries(HOMEPAGE_DEFAULTS)) {
    content[section] = { ...fields };
  }

  if (!supabaseAdmin) {
    return content;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('section, field_key, field_value');

    if (error) {
      console.error('Failed to fetch site_content:', error.message);
      return content;
    }

    if (data && data.length > 0) {
      for (const row of data) {
        if (!content[row.section]) {
          content[row.section] = {};
        }
        // Only override if DB value is non-empty
        if (row.field_value && row.field_value.trim() !== '') {
          content[row.section][row.field_key] = row.field_value;
        }
      }
    }
  } catch (err) {
    console.error('Supabase fetch error:', err);
  }

  return content;
}
