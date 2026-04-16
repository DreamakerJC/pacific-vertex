import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Factory, TrendingUp } from 'lucide-react';

const categories = ['All', 'Tech & AI', 'Industry', 'Asset / RWA'];

const categoryConfig = {
  'Tech & AI':    { color: '#4A9EFF', icon: Cpu },
  'Industry':     { color: '#00C48C', icon: Factory },
  'Asset / RWA':  { color: '#D4AF37', icon: TrendingUp },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const cardReveal = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.25 } }
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }
});

export default function Projects() {
  const [searchParams] = useSearchParams();
  const defaultCat = searchParams.get('category') || 'All';
  const [active, setActive] = useState(categories.includes(defaultCat) ? defaultCat : 'All');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date', 100),
  });

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  return (
    <div className="min-h-screen bg-navy pt-24">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-500/6 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.p {...fadeUp(0.1)} className="text-xs uppercase tracking-widest text-green-brand mb-3">Our Work</motion.p>
          <motion.h1 {...fadeUp(0.2)} className="text-4xl sm:text-5xl font-bold text-white mb-4">Projects & Solutions</motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-white/50 max-w-xl mx-auto text-lg font-light">
            From AI systems to industrial solutions and asset structuring.
          </motion.p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                active === cat ? 'bg-gold-brand text-navy' : 'glass text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                className="h-52 rounded-2xl glass animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 text-white/30"
          >
            <p className="text-lg">No projects in this category yet.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((project) => {
                const config = categoryConfig[project.category] || { color: '#4A9EFF', icon: Cpu };
                const Icon = config.icon;
                return (
                  <motion.div key={project.id} variants={cardReveal}>
                    <Link
                      to={`/projects/${project.id}`}
                      className="group block p-7 rounded-2xl glass glass-hover transition-all duration-300 h-full relative overflow-hidden"
                    >
                      {/* Top accent bar — slides in on hover */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-2xl"
                        style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}60)` }}
                      />

                      {/* Glow on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                        style={{ background: `radial-gradient(220px circle at 50% 0%, ${config.color}0D, transparent 70%)` }}
                      />

                      <div className="flex items-start justify-between mb-5 relative">
                        <motion.div
                          whileHover={{ scale: 1.12, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: config.color + '18', border: `1px solid ${config.color}30` }}
                        >
                          <Icon size={18} style={{ color: config.color }} />
                        </motion.div>
                        {project.category && (
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{ color: config.color, backgroundColor: config.color + '15' }}
                          >
                            {project.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2 relative">{project.name}</h3>
                      <p className="text-white/45 text-sm leading-relaxed mb-5 line-clamp-3 relative">{project.short_description}</p>

                      <motion.span
                        className="flex items-center gap-1.5 text-sm font-medium text-white/40 group-hover:text-white transition-colors relative"
                      >
                        View Details
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}