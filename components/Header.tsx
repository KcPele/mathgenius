import { Calculator } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center mb-10">
      <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
        <Calculator className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
        My Math Tutor
      </h1>
      <p className="mt-4 text-lg text-neutral-500 max-w-xl mx-auto">
        AI-powered question practice for secondary school students worldwide.
      </p>
    </header>
  );
}
