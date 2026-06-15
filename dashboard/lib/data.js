// Single source of truth for the dashboard. Mirrors video-log.md + the
// assets/past-work catalogue. (A future script can regenerate this from those
// files; for now it is authored to match them.)

export const STUDIO = {
  name: 'Fast Launch',
  product: 'Content Engine',
  url: 'fastlaunchmvp.com',
};

export const videos = [
  {
    id: 1,
    date: '2026-06-15',
    slug: '2026-06-11-six-more-sites',
    title: 'Six more industries. Six more sites.',
    type: 'Work showcase',
    hookHeading: 'I Design & Build Websites',
    accent: 'Green',
    accentHex: '#2EA84F',
    background: 'Warm gradient',
    cover: ['Auréa', 'Ovulan'],
    projects: ['Auréa', 'Ovulan', 'KOL Vault', 'Snow Outdoor Digs', 'Primrose Evercare', 'Memory Market'],
    slides: 7,
    platforms: ['TikTok', 'Instagram', 'LinkedIn'],
    status: 'Ready to post',
    thumb: '/thumbnails/six-more-sites-hook.jpg',
    metrics: { plays: null, likes: null, saves: null, comments: null },
    note: 'First build on the locked showcase spec. Next test: orange accent vs green; a dark hero on the cover.',
  },
  {
    id: 2,
    date: '2026-05-10',
    slug: '2026-05-10-five-industries-five-sites',
    title: 'Five industries. Five sites. One studio.',
    type: 'Work showcase',
    hookHeading: '5 industries. 5 sites. One studio.',
    accent: 'Orange',
    accentHex: '#F26B1A',
    background: 'Per-project',
    cover: ['PURE', 'Carluxe'],
    projects: ['PURE', 'Carluxe', 'Athlytex', 'Primrose Evercare', 'Movescape'],
    slides: 6,
    platforms: ['TikTok', 'Instagram', 'LinkedIn'],
    status: 'Posted',
    thumb: '/mockups/solax-energy.jpg',
    metrics: { plays: null, likes: null, saves: null, comments: null },
    note: 'First portfolio drop.',
  },
  {
    id: 3,
    date: '2026-05-08',
    slug: '2026-05-08-spot-the-ai-site',
    title: 'Spot the AI site — Bonatica teardown',
    type: 'Case study',
    hookHeading: 'Can you spot the AI site?',
    accent: 'Orange',
    accentHex: '#F26B1A',
    background: 'Light',
    cover: ['Bonatica'],
    projects: ['Bonatica'],
    slides: 6,
    platforms: ['TikTok', 'Instagram', 'LinkedIn'],
    status: 'Posted',
    thumb: '/mockups/bonatica.jpg',
    metrics: { plays: null, likes: null, saves: null, comments: null },
    note: 'Teardown / reveal format. (Bonatica is flagged as a TikTok winner in the catalogue — add real numbers when handy.)',
  },
  {
    id: 4,
    date: '2026-05-07',
    slug: 'clausekit-case-study',
    title: 'ClauseKit case study',
    type: 'Case study',
    hookHeading: 'How we built ClauseKit',
    accent: 'Green',
    accentHex: '#2EA84F',
    background: 'Light',
    cover: ['ClauseKit'],
    projects: ['ClauseKit'],
    slides: 8,
    platforms: ['TikTok', 'Instagram', 'LinkedIn'],
    status: 'Posted',
    thumb: '/mockups/clausekit.jpg',
    metrics: { plays: null, likes: null, saves: null, comments: null },
    note: 'Annotated screenshots.',
  },
];

