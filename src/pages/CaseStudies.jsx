import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay }
});

export default function CaseStudies() {
  const [filterProject, setFilterProject] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ['caseStudies'],
    queryFn: () => base44.entities.CaseStudy.list('-created_date', 100),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('name', 100),
  });

  const projectNames = ['All', ...new Set(projects.map(p => p.name))];
  const categories = ['All', 'Tech & AI', 'Industry', 'Asset / RWA'];

  const filtered = caseStudies.filter(cs => {
    const matchProject = filterProject === 'All' || cs.project_name === filterProject;
    const matchCategory = filterCategory === 'All' || cs.project_category === filterCategory;
    return matchProject && matchCategory;
  });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-green-brand/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.p {...fadeUp(0.1)} className="text-xs uppercase tracking-widest text-green-brand mb-3">Results</motion.p>
          <motion.h1 {...fadeUp(0.2)} className="text-4xl sm:text-5xl font-bold text-white mb-4">Case Studies</motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-white/50 max-w-xl mx-auto font-light text-lg">
            Real-world impact across technology, industry, and capital.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col sm:flex-row gap-4 justify-center">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterCategory === cat ? 'bg-green-brand text-navy' : 'glass text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl glass animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <TrendingUp size={40} className="mx-auto mb-4 opacity-30" />
            <p>No case studies yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((cs, i) => (
              <motion.div key={cs.id} {...fadeUp(i * 0.07)}>
                <div className="p-7 rounded-2xl glass glass-hover transition-all duration-300 h-full">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{cs.project_name}</h3>
                      {cs.location && (
                        <div className="flex items-center gap-1.5 text-white/40 text-xs mt-1">
                          <MapPin size={11} /> {cs.location}
                        </div>
                      )}
                    </div>
                    {cs.metric && (
                      <span className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold bg-gold-brand/15 text-gold-brand border border-gold-brand/20">
                        {cs.metric}
                      </span>
                    )}
                  </div>
                  {cs.project_category && (
                    <span className="inline-block mb-3 text-xs text-green-brand bg-green-brand/10 px-2.5 py-1 rounded-full">
                      {cs.project_category}
                    </span>
                  )}
                  {cs.description && (
                    <p className="text-white/55 text-sm leading-relaxed">{cs.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}