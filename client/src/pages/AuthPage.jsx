import { Link } from "react-router-dom";
import { ClerkLoaded, ClerkLoading, SignIn, SignUp } from "@clerk/clerk-react";
import {
  FaArrowRight,
  FaBuildingColumns,
  FaFileShield,
  FaScaleBalanced,
  FaShieldHalved,
  FaSpinner,
} from "react-icons/fa6";

const featureCards = [
  {
    icon: FaShieldHalved,
    title: "Secure Authentication",
    description: "Protect access for legal document workflows.",
  },
  {
    icon: FaScaleBalanced,
    title: "AI Legal Analysis",
    description: "Built to support intelligent legal document review.",
  },
  {
    icon: FaFileShield,
    title: "Privacy First",
    description: "Your documents and account stay protected.",
  },
];

// Matches the LexiAI design system so Clerk blends into the existing UI.
const clerkAppearance = {
  variables: {
    colorPrimary: "#4F46E5",
    colorText: "#0F172A",
    colorInputBackground: "#F8FAFC",
    colorInputText: "#0F172A",
    colorInputTextPlaceholder: "#94A3B8",
    colorNeutral: "#64748B",
    colorBackground: "#FFFFFF",
    colorBorder: "#E5E7EB",
    borderRadius: "1.25rem",
    fontFamily: "inherit",
  },
  elements: {
    rootBox: "w-full",
    card: "w-full max-w-[430px] border-0 bg-transparent p-0 shadow-none",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    formButtonPrimary:
      "h-12 w-full rounded-full bg-[linear-gradient(135deg,#4F46E5,#7C3AED)] text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95",
    formFieldInput:
      "rounded-[18px] border-slate-200 bg-[#F8FAFC] shadow-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100",
    formFieldLabel: "text-sm font-medium text-slate-700",
    formFieldLabelRow: "text-slate-700",
    footerAction: "text-slate-600",
    footerActionLink: "font-semibold text-indigo-600 hover:text-indigo-700",
    footerActionText: "text-slate-600",
    footer: "hidden",
    socialButtonsBlockButton:
      "rounded-[18px] border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
    socialButtonsProviderIcon: "text-slate-700",
    dividerLine: "bg-slate-200",
    dividerText: "text-slate-500",
    formFieldError: "text-rose-600",
    alert: "rounded-[18px] border border-rose-200 bg-rose-50 text-rose-700",
  },
};

function MarketingPanel() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_30px_90px_-40px_rgba(37,99,235,0.25)] sm:p-10">
      <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-blue-200/35 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-violet-200/35 blur-3xl" />

      <div className="relative space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <FaBuildingColumns className="h-4 w-4" />
          AI Powered Legal Document Assistant
        </div>

        <div>
          <div className="inline-flex items-center gap-4">
            <img
              src="/LexiAI-Logo.png"
              alt="LexiAI logo"
              className="h-14 w-14 rounded-2xl object-contain shadow-lg shadow-blue-500/20"
            />
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              LexiAI
            </h1>
          </div>
          <p className="mt-4 max-w-md text-base leading-8 text-slate-600">
            Legal-tech AI that simplifies contracts, highlights risk, and
            delivers clean document insights with a premium light theme.
          </p>
        </div>

        <div className="grid gap-4">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-28px_rgba(37,99,235,0.24)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      {feature.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SetupNotice({ heading, subtitle }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_30px_100px_-42px_rgba(37,99,235,0.22)] sm:p-10 lg:p-11">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Add your Clerk publishable key to client/.env to enable this login
        screen.
      </div>

      <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm font-medium text-slate-700">Setup note</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create a local env file with VITE_CLERK_PUBLISHABLE_KEY, then reload
          the app to switch this page over to Clerk.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
        >
          Return home
          <FaArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function AuthPage({ mode, clerkReady = false }) {
  const isRegister = mode === "register";
  const heading = isRegister ? "Create Account" : "Welcome Back";
  const subtitle = isRegister
    ? "Start analyzing legal documents with AI."
    : "Sign in to continue your legal document analysis.";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_45%,#eef5ff_100%)] text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-center">
          <div className="hidden lg:block">
            <MarketingPanel />
          </div>

          {clerkReady ? (
            <section className="mx-auto flex w-full max-w-107.5 flex-col items-center justify-center">
              <div className="mb-8 w-full text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {heading}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {subtitle}
                </p>
              </div>

              <ClerkLoading>
                <div className="flex min-h-105 w-full max-w-107.5 items-center justify-center rounded-[28px] border border-slate-200 bg-white/60">
                  <div className="text-center">
                    <FaSpinner className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                    <p className="mt-3 text-sm text-slate-500">
                      Loading secure access...
                    </p>
                  </div>
                </div>
              </ClerkLoading>

              <ClerkLoaded>
                <div className="flex w-full flex-col items-center">
                  {isRegister ? (
                    <SignUp
                      signInUrl="/login"
                      fallbackRedirectUrl="/"
                      forceRedirectUrl="/"
                      appearance={clerkAppearance}
                    />
                  ) : (
                    <SignIn
                      signUpUrl="/register"
                      fallbackRedirectUrl="/"
                      forceRedirectUrl="/"
                      appearance={clerkAppearance}
                    />
                  )}

                  <div className="mt-8 flex items-center justify-between gap-4 text-sm text-slate-600">
                    <span>
                      {isRegister
                        ? "Already have an account?"
                        : "Need a new account?"}
                    </span>
                    <Link
                      to={isRegister ? "/login" : "/register"}
                      className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-700"
                    >
                      {isRegister ? "Login" : "Register"}
                      <FaArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </ClerkLoaded>
            </section>
          ) : (
            <SetupNotice heading={heading} subtitle={subtitle} />
          )}
        </div>
      </main>
    </div>
  );
}

export default AuthPage;
