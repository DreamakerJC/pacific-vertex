import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Cpu, Factory, TrendingUp, MapPin, BarChart2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' }
});

const pillars = [
  {
    icon: Cpu,
    color: '#4A9EFF',
    label: 'Tech & AI Solutions',
    desc: 'We build smart systems that automate operations and scale businesses.',
    link: '/projects?category=Tech+%26+AI',
  },
  {
    icon: Factory,
    color: '#00C48C',
    label: 'Industry & Smart Solutions',
    desc: 'We connect technology with real-world industries for scalable growth.',
    link: '/projects?category=Industry',
  },
  {
    icon: TrendingUp,
    color: '#D4AF37',
    label: 'Asset & RWA Advisory',
    desc: 'We transform assets into structured financial opportunities.',
    link: '/projects?category=Asset+%2F+RWA',
  },
];

export default function Home() {
  const { data: caseStudies = [] } = useQuery({
    queryKey: ['caseStudies'],
    queryFn: () => base44.entities.CaseStudy.list('-created_date', 6),
  });

  return (
    <div className="min-h-screen bg-navy">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(74,158,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-green-brand/6 blur-[100px] pointer-events-none" />
        <div className="absolute top-20 left-10 w-[300px] h-[300px] rounded-full bg-gold-brand/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
          {/* Tag line */}
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-green-brand animate-pulse" />
            <span className="text-xs font-medium tracking-widest text-white/60 uppercase">Pacific Vertex</span>
          </motion.div>

          <motion.h1 {...fadeUp(0.2)} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Building the Bridge Between{' '}
            <span className="block mt-2">
              <span className="text-blue-400">Technology</span>,{' '}
              <span className="text-green-brand">Industry</span> &{' '}
              <span className="text-gold-brand">Capital</span>
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.35)} className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            We help businesses grow, digitise assets, and unlock global opportunities.
          </motion.p>

          <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="px-8 py-3.5 rounded-xl border border-white/15 text-white font-medium hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Explore Projects
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-xl bg-gold-brand text-navy font-semibold hover:bg-gold-light transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-gold-brand/20"
            >
              Partner With Us
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/60" />
          <span className="text-[10px] uppercase tracking-widest text-white/60">Scroll</span>
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">What We Do</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Three Core Pillars</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, color, label, desc, link }, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1 + 0.1)}>
              <Link
                to={link}
                className="group block p-7 rounded-2xl glass glass-hover transition-all duration-300 h-full"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: color + '20', border: `1px solid ${color}30` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{label}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{desc}</p>
                <span className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color }}>
                  Learn more <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      {caseStudies.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Impact</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Case Studies</h2>
            </div>
            <Link to="/case-studies" className="text-gold-brand text-sm font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.slice(0, 6).map((cs, i) => (
              <motion.div key={cs.id} {...fadeUp(i * 0.08)}>
                <Link to={`/case-studies`} className="group block p-6 rounded-2xl glass glass-hover transition-all duration-300 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gold-brand/15 text-gold-brand">
                      {cs.metric}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{cs.project_name}</h4>
                  {cs.location && (
                    <div className="flex items-center gap-1.5 text-white/40 text-xs mb-3">
                      <MapPin size={11} /> {cs.location}
                    </div>
                  )}
                  <p className="text-white/50 text-sm line-clamp-2 leading-relaxed">{cs.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-gold-brand text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Case Study <ChevronRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── STATS STRIP ── */}
      <section className="border-y border-white/5 py-12 mt-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50+', label: 'Projects Delivered' },
            { value: '20+', label: 'Countries Reached' },
            { value: '$2B+', label: 'Assets Structured' },
            { value: '99%', label: 'Client Satisfaction' },
          ].map(({ value, label }, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)}>
              <p className="text-3xl font-bold text-gold-brand mb-1">{value}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Build Something<br />Extraordinary?</h2>
          <p className="text-white/50 mb-8 text-lg font-light">Let's unlock your next growth opportunity together.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-gold-brand text-navy font-semibold text-lg hover:bg-gold-light transition-all duration-200 shadow-xl shadow-gold-brand/20"
          >
            Partner With Us <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}