// Work library — mirrors assets/past-work/index.md
export const library = [
  { slug: 'aramas', name: 'Aramas', industry: 'Real estate / property', style: 'Dark, premium, type-led', year: 2026 },
  { slug: 'athlytex', name: 'Athlytex', industry: 'Fitness / gym', style: 'Bold, red-accent', year: 2025 },
  { slug: 'aurea', name: 'Auréa', industry: 'Skincare / beauty', style: 'Minimal, sage-green', year: 2025 },
  { slug: 'bonatica', name: 'Bonatica', industry: 'Skincare / beauty', style: 'Warm, photo-led', year: 2025, winner: true },
  { slug: 'carluxe', name: 'Carluxe', industry: 'Automotive / detailing', style: 'Dark, gold-accent', year: 2025 },
  { slug: 'clausekit', name: 'ClauseKit', industry: 'Legal-tech', style: 'Clean, green, trustworthy', year: 2026 },
  { slug: 'desert-falcons', name: 'Desert Falcons', industry: 'Sports / club', style: 'Bold', year: 2026 },
  { slug: 'fast-launch', name: 'Fast Launch', industry: 'Web studio (us)', style: 'Orange, bold, agency', year: 2026 },
  { slug: 'kol-vault', name: 'KOL Vault', industry: 'SaaS / influencer', style: 'Tech-forward, dark, data-led', year: 2026 },
  { slug: 'memory-market', name: 'Memory Market', industry: 'SaaS / data marketplace', style: 'Tech-forward, modern', year: 2026 },
  { slug: 'mot-services', name: 'MOT Services', industry: 'Automotive / vehicle', style: 'Dark, masculine, orange', year: 2025 },
  { slug: 'movescape', name: 'Movescape', industry: 'Real estate / property', style: 'Warm, photo-heavy', year: 2025 },
  { slug: 'ovulan-watches', name: 'Ovulan', industry: 'E-commerce / watches', style: 'Luxury, refined, dark', year: 2025 },
  { slug: 'primrose-evercare', name: 'Primrose Evercare', industry: 'Care services / health', style: 'Warm, trustworthy', year: 2025 },
  { slug: 'sable', name: 'Sable', industry: 'Restaurant / fine-dining', style: 'Dark, burgundy, editorial', year: 2026 },
  { slug: 'snow-outdoor-digs', name: 'Snow Outdoor Digs', industry: 'Facilities / snow services', style: 'Bold, dark, orange', year: 2025 },
  { slug: 'solax-energy', name: 'Solax Energy', industry: 'Clean energy / solar', style: 'Editorial, white, bold-type', year: 2025, winner: true },
  { slug: 'vellum', name: 'Vellum', industry: 'Finance / family office', style: 'Navy, editorial, serif', year: 2026 },
  { slug: 'wedscout', name: 'Wedscout', industry: 'Weddings / events', style: 'Editorial', year: 2025 },
];

export const pipeline = [
  { step: '01', name: 'Research', icon: 'radar', detail: 'A daily cron pulls a fresh research dossier of angles + hooks worth posting.' },
  { step: '02', name: 'Idea', icon: 'spark', detail: 'We synthesise the dossier into one concrete idea: angle, copy and the sites to feature.' },
  { step: '03', name: 'Render', icon: 'layers', detail: 'The engine renders the carousel to all three platforms (TikTok 9:16, IG + LinkedIn 1:1).' },
  { step: '04', name: 'Review', icon: 'check', detail: 'Preview in Discord, tweak copy/visuals, approve. Nothing posts without a go-ahead.' },
  { step: '05', name: 'Post', icon: 'send', detail: 'LinkedIn + Instagram auto-post; TikTok delivered for a one-tap manual upload.' },
];

// Derived helpers
const posted = videos.filter(v => v.status === 'Posted');
const withPlays = posted.filter(v => v.metrics.plays != null);
export const stats = {
  totalVideos: videos.length,
  posted: posted.length,
  platforms: 3,
  librarySize: library.length,
  hasMetrics: withPlays.length > 0,
  topPerformer: withPlays.length
    ? withPlays.slice().sort((a, b) => (b.metrics.plays || 0) - (a.metrics.plays || 0))[0]
    : null,
  totalPlays: withPlays.reduce((s, v) => s + (v.metrics.plays || 0), 0),
};

export function fmt(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + 'K';
  return String(n);
}
