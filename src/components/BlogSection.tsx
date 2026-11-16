import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';

export default function BlogSection() {
  return (
    <section id="blog" className="py-16 md:py-32 bg-paper border-b border-edge">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10 md:mb-16">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4 tracking-[0.3em]">
              Fitness Science / Archive
            </h2>
            <h3 className="text-5xl md:text-7xl uppercase tracking-tighter">
              Applied <br /> <span className="text-brand italic">Methodology</span>
            </h3>
          </div>
          <Link
            to="/blog"
            className="text-xs text-brand underline uppercase font-bold tracking-widest hover:text-white transition-colors hidden md:block whitespace-nowrap shrink-0"
          >
            View All Protocols
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-px bg-edge border border-edge">
          {BLOG_POSTS.slice(0, 2).map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group bg-paper hover:bg-zinc-900/90 transition-colors"
            >
              <Link
                to={`/blog/${post.id}`}
                className="flex flex-col justify-between h-full p-8 md:p-12"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    <span className="text-brand font-bold">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{post.readTime}</span>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black mb-6 group-hover:text-brand transition-colors tracking-tighter leading-none italic">
                    {post.title}
                  </h4>
                  <p className="text-zinc-400 line-clamp-2 mt-2 text-lg leading-relaxed mb-8">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-brand group-hover:gap-6 transition-all">
                  Access Protocol <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link
          to="/blog"
          className="md:hidden mt-12 block text-center text-xs text-brand underline uppercase font-bold tracking-widest"
        >
          View All Protocols
        </Link>
      </div>
    </section>
  );
}
