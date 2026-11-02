import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../components/BlogSection';
import { History, Search, ArrowRight } from 'lucide-react';

export default function BlogList() {
  return (
    <main className="pt-32 pb-16 md:pt-40 md:pb-32 bg-paper text-ink min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 md:mb-24 border-b border-edge pb-12 md:pb-16">
          <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] mb-4 block">Research Archive</span>
          <h1 className="text-3xl sm:text-7xl md:text-9xl mb-8 tracking-tighter break-words">Fitness <br /><span className="text-brand">Science.</span></h1>
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">Expert deep dives into performance physiology, biomechanics, and nutrition protocols. No fluff, just biological data.</p>
            <div className="relative w-full md:w-96 border-b border-edge">
              <input 
                type="text" 
                placeholder="SEARCH RESEARCH" 
                className="w-full bg-transparent py-4 outline-none focus:border-brand transition-colors font-mono text-[10px] tracking-widest text-white uppercase"
              />
              <Search className="absolute right-0 top-4 opacity-40 text-brand" size={16} />
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-px bg-edge border border-edge">
          {BLOG_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-paper p-8 md:p-12 hover:bg-zinc-900 transition-all border-edge"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="flex justify-between items-start mb-10">
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">{post.date}</span>
                  <div className="bg-brand/10 text-brand px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-brand/20">
                    {post.category}
                  </div>
                </div>
                <h3 className="text-2xl md:text-5xl font-black mb-6 group-hover:text-brand transition-colors italic tracking-tighter leading-none">
                  {post.title}
                </h3>
                <p className="text-zinc-500 text-lg leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-brand">
                  Access Protocol <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
