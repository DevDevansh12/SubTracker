import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import useInView from '../hooks/useInView';

export default function CTA() {
  const [ref, inView] = useInView();

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={ref} className={`fade-up ${inView ? 'visible' : ''}`}>
          <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
                Start Managing Your Subscriptions Today
              </h2>
              <p className="text-violet-200 text-base sm:text-lg mb-10 max-w-xl mx-auto">
                Join thousands of users who save money and stay on top of their subscriptions with SubTracker.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-white text-violet-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-violet-50 transition-colors shadow-lg"
                >
                  Sign Up Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#dashboard-preview"
                  className="flex items-center gap-2 bg-white/10 text-white border border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  <Play className="w-4 h-4" /> View Demo
                </a>
              </div>
              <p className="text-violet-300 text-sm mt-6">No credit card required · Free forever plan available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
