import {
  FaArrowRight,
  FaArrowDownLong,
  FaBolt,
  FaCircleCheck,
  FaFileArrowDown,
  FaFileLines,
  FaGavel,
  FaLanguage,
  FaLock,
  FaMagnifyingGlassChart,
  FaShieldHalved,
  FaUserShield,
  FaScaleBalanced,
  FaCloudArrowUp,
  FaBrain,
} from "react-icons/fa6";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

// Reusable content blocks keep the page easy to maintain and extend.
const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const features = [
  {
    title: "AI Clause Analysis",
    description:
      "Breaks down complex clauses and explains what each section means for you.",
    icon: FaScaleBalanced,
  },
  {
    title: "Risk Detection",
    description:
      "Highlights hidden liabilities, unusual terms, and critical legal risks instantly.",
    icon: FaShieldHalved,
  },
  {
    title: "Plain Language Explanation",
    description:
      "Turns legal jargon into clear, simple language that is easy to understand.",
    icon: FaFileLines,
  },
  {
    title: "Hindi & English Support",
    description:
      "Supports bilingual document analysis for broader accessibility and comfort.",
    icon: FaLanguage,
  },
  {
    title: "Secure Document Upload",
    description:
      "Protects your files with a secure workflow built for confidential documents.",
    icon: FaLock,
  },
  {
    title: "Download Analysis Report",
    description:
      "Generate a clean summary report you can save, share, or review later.",
    icon: FaFileArrowDown,
  },
];

const steps = [
  {
    title: "Upload Document",
    description:
      "Add your contract, agreement, or legal paper in a few clicks.",
    icon: FaCloudArrowUp,
  },
  {
    title: "Extract Text",
    description:
      "LexiAI reads the document and converts it into structured text.",
    icon: FaFileLines,
  },
  {
    title: "AI Analysis",
    description:
      "The assistant reviews clauses, flags risks, and explains the details.",
    icon: FaBrain,
  },
  {
    title: "Download Report",
    description:
      "Save a concise report with analysis insights and key recommendations.",
    icon: FaFileArrowDown,
  },
];

const benefits = [
  {
    title: "Fast AI Analysis",
    description: "Get meaningful insights in seconds, not minutes.",
    icon: FaBolt,
  },
  {
    title: "Privacy First",
    description: "Designed to handle sensitive legal content with care.",
    icon: FaUserShield,
  },
  {
    title: "Accurate Legal Insights",
    description: "Focused summaries help you spot important details early.",
    icon: FaMagnifyingGlassChart,
  },
  {
    title: "Easy to Use",
    description: "A simple interface that works smoothly on every device.",
    icon: FaCircleCheck,
  },
];

const stats = [
  { value: "500+", label: "Documents Analyzed" },
  { value: "95%", label: "Analysis Accuracy" },
  { value: "24/7", label: "AI Availability" },
  { value: "100%", label: "Secure Processing" },
];

const quickLinks = ["Home", "Features", "About", "Contact"];
const techStack = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "Google Gemini AI",
];

