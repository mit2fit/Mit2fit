import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, EnrichedBlogPost } from '../data/blogPosts';
import { Search, ArrowRight, Play, CheckCircle2, RotateCcw } from 'lucide-react';

export default function BlogList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
    return ['ALL', ...unique];
  }, []);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchesCat = selectedCategory === 'ALL' || post.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.protocolSpec.code.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleLaunchProtocolInTracker = (post: EnrichedBlogPost) => {
    try {
      localStorage.setItem('mit2fit_pending_protocol', post.id);
    } catch {
      // Ignore storage failures
    }
    navigate(`/tracker?protocol=${encodeURIComponent(post.id)}`);
  };

  return (
    <main className="pt-32 pb-16 md:pt-40 md:pb-32 bg-paper text-ink min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 md:mb-16 border-b border-edge pb-12">
          <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] mb-4 block">
            Research Archive
          </span>
          <h1 className="text-3xl sm:text-7xl md:text-8xl mb-8 tracking-tighter break-words">
            Fitness <br />
            <span className="text-brand">Science.</span>
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
              Evidence-based deep dives into performance physiology, biomechanics, and conditioning—paired with executable protocols you can apply straight into your workout tracker.
            </p>
            <div className="relative w-full md:w-96 border-b border-edge focus-within:border-brand transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH RESEARCH OR PROTOCOL"
                aria-label="Search research protocols"
                className="w-full bg-transparent py-3.5 pr-10 outline-none font-mono text-xs tracking-wider text-white placeholder-zinc-600 uppercase"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-0 top-3 text-zinc-500 hover:text-white p-1 transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
              ) : (
                <Search className="absolute right-0 top-3.5 opacity-50 text-brand pointer-events-none" size={16} />
              )}
            </div>
          </div>

          {/* Interactive Category Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-edge/60">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter science protocols by category">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 border ${
                      isActive
                        ? 'bg-brand text-black border-brand font-bold'
                        : 'bg-surface/60 text-zinc-400 border-edge hover:text-white hover:border-zinc-600'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Protocols' : cat}
                  </button>
                );
              })}
            </div>
            <div className="font-mono text-xs text-zinc-500 tabular-nums">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'protocol' : 'protocols'} available
            </div>
          </div>
        </header>

        {filteredPosts.length === 0 ? (
          <div className="border border-edge bg-surface/40 p-12 text-center space-y-4">
            <p className="text-zinc-300 text-lg font-medium">
              No fitness science protocols match "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-px bg-edge border border-edge">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.06 }}
                className="group bg-paper p-8 md:p-12 hover:bg-zinc-900/90 transition-colors flex flex-col justify-between gap-8"
              >
                <div>
                  {/* Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">
                    <span className="text-brand font-bold">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{post.readTime}</span>
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <h2 className="text-2xl md:text-4xl font-black mb-4 text-white group-hover:text-brand transition-colors italic tracking-tighter leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </Link>

                  {/* Concise Quantitative Prescription Preview */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-edge/70 text-xs">
                    {post.protocolSpec.metrics.slice(0, 2).map((metric) => (
                      <div key={metric.label}>
                        <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                          {metric.label}
                        </div>
                        <div className="font-mono font-bold text-zinc-200 tabular-nums mt-0.5">
                          {metric.value}{' '}
                          {metric.unit && (
                            <span className="text-zinc-500 font-normal text-[11px]">{metric.unit}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explicit Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-edge">
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2.5 py-2.5 px-4 bg-brand text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Access Protocol</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleLaunchProtocolInTracker(post)}
                    className="inline-flex items-center gap-2 py-2.5 px-4 border border-edge text-zinc-300 hover:text-white hover:border-brand font-mono text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                    title={post.protocolSpec.trackerPreset.label}
                  >
                    <Play size={13} className="text-brand" />
                    <span>Apply in Tracker</span>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Quick Explainer Strip */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border border-edge bg-surface/40 px-6 py-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-brand shrink-0" />
            <span>
              Every research brief includes a step-by-step execution checklist and direct Workout Tracker preset.
            </span>
          </div>
          <Link
            to="/tracker"
            className="font-mono text-xs uppercase tracking-wider text-brand hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Open Workout Tracker →
          </Link>
        </div>
      </div>
    </main>
  );
}
