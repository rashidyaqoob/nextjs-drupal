import Link from 'next/link';

export default function Custom404(): JSX.Element {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">Oops! The page you are looking for does not exist.</p>
      <Link href="/">
        <p className="text-blue-500 hover:underline">Go back to the homepage</p>
      </Link>
    </div>
  );
}