function Home() {
  const { user, isLoaded } = useUser();
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 transition hover:text-blue-600"
          >
            <img
              src="/LexiAI-Logo.png"
              alt="LexiAI logo"
              className="h-10 w-10 rounded-2xl object-contain shadow-lg shadow-blue-500/20"
            />
            LexiAI
          </a>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <SignedOut>
              <Link
                to="/login"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-linear-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] hover:shadow-blue-500/30"
              >
                Register
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 py-1.5 pl-1.5 pr-4 shadow-sm">
                <UserButton
                  afterSignOutUrl="/login"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 rounded-full",
                    },
                  }}
                />
                <div className="hidden flex-col leading-tight sm:flex">
                  <span className="text-xs font-semibold text-slate-900">
                    {user?.fullName || (isLoaded ? "My Account" : "Loading...")}
                  </span>
                  <span className="text-xs text-slate-500">{primaryEmail}</span>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="relative overflow-hidden bg-linear-to-br from-white via-blue-50 to-violet-50">
          <div className="absolute left-1/2 top-0 z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute right-0 top-20 z-0 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl sm:h-80 sm:w-80" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm shadow-blue-100">
                <FaGavel aria-hidden="true" className="h-4 w-4" />
                AI-Powered Legal Document Assistant
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Understand Legal Documents with AI
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Upload contracts, rental agreements, employment documents, and
                legal papers. LexiAI explains complex legal clauses in simple
                language, highlights risks, and provides AI-powered summaries.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:translate-y-px hover:shadow-blue-500/35"
                >
                  Get Started
                  <FaArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Learn More
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-600">
                <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
                  Secure legal insights
                </div>
                <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
                  Built for clarity
                </div>
                <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
                  Multi-language support
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Decorative illustration placeholder for a future legal AI image. */}
              <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-4 shadow-[0_25px_80px_-35px_rgba(37,99,235,0.45)] sm:p-6">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-violet-500/10" />
                <div className="relative rounded-3xl border border-dashed border-blue-200 bg-linear-to-br from-slate-50 to-white p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        Document Preview
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        AI analysis is ready to review
                      </p>
                    </div>
                    <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                      <FaFileLines aria-hidden="true" className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FaLock aria-hidden="true" className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              Confidential Agreement
                            </p>
                            <p className="text-sm text-slate-500">
                              Secure upload in progress
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Protected
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg shadow-slate-900/15">
                        <p className="text-sm text-slate-300">Clause Risk</p>
                        <p className="mt-2 text-2xl font-bold">Low</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Review highlighted clauses for more certainty.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-violet-50 p-4">
                        <p className="text-sm font-medium text-blue-700">
                          Plain Summary
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          This document explains rights, payment terms, and
                          termination conditions.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <FaLanguage aria-hidden="true" className="h-5 w-5" />
                        </span>
                        Hindi and English document support available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-6 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/60 md:block">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <FaCircleCheck aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Instant Summary Generated
                    </p>
                    <p className="text-xs text-slate-500">Ready for download</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to review legal documents faster
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                LexiAI combines document understanding, risk detection, and
                readable summaries into one simple workflow.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_60px_-25px_rgba(37,99,235,0.35)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 transition group-hover:scale-105">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-3 leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                How It Works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A simple flow from upload to report
              </h2>
            </div>

            <div className="mt-12 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:gap-0">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="flex flex-1 items-stretch gap-4 lg:items-center lg:gap-0"
                  >
                    <article className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                        Step {index + 1}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-3 leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </article>

                    {index < steps.length - 1 ? (
                      <div className="flex items-center justify-center px-2 lg:px-4">
                        <FaArrowDownLong
                          aria-hidden="true"
                          className="h-6 w-6 text-blue-500 lg:-rotate-90"
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Why Choose LexiAI
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Built for clarity, speed, and trust
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                  LexiAI is designed to make legal document review easier for
                  students, clients, and professionals who want faster
                  understanding without losing the important details.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <article
                      key={benefit.title}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-30px_rgba(37,99,235,0.35)]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-slate-900">
                        {benefit.title}
                      </h3>
                      <p className="mt-3 leading-7 text-slate-600">
                        {benefit.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-linear-to-br from-blue-50 via-white to-violet-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                >
                  <p className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {stat.label}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-blue-900 to-violet-900 px-6 py-12 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.75)] sm:px-10 sm:py-14">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Call To Action
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to Understand Your Legal Documents?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                  Start analyzing legal papers with a clearer, faster, and more
                  confident workflow. LexiAI helps you spot risks, understand
                  clauses, and move forward with certainty.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
                  >
                    Analyze Document
                  </a>
                  <a
                    href="#home"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto_auto] lg:px-8">
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900"
            >
              <img
                src="/LexiAI-Logo.png"
                alt="LexiAI logo"
                className="h-10 w-10 rounded-2xl object-contain"
              />
              LexiAI
            </a>
            <p className="mt-4 max-w-md leading-7 text-slate-600">
              AI-powered legal document assistance for clearer understanding,
              faster reviews, and more confident decisions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3 text-slate-600">
              {quickLinks.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="transition hover:text-blue-600"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Tech Stack
            </h3>
            <ul className="mt-4 flex max-w-xs flex-wrap gap-3 text-sm text-slate-600">
              {techStack.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 py-5">
          <p className="text-center text-sm text-slate-500">
            © 2026 LexiAI. Final Year Project.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
