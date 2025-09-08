import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          401
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Unauthorized
        </h2>
        <p className="text-gray-500 mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
