import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiUsers,
  FiBarChart2,
  FiBell,
  FiLock,
  FiZap,
  FiGlobe,
  FiMenu,
  FiX,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiMonitor
} from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-rose-50/40 text-slate-800 font-sans selection:bg-blue-100 selection:text-slate-900" style={{ fontFamily: "Poppins, Manrope, 'Segoe UI', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-96 -left-96 h-[40rem] w-[40rem] rounded-full bg-blue-100/35 blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-rose-100/35 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-100/25 blur-3xl"></div>
      </div>

      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-cyan-600 text-sm font-bold text-white shadow-lg shadow-blue-900/20">
              SC
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900">Smart Campus</div>
              <div className="text-xs text-slate-500">Operations Platform</div>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-blue-700">Features</a>
            <a href="#metrics" className="transition hover:text-blue-700">Impact</a>
            <a href="#about" className="transition hover:text-blue-700">About</a>
            <button
              onClick={() => navigate('/login')}
              className="rounded-full border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
            >
              Sign In
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-700">
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 backdrop-blur-xl">
            <div className="space-y-3 text-sm text-slate-700">
              <a href="#features" className="block rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-blue-700">Features</a>
              <a href="#metrics" className="block rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-blue-700">Impact</a>
              <a href="#about" className="block rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-blue-700">About</a>
              <button onClick={() => navigate('/login')} className="w-full rounded-full bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 shadow-lg shadow-blue-700/20">
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>

      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-36 sm:px-6 lg:px-8 lg:pt-40">
        <div className="grid items-center gap-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-rose-900 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              Modern campus operations for bookings, tickets, and alerts
            </div>

            <div className="space-y-7">
              <div>
                <h1 className="max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                  A cleaner way to run the
                  <span className="mt-2 block bg-gradient-to-r from-blue-800 via-cyan-600 to-emerald-500 bg-clip-text text-transparent">
                    Smart Campus.
                  </span>
                </h1>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Manage resources, track incidents, automate notifications, and keep every user aligned in one polished operations platform.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-cyan-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-cyan-700"
              >
                Get Started <FiArrowRight />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                Sign In
              </button>
            </div>

            <div className="grid gap-4 pt-3 sm:grid-cols-3">
              <MiniStat icon={<FiShield />} label="Secure access" value="RBAC" />
              <MiniStat icon={<FiClock />} label="Fast workflows" value="24/7" />
              <MiniStat icon={<FiCheckCircle />} label="Reliable" value="99.9%" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-200/30 to-rose-200/30 blur-3xl"></div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.45)] sm:p-6">
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Control Center</p>
                <p className="text-sm font-semibold text-slate-900">Operational Dashboard</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DashboardCard
                icon={<FiBarChart2 />}
                title="Live analytics"
                description="Usage patterns, booking trends, and operational insights in one place."
              />
              <DashboardCard
                icon={<FiBell />}
                title="Smart alerts"
                description="Booking approvals, incident updates, and comment activity delivered instantly."
              />
              <DashboardCard
                icon={<FiUsers />}
                title="Role-based control"
                description="Clean access for student, lecturer, admin, and technician workflows."
              />
              <DashboardCard
                icon={<FiMonitor />}
                title="Unified dashboard"
                description="A clear, responsive interface built for campus teams and users."
              />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Campus Overview</p>
                  <h2 className="text-2xl font-semibold text-slate-900">Operations snapshot</h2>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  All systems healthy
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                <PillMetric label="Bookings" value="128" />
                <PillMetric label="Tickets" value="42" />
                <PillMetric label="Notifications" value="96" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Features</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Built for clarity, speed, and campus scale.</h2>
          <p className="mt-4 leading-7 text-slate-600">
            A more polished experience for managing resources, communicating updates, and keeping the entire campus workflow visible.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <FeatureCard
            icon={<FiUsers />}
            title="Role Management"
            description="Control access across students, lecturers, technicians, and administrators with a clean role model."
          />
          <FeatureCard
            icon={<FiBarChart2 />}
            title="Operational Analytics"
            description="Track usage, ticket volume, and system activity with a dashboard-style overview."
          />
          <FeatureCard
            icon={<FiBell />}
            title="Notifications"
            description="A central panel to keep users informed about approvals, ticket progress, and comments."
          />
          <FeatureCard
            icon={<FiLock />}
            title="Secure by Design"
            description="Authentication, authorization, and route protection are handled consistently across the app."
          />
          <FeatureCard
            icon={<FiZap />}
            title="Responsive UI"
            description="Works cleanly on desktop and mobile without losing structure or readability."
          />
          <FeatureCard
            icon={<FiGlobe />}
            title="Always Accessible"
            description="A single web platform for the whole campus operations flow wherever users are working."
          />
        </div>
      </section>

      <section id="metrics" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <StatBox number="500+" label="Active users supported" />
          <StatBox number="99.9%" label="Operational uptime target" />
          <StatBox number="24/7" label="Campus visibility" />
        </div>
      </section>

      <section id="about" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] sm:p-12 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Why this design</p>
              <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">A professional interface that feels calm, modern, and deliberate.</h2>
              <p className="mt-4 max-w-2xl text-slate-600 leading-7">
                Built with blue as primary and warm rose accents, professional yet approachable. The palette balances modern aesthetics with user-friendly warmth, ensuring accessibility and comfort across all interactions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
                <Badge text="Blue + rose" />
                <Badge text="High contrast & accessible" />
                <Badge text="Professional & inviting" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <FiMonitor size={22} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Design summary</p>
                  <p className="font-semibold text-slate-900">Campus-first visual language</p>
                </div>
              </div>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <SummaryLine label="Color palette" value="Blue + rose" />
                <SummaryLine label="Contrast level" value="WCAG AA compliant" />
                <SummaryLine label="Feel & tone" value="Professional yet approachable" />
                <SummaryLine label="User experience" value="Intuitive and accessible" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-slate-200 bg-slate-950 px-4 py-12 text-slate-300 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Smart Campus</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">A focused operations hub for campus resources, maintenance, and communication.</p>
            </div>
            <FooterGroup title="Product" items={['Features', 'Security', 'Notifications']} />
            <FooterGroup title="Company" items={['About', 'Contact', 'Updates']} />
            <FooterGroup title="Legal" items={['Privacy', 'Terms']} />
          </div>
          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            © 2026 Smart Campus. All rights reserved. | IT3030 PAF Group 177
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg">
    <div className="mb-5 inline-flex rounded-xl bg-cyan-50 p-3 text-cyan-700 transition group-hover:bg-cyan-100">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="mb-3 text-xl font-semibold text-slate-900">{title}</h3>
    <p className="leading-7 text-slate-600">{description}</p>
  </div>
);

