import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle, Cpu, Factory, TrendingUp } from 'lucide-react';

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

export default function ProjectDetail() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => base44.entities.Project.filter({ id }),
    select: (data) => data[0],
  });

  const { data: caseStudies = [] } = useQuery({
    queryKey: ['caseStudies', id],
    queryFn: () => base44.entities.CaseStudy.filter({ project_id: id }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-gold-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <p className="text-white/50">Project not found.</p>
        <Link to="/projects" className="text-gold-brand flex items-center gap-2 text-sm">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </div>
    );
  }

  const config = categoryConfig[project.category] || { color: '#4A9EFF', icon: Cpu };
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <Link to="/projects" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...fadeUp(0.1)} className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: config.color + '18', border: `1px solid ${config.color}30` }}>
              <Icon size={18} style={{ color: config.color }} />
            </div>
            {project.category && (
              <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ color: config.color, backgroundColor: config.color + '15' }}>
                {project.category}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{project.name}</h1>
          {project.short_description && (
            <p className="text-xl text-white/50 font-light leading-relaxed">{project.short_description}</p>
          )}
        </motion.div>

        {/* What is this */}
        {project.short_description && (
          <motion.section {...fadeUp(0.1)} className="mb-12 p-7 rounded-2xl glass">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-3">Overview</h2>
            <p className="text-white/80 leading-relaxed">{project.short_description}</p>
          </motion.section>
        )}

        {/* Problem / Solution */}
        {(project.problem || project.solution) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {project.problem && (
              <motion.div {...fadeUp(0.15)} className="p-7 rounded-2xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <h2 className="text-xs uppercase tracking-widest text-red-400/70 mb-3">The Problem</h2>
                <p className="text-white/75 leading-relaxed text-sm">{project.problem}</p>
              </motion.div>
            )}
            {project.solution && (
              <motion.div {...fadeUp(0.2)} className="p-7 rounded-2xl" style={{ background: 'rgba(0,196,140,0.06)', border: '1px solid rgba(0,196,140,0.15)' }}>
                <h2 className="text-xs uppercase tracking-widest text-green-brand/70 mb-3">Our Solution</h2>
                <p className="text-white/75 leading-relaxed text-sm">{project.solution}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Steps */}
        {project.steps?.length > 0 && (
          <motion.section {...fadeUp(0.2)} className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-6">How It Works</h2>
            <div className="space-y-4">
              {project.steps.map((step, i) => (
                <div key={i} className="flex gap-5 p-5 rounded-xl glass">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold text-navy bg-gold-brand">
                    {i + 1}
                  </div>
                  <div>
                    {step.title && <h4 className="font-semibold text-white mb-1">{step.title}</h4>}
                    {step.description && <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Value Points */}
        {project.value_points?.length > 0 && (
          <motion.section {...fadeUp(0.2)} className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-6">Value Delivered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.value_points.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl glass">
                  <CheckCircle size={16} className="text-green-brand mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">{point}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Case Studies */}
        {caseStudies.length > 0 && (
          <motion.section {...fadeUp(0.2)} className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-6">Related Case Studies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseStudies.map((cs) => (
                <div key={cs.id} className="p-5 rounded-xl glass">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gold-brand/15 text-gold-brand">{cs.metric}</span>
                  <h4 className="font-semibold text-white mt-3 mb-1">{cs.project_name}</h4>
                  {cs.location && <p className="text-white/40 text-xs flex items-center gap-1 mb-2"><MapPin size={10} /> {cs.location}</p>}
                  {cs.description && <p className="text-white/50 text-sm leading-relaxed">{cs.description}</p>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.div {...fadeUp(0.2)} className="p-8 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,196,140,0.06))', border: '1px solid rgba(212,175,55,0.15)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Interested in This Solution?</h3>
          <p className="text-white/50 text-sm mb-6">Let's discuss how we can tailor it to your business.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="px-7 py-3 rounded-xl bg-gold-brand text-navy font-semibold hover:bg-gold-light transition-colors flex items-center justify-center gap-2">
              Request Demo <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="px-7 py-3 rounded-xl glass text-white font-medium hover:bg-white/8 transition-colors flex items-center justify-center gap-2">
              Partner With Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}