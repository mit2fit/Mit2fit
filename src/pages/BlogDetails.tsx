import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../components/BlogSection';
import { ArrowLeft, History, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function BlogDetails() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === Number(id));

  if (!post) return <div className="py-40 text-center text-zinc-500 uppercase font-mono tracking-widest">Protocol not found.</div>;

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 md:pt-40 bg-paper text-ink min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-6 pb-16 md:pb-32">
        <Link to="/blog" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 hover:text-brand transition-colors mb-10 md:mb-16 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Archive
        </Link>

        <header className="mb-10 md:mb-20">
          <div className="flex items-center gap-4 mb-6 font-mono text-[10px] uppercase tracking-widest">
            <span className="bg-brand text-black px-2 py-1 font-bold">{post.category}</span>
            <span className="text-zinc-600 font-bold">{post.date}</span>
            <span className="text-zinc-600">{post.readTime}</span>
          </div>
          <h1 className="text-2xl sm:text-5xl md:text-8xl mb-8 md:mb-10 leading-none tracking-tighter uppercase font-black italic break-words">{post.title}</h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed border-l-2 border-edge pl-8 italic">{post.excerpt}</p>
        </header>

        <div className="aspect-video bg-zinc-900 border border-edge p-2 mb-12 md:mb-24 grayscale group overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60" />
        </div>

        <div className="markdown-body p-6 md:p-16 bg-surface border border-edge">
          <h2>Protocol Synthesis</h2>
          <p>
            In the pursuit of peak physical conditioning, we often rely on tradition over data. However, recent advancements in cellular biology reveal that the "work harder" mantra is only half the story. To truly optimize for hypertrophy and strength, we must understand the signaling pathways at play.
          </p>
          
          <h2>Cellular Transmission</h2>
          <p>
            Mechanical tension remains the primary driver of the mTOR pathway. When we expose muscle fibers to high levels of tension, it triggers a cascade of protein synthesis that leads to fiber thickening. But tension alone isn't enough; it must be sustained and applied through the full range of motion.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12 bg-black p-8 border border-edge">
            <div>
              <h4 className="text-brand text-xs font-bold mb-4 uppercase tracking-widest">01 / Overload</h4>
              <p className="text-zinc-500 text-sm">Incremental increases in tension over time to force metabolic adaptation.</p>
            </div>
            <div>
              <h4 className="text-brand text-xs font-bold mb-4 uppercase tracking-widest">02 / Signal</h4>
              <p className="text-zinc-500 text-sm">Balancing sets and reps against neural recovery capacity (CNS restoration).</p>
            </div>
          </div>

          <h2>Practical Methodology</h2>
          <p>
            For the elite trainee, this means focusing on slow eccentrics and controlled concentrics. Stop counting calories and start counting signals. Are you giving your body a reason to change?
          </p>
        </div>

        <footer className="mt-20 pt-12 border-t border-edge flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8">
            <button className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest font-bold text-zinc-500 hover:text-white transition-colors">
              <Share2 size={14} className="text-brand" /> Share Protocol
            </button>
          </div>
          <p className="font-mono text-[10px] uppercase text-zinc-700 tracking-[0.4em] font-black">Mit2Fit Performance Intelligence</p>
        </footer>
      </div>
    </motion.article>
  );
}
