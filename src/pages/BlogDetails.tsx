import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, findBlogPostById } from '../data/blogPosts';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  CheckSquare,
  Square,
  Play,
  Copy,
  RotateCcw,
  ExternalLink,
  FlaskConical,
} from 'lucide-react';
import { motion } from 'motion/react';

const CHECKLIST_STORAGE_KEY = 'mit2fit_protocol_checklist_v1';

function loadChecklistState(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // Ignore parse failures
  }
  return {};
}

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = useMemo(() => findBlogPostById(id), [id]);

  const [completedStepMap, setCompletedStepMap] = useState<Record<string, string[]>>(loadChecklistState);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [post?.id]);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(completedStepMap));
    } catch {
      // Ignore storage failures
    }
  }, [completedStepMap]);

  if (!post) {
    return (
      <main className="pt-40 pb-32 bg-paper text-ink min-h-screen px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6 border border-edge bg-surface p-12">
          <h1 className="text-3xl font-black uppercase tracking-tight">Protocol Not Found</h1>
          <p className="text-zinc-400 text-base">
            The requested research protocol could not be located in the archive.
          </p>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={14} />
            Back to Fitness Science
          </Link>
        </div>
      </main>
    );
  }

  const completedSteps = completedStepMap[post.id] || [];
  const totalSteps = post.protocolSpec.steps.length;
  const completionPct = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;

  const toggleStep = (stepId: string) => {
    setCompletedStepMap((prev) => {
      const current = prev[post.id] || [];
      const next = current.includes(stepId)
        ? current.filter((item) => item !== stepId)
        : [...current, stepId];
      return { ...prev, [post.id]: next };
    });
  };

  const resetChecklist = () => {
    setCompletedStepMap((prev) => ({ ...prev, [post.id]: [] }));
  };

  const handleApplyToTracker = () => {
    try {
      localStorage.setItem('mit2fit_pending_protocol', post.id);
    } catch {
      // Ignore storage error
    }
    navigate(`/tracker?protocol=${encodeURIComponent(post.id)}`);
  };

  const handleShareProtocol = async () => {
    const shareUrl = `${window.location.origin}/blog/${post.id}`;
    const shareText = `${post.title} — ${post.protocolSpec.objective}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Mit2Fit Protocol: ${post.title}`,
          text: shareText,
          url: shareUrl,
        });
        setShareFeedback('Protocol shared');
        setTimeout(() => setShareFeedback(null), 3000);
        return;
      } catch {
        // User canceled or Web Share unsupported in iframe; fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${post.title}\n${shareUrl}`);
      setShareFeedback('Protocol link copied to clipboard');
    } catch {
      setShareFeedback(`Link ready: /blog/${post.id}`);
    }
    setTimeout(() => setShareFeedback(null), 3000);
  };

  const handleCopyProtocolSummary = async () => {
    const lines = [
      `MIT2FIT SCIENCE PROTOCOL — ${post.title}`,
      `Category: ${post.category} | Target: ${post.protocolSpec.objective}`,
      '',
      'Parameters:',
      ...post.protocolSpec.metrics.map(
        (m) => `• ${m.label}: ${m.value}${m.unit ? ` ${m.unit}` : ''}`,
      ),
      '',
      'Execution Steps:',
      ...post.protocolSpec.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.instruction}`),
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setShareFeedback('Protocol summary copied to clipboard');
    } catch {
      setShareFeedback('Unable to access clipboard automatically');
    }
    setTimeout(() => setShareFeedback(null), 3000);
  };

  const relatedPosts = BLOG_POSTS.filter((entry) => entry.id !== post.id).slice(0, 2);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 md:pt-40 bg-paper text-ink min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-6 pb-20 md:pb-32">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 md:mb-14">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] font-bold text-zinc-400 hover:text-brand transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Fitness Science
          </Link>

          <button
            type="button"
            onClick={handleApplyToTracker}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap shrink-0"
          >
            <Play size={13} />
            <span>Apply Protocol in Tracker</span>
          </button>
        </div>

        <header className="mb-10 md:mb-14">
          {/* Zero-pill unboxed metadata */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <span className="text-brand font-bold">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{post.date}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-400 tabular-nums">{post.protocolSpec.code}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl mb-6 leading-[0.98] tracking-tighter uppercase font-black italic break-words text-white">
            {post.title}
          </h1>
          <p className="text-lg md:text-2xl text-zinc-300 font-light leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
        </header>

        {/* Hero Visual with Graceful CSS Fallback */}
        <div className="aspect-video bg-zinc-900 border border-edge p-1.5 mb-12 md:mb-16 overflow-hidden">
          {!imageError && post.image ? (
            <img
              src={post.image}
              alt={post.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover opacity-85"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-stone-900 to-black flex flex-col items-center justify-center p-8 text-center">
              <FlaskConical className="w-10 h-10 text-brand mb-3" />
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                {post.category} · {post.protocolSpec.code}
              </div>
              <div className="text-xl font-black text-white mt-1 max-w-lg">{post.title}</div>
            </div>
          )}
        </div>

        {/* Interactive Actionable Protocol Console */}
        <section
          aria-label="Actionable Training Protocol"
          className="mb-12 md:mb-16 border border-edge bg-surface p-6 md:p-10 space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-edge pb-6">
            <div className="space-y-2 max-w-xl">
              <div className="font-mono text-xs uppercase tracking-widest text-brand font-bold">
                Executable Training Protocol
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight normal-case">
                {post.protocolSpec.objective}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleApplyToTracker}
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap shrink-0"
              >
                <Play size={14} />
                <span>{post.protocolSpec.trackerPreset.label}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyProtocolSummary}
                className="inline-flex items-center gap-2 px-4 py-3 border border-edge bg-paper text-zinc-200 hover:text-white hover:border-brand font-mono text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                title="Copy full protocol steps & metrics"
              >
                <Copy size={14} className="text-brand" />
                <span>Copy Steps</span>
              </button>
            </div>
          </div>

          {/* Quantitative Parameter Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {post.protocolSpec.metrics.map((metric) => (
              <div key={metric.label} className="bg-paper border border-edge p-4">
                <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  {metric.label}
                </div>
                <div className="font-mono text-xl md:text-2xl font-bold text-white tabular-nums mt-1">
                  {metric.value}
                </div>
                {metric.unit && (
                  <div className="font-mono text-[11px] text-zinc-400 mt-0.5">{metric.unit}</div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Execution Checklist */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-bold">
                Protocol Execution Checklist{' '}
                <span className="text-brand tabular-nums ml-2">
                  {completedSteps.length} / {totalSteps} verified ({completionPct}%)
                </span>
              </div>
              {completedSteps.length > 0 && (
                <button
                  type="button"
                  onClick={resetChecklist}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500 hover:text-white transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {post.protocolSpec.steps.map((step, index) => {
                const isDone = completedSteps.includes(step.id);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    aria-pressed={isDone}
                    className={`w-full text-left p-4 border transition-colors flex items-start gap-3.5 ${
                      isDone
                        ? 'bg-paper/90 border-brand/50 text-zinc-200'
                        : 'bg-paper/50 border-edge hover:border-zinc-600 text-zinc-300'
                    }`}
                  >
                    <span className="mt-0.5 text-brand shrink-0">
                      {isDone ? <CheckSquare size={18} /> : <Square size={18} className="text-zinc-500" />}
                    </span>
                    <div className="space-y-1">
                      <div className={`text-sm font-bold ${isDone ? 'line-through text-zinc-400' : 'text-white'}`}>
                        0{index + 1}. {step.title}
                      </div>
                      <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Research Paper Narrative Body */}
        <div className="markdown-body p-6 md:p-14 bg-surface border border-edge">
          <div className="max-w-prose">
            {post.sections.map((section) => (
              <section key={section.heading} className="mb-10 last:mb-0">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </section>
            ))}

            <section className="pt-8 border-t border-edge">
              <h2>Peer-Reviewed References</h2>
              <ul className="space-y-3 list-none pl-0">
                {post.references.map((reference) => (
                  <li key={reference.url} className="text-sm text-zinc-400">
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 text-brand hover:text-white underline transition-colors"
                    >
                      <span>{reference.label}</span>
                      <ExternalLink size={13} className="shrink-0 mt-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Share & Related Protocols Footer */}
        <footer className="mt-12 pt-10 border-t border-edge space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleShareProtocol}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-edge bg-surface hover:border-brand font-mono text-xs uppercase tracking-widest font-bold text-zinc-200 hover:text-white transition-colors"
              >
                {shareFeedback ? <Check size={14} className="text-brand" /> : <Share2 size={14} className="text-brand" />}
                <span>{shareFeedback || 'Share Protocol'}</span>
              </button>

              <button
                type="button"
                onClick={handleApplyToTracker}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
              >
                <Play size={13} />
                <span>Launch Protocol in Tracker</span>
              </button>
            </div>
            <p className="font-mono text-[10px] uppercase text-zinc-600 tracking-[0.35em] font-black">
              Mit2Fit Performance Intelligence
            </p>
          </div>

          {relatedPosts.length > 0 && (
            <div className="space-y-4">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Continue Exploring Protocols
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/blog/${rel.id}`}
                    className="group border border-edge bg-surface/50 hover:bg-zinc-900 p-5 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-brand mb-2">
                        {rel.category} · {rel.readTime}
                      </div>
                      <div className="text-base font-bold text-white group-hover:text-brand transition-colors">
                        {rel.title}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 group-hover:text-white">
                      <span>Access Protocol</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </footer>
      </div>
    </motion.article>
  );
}
