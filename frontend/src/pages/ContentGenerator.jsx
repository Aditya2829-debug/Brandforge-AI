import { useMemo, useState } from 'react';

const toneOptions = ['Professional', 'Bold', 'Playful', 'Thoughtful'];
const formatOptions = ['LinkedIn post', 'X thread', 'Instagram caption', 'Blog intro'];

function buildDraft({ topic, audience, tone, format }) {
	const subject = topic.trim() || 'your topic';
	const targetAudience = audience.trim() || 'your audience';

	return {
		headline: `${format} for ${subject}`,
		body: `Create a ${tone.toLowerCase()} ${format.toLowerCase()} about ${subject}. Make it clear, practical, and tailored for ${targetAudience}. Include a strong hook, two value points, and a clear next step.`,
		hashtags: ['#branding', '#content', '#growth', '#ai'],
	};
}

export default function ContentGenerator() {
	const [topic, setTopic] = useState('Personal branding for founders');
	const [audience, setAudience] = useState('early-stage startup founders');
	const [tone, setTone] = useState('Professional');
	const [format, setFormat] = useState('LinkedIn post');

	const draft = useMemo(
		() => buildDraft({ topic, audience, tone, format }),
		[topic, audience, tone, format],
	);

	return (
		<section className="panel panel--lift">
			<div className="panel__header">
				<div>
					<p className="eyebrow">Content Studio</p>
					<h2>Generate campaign-ready ideas.</h2>
				</div>
				<span className="chip chip--accent">Live draft</span>
			</div>

			<div className="form-grid">
				<label className="field">
					<span>Topic</span>
					<input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="What are we writing about?" />
				</label>

				<label className="field">
					<span>Audience</span>
					<input value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Who should this speak to?" />
				</label>

				<label className="field">
					<span>Tone</span>
					<select value={tone} onChange={(event) => setTone(event.target.value)}>
						{toneOptions.map((option) => (
							<option key={option}>{option}</option>
						))}
					</select>
				</label>

				<label className="field">
					<span>Format</span>
					<select value={format} onChange={(event) => setFormat(event.target.value)}>
						{formatOptions.map((option) => (
							<option key={option}>{option}</option>
						))}
					</select>
				</label>
			</div>

			<div className="preview-card">
				<p className="preview-card__label">Preview</p>
				<h3>{draft.headline}</h3>
				<p>{draft.body}</p>
				<div className="tag-row">
					{draft.hashtags.map((tag) => (
						<span key={tag} className="tag">
							{tag}
						</span>
					))}
				</div>
			</div>

			<div className="panel__footer">
				<button className="button button--primary" type="button">Generate variation</button>
				<button className="button button--ghost" type="button">Save prompt</button>
			</div>
		</section>
	);
}
