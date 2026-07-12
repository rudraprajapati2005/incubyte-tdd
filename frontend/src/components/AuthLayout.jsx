export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-concrete">
      <div className="relative hidden lg:flex flex-col justify-between bg-asphalt-800 text-concrete p-10 overflow-hidden">
        <div className="absolute inset-0 bg-diagonal-stripes" aria-hidden="true" />
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-signal text-asphalt-900 font-display font-bold text-xl">
            L
          </span>
          <span className="font-display text-2xl tracking-wide uppercase">Lotline</span>
        </div>

        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">
            {eyebrow}
          </p>
          <h1 className="font-display text-6xl leading-[1.05] uppercase max-w-md">
            {title}
          </h1>
          <p className="text-asphalt-200 mt-5 max-w-sm text-[15px] leading-relaxed">
            {subtitle}
          </p>
        </div>

        <CarKeylineArt />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-8">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-asphalt-800 text-signal font-display font-bold text-xl">
              L
            </span>
            <span className="font-display text-2xl tracking-wide uppercase text-asphalt-800">
              Lotline
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function CarKeylineArt() {
  return (
    <svg
      className="relative z-10 w-full max-w-md text-signal/70 mt-8"
      viewBox="0 0 400 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M20 100 L45 60 Q60 40 90 40 L250 40 Q280 40 295 60 L320 100" />
      <path d="M20 100 L380 100" />
      <path d="M90 40 L105 65 L230 65 L245 40" />
      <path d="M135 65 L135 40 M195 65 L195 40" />
      <circle cx="90" cy="100" r="20" />
      <circle cx="300" cy="100" r="20" />
      <circle cx="90" cy="100" r="7" />
      <circle cx="300" cy="100" r="7" />
      <path d="M20 100 Q20 84 36 84" strokeDasharray="3 4" opacity="0.5" />
    </svg>
  );
}
