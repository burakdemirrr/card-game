import CardGame from './components/CardGame';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Cat Memory Challenge</h1>
        <p className="text-center mb-8 text-gray-600">
          Match the cats to complete each level! Start with 4 pairs and work your way up to 12 pairs.
        </p>
        <CardGame />
      </div>
    </main>
  );
}