const StatBox = ({ number, label }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
    <p className="text-4xl font-black text-blue-800 md:text-5xl">{number}</p>
    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
  </div>
);

const MiniStat = ({ icon, label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-200 hover:shadow-md">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-blue-700">{value}</p>
      </div>
      <div className="rounded-lg bg-gradient-to-br from-cyan-100 to-blue-50 p-3 text-cyan-700">{icon}</div>
    </div>
  </div>
);

const DashboardCard = ({ icon, title, description }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-cyan-200 hover:shadow-md">
    <div className="mb-4 inline-flex rounded-xl bg-cyan-50 p-3 text-cyan-700">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
  </div>
);

const PillMetric = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
    <p className="text-xl font-bold text-slate-900">{value}</p>
    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
  </div>
);

const Badge = ({ text }) => (
  <span className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">{text}</span>
);

const SummaryLine = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <span className="text-slate-600">{label}</span>
    <span className="text-right font-medium text-slate-900">{value}</span>
  </div>
);

const FooterGroup = ({ title, items }) => (
  <div>
    <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">{title}</h4>
    <ul className="mt-4 space-y-3 text-sm text-slate-400">
      {items.map((item) => (
        <li key={item}>
          <a href="#about" className="transition hover:text-rose-300">{item}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default Home;


