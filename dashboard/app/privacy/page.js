export const metadata = { title: 'Privacy Policy — Fast Launch Content Engine' };

export default function Privacy() {
  return (
    <article style={{ maxWidth: '70ch' }}>
      <span className="eyebrow">Legal</span>
      <h1 className="page-title">Privacy <em>Policy</em></h1>
      <p className="lede">Last updated: 16 June 2026.</p>

      <div style={{ marginTop: 28, color: 'var(--muted)', fontSize: 15.5, lineHeight: 1.65 }}>
        <p>The Fast Launch Content Engine ("the app") is an internal tool used by Fast Launch (fastlaunchmvp.com) to view the performance of its own social content.</p>

        <h3 style={{ color: 'var(--ink)', fontSize: 19, marginTop: 26 }}>What we access</h3>
        <p>When you connect a TikTok account, the app uses the TikTok Display API to read that account's own public video information and statistics — video titles, view counts, like counts, comment counts and share counts — together with the basic profile fields you authorise (<code>user.info.basic</code>, <code>user.info.stats</code>, <code>video.list</code>).</p>

        <h3 style={{ color: 'var(--ink)', fontSize: 19, marginTop: 26 }}>How we use it</h3>
        <p>This data is shown only inside the Fast Launch dashboard, to the account owner, so we can track how content performs. We do not sell it, share it with third parties, or use it for advertising or profiling.</p>

        <h3 style={{ color: 'var(--ink)', fontSize: 19, marginTop: 26 }}>Storage &amp; tokens</h3>
        <p>Access and refresh tokens are stored securely as server-side environment variables and are used only to fetch the statistics described above. You can revoke access at any time from your TikTok account settings, which immediately stops all access.</p>

        <h3 style={{ color: 'var(--ink)', fontSize: 19, marginTop: 26 }}>Contact</h3>
        <p>Questions about this policy: via <a href="https://fastlaunchmvp.com" style={{ color: 'var(--orange-deep)' }}>fastlaunchmvp.com</a>.</p>
      </div>
    </article>
  );
}
