import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarDays,
  FaEnvelope,
  FaFingerprint,
  FaIdCard,
  FaShieldHalved,
} from "react-icons/fa6";

// Matches the LexiAI light theme for the UserButton dropdown on this page.
const userButtonAppearance = {
  elements: {
    avatarBox: "h-9 w-9 rounded-full ring-2 ring-white",
    userButtonPopoverCard:
      "rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]",
    userButtonPopoverActionButton:
      "mx-1 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-700",
    userButtonPopoverActionButtonText: "text-sm font-medium",
    userButtonPopoverActionButtonIcon: "h-4 w-4 text-slate-500",
    userPreviewMainIdentifier: "text-sm font-semibold text-slate-900",
    userPreviewSecondaryIdentifier: "text-xs text-slate-500",
  },
};

function formatJoinedDate(value) {
  if (!value) return "Available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Available";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Profile() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const fullName = user?.fullName || "My Account";
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "No email on file";
  const avatarUrl = user?.imageUrl || "";
  const createdAt = user?.createdAt;
  const clerkId = user?.id || "";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_45%,#eef5ff_100%)] text-slate-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 transition hover:text-blue-600"
          >
            <img
              src="/LexiAI-Logo.png"
              alt="LexiAI logo"
              className="h-10 w-10 rounded-2xl object-contain shadow-lg shadow-blue-500/20"
            />
            LexiAI
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <SignedOut>
              <Link
                to="/login"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Login
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 py-1.5 pl-1.5 pr-4 shadow-sm">
                <UserButton
                  afterSignOutUrl="/login"
                  appearance={userButtonAppearance}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="My Profile"
                      labelIcon={<FaIdCard className="h-4 w-4" />}
                      onClick={() => navigate("/profile")}
                    />
                    <UserButton.Action label="manageAccount" />
                    <UserButton.Action label="signOut" />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col px-4 py-14 sm:px-6 lg:px-8">
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white py-20 shadow-[0_30px_90px_-40px_rgba(37,99,235,0.25)]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">Loading profile...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_90px_-40px_rgba(37,99,235,0.25)]">
            <div className="relative h-28 bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 sm:h-32">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%)]" />
              <div className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                Profile
              </div>
            </div>

            <div className="px-6 pb-8 sm:px-10">
              <div className="-mt-12 flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
                <div className="relative">
                  <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-blue-50 shadow-lg shadow-blue-500/20">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-600">
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                    <FaShieldHalved className="h-3 w-3" />
                  </span>
                </div>

                <div className="mt-4 text-center sm:mt-0 sm:text-left">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {fullName}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">{primaryEmail}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    <FaEnvelope className="h-3.5 w-3.5 text-blue-600" />
                    Email Address
                  </div>
                  <p className="mt-2 break-all text-sm font-medium text-slate-800">
                    {primaryEmail}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    <FaCalendarDays className="h-3.5 w-3.5 text-blue-600" />
                    Joined
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {formatJoinedDate(createdAt)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    <FaFingerprint className="h-3.5 w-3.5 text-blue-600" />
                    Clerk User ID
                  </div>
                  <p className="mt-2 break-all font-mono text-sm text-slate-600">
                    {clerkId || "—"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] hover:shadow-blue-500/30"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
