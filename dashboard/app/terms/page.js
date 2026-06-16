export const metadata = { title: 'Terms of Service — Fast Launch Content Engine' };

export default function Terms() {
  return (
    <article style={{ maxWidth: '70ch' }}>
      <span className="eyebrow">Legal</span>
      <h1 className="page-title">Terms of <em>Service</em></h1>
      <p className="lede">Last updated: 16 June 2026.</p>

      <div style={{ marginTop: 28, color: 'var(--muted)', fontSize: 15.5, lineHeight: 1.65 }}>
        <p>The Fast Launch Content Engine ("the app") is a private, internal tool operated by Fast Launch (fastlaunchmvp.com) for tracking the performance of its own social media content.</p>

        <h3 style={{ color: 'var(--ink)', fontSize: 19, marginTop: 26 }}>Use of the app</h3>
        <p>The app connects to a TikTok account that the operator owns or is authorised to manage, and displays that account's video statistics. It is not offered as a public service and is intended solely for the operator's own use.</p>

        <h3 style={{ color: 'var(--ink)', fontSize: 19, marginTop: 26 }}>Acceptable use</h3>
        <p>The app accesses TikTok data strictly within the scopes you grant and in line with TikTok's Developer Terms and Community Guidelines. It performs read-only requests for statistics and does not post, modify or delete any content.</p>

        <h3 style={{ color: 'var(--ink)', fontSize: 19, marginTop: 26 }}>No warranty</h3>
        <p>The app is provided "as is", without warranty of any kind. Availability and the accuracy of third-party (TikTok) data are not guaranteed.</p>

        <h3 style={{ color: 'var(--ink)', fontSize: 19, marginTop: 26 }}>Contact</h3>
        <p>Questions about these terms: via <a href="https://fastlaunchmvp.com" style={{ color: 'var(--orange-deep)' }}>fastlaunchmvp.com</a>.</p>
      </div>
    </article>
  );
}
