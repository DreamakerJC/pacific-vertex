import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail, Globe, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay }
});

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    await base44.entities.ContactSubmission.create(form);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-gold-brand/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.p {...fadeUp(0.1)} className="text-xs uppercase tracking-widest text-gold-brand mb-3">Let's Connect</motion.p>
          <motion.h1 {...fadeUp(0.2)} className="text-4xl sm:text-5xl font-bold text-white mb-4">Partner With Us</motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-white/50 max-w-xl mx-auto font-light text-lg">
            Tell us about your goals and we'll show you how Pacific Vertex can help.
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info column */}
          <motion.div {...fadeUp(0.15)} className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl glass">
              <h3 className="text-white font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-3">
                {[
                  'We review your message within 24 hours',
                  'A senior team member will reach out directly',
                  'We schedule a focused discovery call',
                  'We propose a tailored engagement',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/55">
                    <span className="w-5 h-5 rounded-full bg-gold-brand/20 text-gold-brand text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl glass space-y-4">
              <h3 className="text-white font-semibold mb-1">Our Expertise</h3>
              {[
                { color: '#4A9EFF', label: 'Tech & AI Solutions' },
                { color: '#00C48C', label: 'Industry & Smart Solutions' },
                { color: '#D4AF37', label: 'Asset & RWA Advisory' },
              ].map(({ color, label }, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-3">
            {submitted ? (
              <div className="p-10 rounded-2xl glass text-center">
                <div className="w-14 h-14 rounded-full bg-green-brand/15 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={28} className="text-green-brand" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out. A member of our team will be in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-7 rounded-2xl glass space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wide">Full Name *</Label>
                    <Input
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="John Smith"
                      required
                      className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-gold-brand/50"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wide">Email *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="john@company.com"
                      required
                      className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-gold-brand/50"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wide">Company</Label>
                  <Input
                    value={form.company}
                    onChange={e => handleChange('company', e.target.value)}
                    placeholder="Your Company Ltd."
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-gold-brand/50"
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wide">Message *</Label>
                  <Textarea
                    value={form.message}
                    onChange={e => handleChange('message', e.target.value)}
                    placeholder="Tell us about your project, goals, or what you're looking to solve..."
                    rows={5}
                    required
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-gold-brand/50 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting || !form.name || !form.email || !form.message}
                  className="w-full bg-gold-brand text-navy hover:bg-gold-light font-semibold py-3 gap-2"
                >
                  {submitting ? 'Sending...' : (
                    <><Send size={16} /> Send Message</>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}