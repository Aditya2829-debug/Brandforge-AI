import ContentGenerator from './pages/ContentGenerator';
import ProfileAnalyzer from './pages/ProfileAnalyzer';

const metrics = [
  { label: 'Brand score', value: '92%' },
  { label: 'Signals analyzed', value: '48' },
  { label: 'Drafts ready', value: '12' },
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Brandforge AI</p>
          <h1>Ship content and profile insights from one focused workspace.</h1>
          <p className="hero__text">
            A crisp frontend for drafting branded content, checking trust signals, and keeping the workflow centered on what to publish next.
          </p>

          <div className="metric-row">
            {metrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="hero__orbital">
          <div className="orbital-card">
            <span className="orbital-card__label">Status</span>
            <strong>Ready to generate</strong>
            <p>Use the content studio for posts and the profile lens for fast brand checks.</p>
          </div>
        </div>
      </section>

      <section className="workspace-grid">
        <ContentGenerator />
        <ProfileAnalyzer />
      </section>
    </main>
  );
}