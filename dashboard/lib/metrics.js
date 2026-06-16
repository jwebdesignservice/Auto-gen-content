// Parse a published Google Sheet CSV of post metrics into a slug -> metrics map.
// Expected header (case-insensitive): slug, plays, likes, saves, comments
export function parseCsv(text) {
  const lines = (text || '').trim().split(/\r?\n/);
  if (lines.length < 2) return {};
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  const at = (k) => header.indexOf(k);
  const out = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    const slug = (cols[at('slug')] || '').trim();
    if (!slug) continue;
    const num = (k) => {
      const idx = at(k);
      if (idx < 0) return null;
      const raw = (cols[idx] || '').replace(/[,\s]/g, '');
      return raw === '' ? null : Number(raw);
    };
    out[slug] = { plays: num('plays'), likes: num('likes'), saves: num('saves'), comments: num('comments') };
  }
  return out;
}

// Overlay live metrics (from the sheet) onto a static video record.
export function mergeVideo(v, map) {
  const m = map && map[v.slug];
  if (!m) return v;
  return {
    ...v,
    metrics: {
      plays: m.plays ?? v.metrics.plays,
      likes: m.likes ?? v.metrics.likes,
      saves: m.saves ?? v.metrics.saves,
      comments: m.comments ?? v.metrics.comments,
    },
  };
}
