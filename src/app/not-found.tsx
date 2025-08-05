import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      {/* Floating minimalist astronaut SVG with subtle float animation */}
      <div className="mb-8 animate-float">
        <svg
          width="100"
          height="110"
          viewBox="0 0 64 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
        >
          {/* Helmet */}
          <circle cx="32" cy="20" r="18" fill="#F9FAFB" stroke="#6B7280" strokeWidth="2" />
          <circle cx="32" cy="20" r="14" fill="#E5E7EB" opacity="0.5" />
          {/* Visor highlight */}
          <path d="M32 8C38 8 42 14 42 20C42 26 38 32 32 32C26 32 22 26 22 20C22 14 26 8 32 8Z" fill="white" opacity="0.15" />
          {/* Body */}
          <rect x="21" y="34" width="22" height="30" rx="10" fill="#9CA3AF" />
          {/* Arms simplified */}
          <rect x="12" y="38" width="10" height="20" rx="5" fill="#D1D5DB" />
          <rect x="42" y="38" width="10" height="20" rx="5" fill="#D1D5DB" />
          {/* Legs simplified */}
          <rect x="27" y="64" width="8" height="12" rx="4" fill="#E5E7EB" />
          <rect x="37" y="64" width="8" height="12" rx="4" fill="#E5E7EB" />
        </svg>
      </div>

      <h1 className="text-6xl font-bold text-gray-800 select-none mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-6 max-w-md text-center">
        Sorry, we couldn’t find the page you were looking for.
      </p>
      <Link
        href="/"
        className="px-5 py-2 rounded bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
      >
        Go Home
      </Link>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
