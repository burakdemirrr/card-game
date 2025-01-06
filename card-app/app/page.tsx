import CardGame from './components/CardGame';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-purple-800">
            🐱 Cat Memory Challenge 🐱
          </h1>
          <p className="text-lg text-purple-600 max-w-2xl mx-auto">
            Match the adorable cat pairs to complete each level! Start with 4 pairs 
            and work your way up to becoming a cat-matching champion! 🏆
          </p>
        </div>
        <CardGame />
      </div>
    </main>
  );
}
