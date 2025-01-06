import CardGame from './components/CardGame';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Animal Memory Game</h1>
        <p className="text-center mb-8 text-gray-600">Match the animal pairs to win!</p>
        <CardGame />
      </div>
    </main>
  );
}
