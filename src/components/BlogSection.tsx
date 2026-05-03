import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, History } from 'lucide-react';

export const BLOG_POSTS = [
  {
    id: 1,
    title: "The Hypertrophy Signal: mTOR and Mechanical Tension",
    excerpt: "Understanding the biological pathways that trigger muscle growth. Why tension is king.",
    date: "MAY 01, 2026",
    category: "PHYSIOLOGY",
    readTime: "8 MIN READ",
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Metabolic Flexibility: Burn Fat and Carbohydrates Efficiently",
    excerpt: "How to train your body to switch fuel sources for better endurance and body composition.",
    date: "APR 25, 2026",
    category: "BIO-ENERGETICS",
    readTime: "12 MIN READ",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "CNS Recovery: The Forgotten Variable in Heavy Lifting",
    excerpt: "Your muscles might be ready, but is your brain? Signs of neural fatigue and how to fix it.",
    date: "APR 18, 2026",
    category: "RECOVERY",
    readTime: "6 MIN READ",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800"
  }
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-16 md:py-32 bg-paper border-b border-edge">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10 md:mb-16">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4 tracking-[0.3em]">Fitness Science / Archive</h2>
            <h3 className="text-5xl md:text-7xl uppercase tracking-tighter">Applied <br /> <span className="text-brand italic">Methodology</span></h3>
          </div>
          <Link to="/blog" className="text-xs text-brand underline uppercase font-bold tracking-widest hover:text-white transition-colors hidden md:block">
            View All Articles
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-px bg-edge border border-edge">
          {BLOG_POSTS.slice(0, 2).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group cursor-pointer bg-paper p-8 md:p-12"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="flex justify-between items-start mb-8">
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">{post.date}</span>
                  <div className="bg-brand/10 text-brand px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-brand/20">
                    {post.category}
                  </div>
                </div>
                <h4 className="text-3xl md:text-4xl font-black mb-6 group-hover:text-brand transition-colors tracking-tighter leading-none italic">
                  {post.title}
                </h4>
                <p className="text-zinc-500 line-clamp-2 mt-2 text-lg leading-relaxed mb-8">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-brand group-hover:gap-6 transition-all">
                  Read Article <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <Link to="/blog" className="md:hidden mt-12 block text-center text-xs text-brand underline uppercase font-bold tracking-widest">
          View All Articles
        </Link>
      </div>
    </section>
  );
}
