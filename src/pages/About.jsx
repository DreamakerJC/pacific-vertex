import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' }
});

const pillars = [
  {
    color: '#4A9EFF',
    name: 'Technology',
    tagline: 'The Engine',
    desc: 'We harness AI, automation, and digital infrastructure to drive efficiency and unlock what was previously impossible. Technology is not just a tool — it is our foundation.',
  },
  {
    color: '#00C48C',
    name: 'Industry',
    tagline: 'The Bridge',
    desc: 'We connect cutting-edge solutions to real-world operations. From manufacturing to logistics to agriculture, we bring smart solutions to industries that drive the global economy.',
  },
  {
    color: '#D4AF37',
    name: 'Wealth',
    tagline: 'The Outcome',
    desc: 'Capital follows value creation. By transforming assets and businesses into structured financial opportunities, we help our partners unlock liquidity, scale, and lasting prosperity.',
  },
];

const values = [
  { label: 'Integrity', desc: 'We operate with full transparency and accountability at every level.' },
  { label: 'Precision', desc: 'Every solution we build is crafted with careful attention to detail.' },
  { label: 'Scale', desc: 'We think globally from day one — building for the long game.' },
  { label: 'Partnership', desc: 'Your growth is our success. We are invested in your outcomes.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-navy pt-24">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-brand/5 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.p {...fadeUp(0.1)} className="text-xs uppercase tracking-widest text-gold-brand mb-4">Our Story</motion.p>
          <motion.h1 {...fadeUp(0.2)} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            From Technology to Industry,<br />
            From Industry to <span className="text-gold-brand">Wealth</span>
          </motion.h1>
          <motion.p {...fadeUp(0.35)} className="text-lg text-white/55 leading-relaxed font-light max-w-2xl mx-auto">
            Pacific Vertex was founded on a simple but powerful conviction: that the most transformative value is created at the intersection of domains — where technology meets the real world, and where real-world performance unlocks capital.
          </motion.p>
        </div>
      </section>

      {/* The Three Pillars */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Our Framework</p>
          <h2 className="text-3xl font-bold text-white">The Pacific Vertex Model</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ color, name, tagline, desc }, i) => (
            <motion.div key={i} {...fadeUp(i * 0.12)}>
              <div className="p-8 rounded-2xl glass h-full" style={{ borderColor: color + '25' }}>
                <div className="w-10 h-10 rounded-xl mb-5" style={{ backgroundColor: color + '20', border: `1px solid ${color}30` }}>
                  <span className="w-full h-full flex items-center justify-center text-xl font-bold" style={{ color }}>
                    {name[0]}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color }}>{tagline}</p>
                <h3 className="text-xl font-bold text-white mb-4">{name}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Arrow connector */}
        <motion.div {...fadeUp(0.3)} className="flex items-center justify-center gap-4 my-10 text-white/30 text-sm">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-400" /> Technology</span>
          <ArrowRight size={16} />
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-brand" /> Industry</span>
          <ArrowRight size={16} />
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gold-brand" /> Wealth</span>
        </motion.div>
      </section>

      {/* Values */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">What Drives Us</p>
            <h2 className="text-3xl font-bold text-white">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ label, desc }, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="p-6 rounded-2xl glass text-center">
                <h4 className="text-lg font-semibold text-gold-brand mb-3">{label}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-2xl font-bold text-white mb-4">Work With Pacific Vertex</h2>
          <p className="text-white/50 mb-8 text-sm leading-relaxed">
            Whether you're scaling a business, digitising assets, or seeking a strategic partner — we're ready to build with you.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-brand text-navy font-semibold hover:bg-gold-light transition-all duration-200">
            Get in Touch <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}