export interface FitnessSciencePost {
  id: string;
  title: string;
  excerpt: string;
  publishedOn: string;
  category: string;
  readTime: string;
  image: string;
  sections: { heading: string; paragraphs: string[] }[];
  references: { label: string; url: string }[];
}

const legacyPosts = [
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

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

const weeklyPosts = Object.values(
  import.meta.glob<FitnessSciencePost>('./blog-posts/*.ts', { eager: true, import: 'default' }),
)
  .sort((first, second) => second.publishedOn.localeCompare(first.publishedOn))
  .map((post) => ({
    ...post,
    date: dateFormatter.format(new Date(post.publishedOn)).toUpperCase(),
  }));

export const BLOG_POSTS = [...weeklyPosts, ...legacyPosts];
