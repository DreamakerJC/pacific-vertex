import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <span className="w-2 h-5 bg-gold-brand rounded-sm" />
                <span className="w-1.5 h-3.5 bg-green-brand rounded-sm" />
                <span className="w-1 h-2 bg-blue-400 rounded-sm" />
              </div>
              <span className="text-lg font-semibold text-white">Pacific <span className="text-gold-brand">Vertex</span></span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Building the bridge between Technology, Industry & Capital.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/case-studies', 'Case Studies'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-white/50 text-sm hover:text-gold-brand transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillars */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">Our Pillars</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-white/50">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Tech & AI Solutions
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <span className="w-2 h-2 rounded-full bg-green-brand" /> Industry & Smart Solutions
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <span className="w-2 h-2 rounded-full bg-gold-brand" /> Asset & RWA Advisory
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs">© 2025 Pacific Vertex. All rights reserved.</p>
          <p className="text-white/20 text-xs">Technology · Industry · Capital</p>
        </div>
      </div>
    </footer>
  );
}