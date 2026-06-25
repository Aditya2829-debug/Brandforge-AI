import { useMemo, useState } from 'react';

const profileSignals = [
	{ label: 'Clarity', score: 88, note: 'Strong positioning statement' },
	{ label: 'Authority', score: 74, note: 'Needs more proof points' },
	{ label: 'Consistency', score: 81, note: 'Good brand rhythm' },
];

function summarizeProfile(profile) {
	const handle = profile.trim() || '@your-handle';
	return `Audit ${handle} for positioning, visual consistency, and trust signals. Improve the headline, tighten the bio, and add specific proof points.`;
}

export default function ProfileAnalyzer() {
	const [profile, setProfile] = useState('@aditya_brandforge');
	const summary = useMemo(() => summarizeProfile(profile), [profile]);
	const apiEndpoint = '/api/profile/analyze';

	return (
		<section className="panel panel--soft">
			<div className="panel__header">
				<div>
					<p className="eyebrow">Profile Lens</p>
					<h2>Measure brand trust in one glance.</h2>
				</div>
				<span className="chip">API ready</span>
			</div>

			<label className="field">
				<span>Profile handle</span>
				<input value={profile} onChange={(event) => setProfile(event.target.value)} placeholder="@username" />
			</label>

			<div className="signal-list">
				{profileSignals.map((signal) => (
					<article key={signal.label} className="signal">
						<div className="signal__top">
							<span>{signal.label}</span>
							<strong>{signal.score}/100</strong>
						</div>
						<div className="meter" aria-hidden="true">
							<span style={{ width: `${signal.score}%` }} />
						</div>
						<p>{signal.note}</p>
					</article>
				))}
			</div>

			<div className="preview-card preview-card--compact">
				<p className="preview-card__label">Recommended action</p>
				<p>{summary}</p>
			</div>

			<div className="panel__footer">
				<a className="button button--ghost" href={apiEndpoint} target="_blank" rel="noreferrer">Open API endpoint</a>
				<button className="button button--primary" type="button">Run analysis</button>
			</div>
		</section>
	);
}
