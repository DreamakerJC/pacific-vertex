import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Factory, TrendingUp } from 'lucide-react';

const categories = ['All', 'Tech & AI', 'Industry', 'Asset / RWA'];

const categoryConfig = {
  'Tech & AI': { color: '#4A9EFF', icon: Cpu },
  'Industry': { color: '#00C48C', icon: Factory },
  'Asset / RWA': { color: '#D4AF37', icon: TrendingUp },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay }
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
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? 'bg-gold-brand text-navy'
                  : 'glass text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl glass animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">No projects in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => {
              const config = categoryConfig[project.category] || { color: '#4A9EFF', icon: Cpu };
              const Icon = config.icon;
              return (
                <motion.div key={project.id} {...fadeUp(i * 0.06)}>
                  <Link
                    to={`/projects/${project.id}`}
                    className="group block p-7 rounded-2xl glass glass-hover transition-all duration-300 h-full"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: config.color + '18', border: `1px solid ${config.color}30` }}
                      >
                        <Icon size={18} style={{ color: config.color }} />
                      </div>
                      {project.category && (
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ color: config.color, backgroundColor: config.color + '15' }}
                        >
                          {project.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-5 line-clamp-3">{project.short_description}</p>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                      View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}