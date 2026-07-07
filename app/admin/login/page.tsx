import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <form action={login} className="soft-frame w-full max-w-sm bg-sand px-8 py-10">
        <img
          src="/logo.png"
          alt="Santa Barbara Chinese Medicine"
          className="mx-auto h-auto w-48"
        />
        <h1 className="sr-only">Santa Barbara Chinese Medicine</h1>
        <p className="mt-3 text-center font-sans text-xs uppercase tracking-[0.25em] text-ink-soft">
          Welcome Kristen
        </p>
        {error && (
          <p className="mt-6 border border-brand-gold bg-brand-gold/10 px-4 py-3 text-sm text-brand-gold-dark">
            Wrong email or password.
          </p>
        )}
        <label className="mt-8 block">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-2 w-full border border-ink bg-sand px-4 py-3 outline-none focus:border-brand-gold"
          />
        </label>
        <label className="mt-4 block">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full border border-ink bg-sand px-4 py-3 outline-none focus:border-brand-gold"
          />
        </label>
        <button
          type="submit"
          className="mt-8 w-full bg-brand-gold px-8 py-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-sand hover:bg-brand-gold-dark"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
