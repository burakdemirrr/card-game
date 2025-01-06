'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

// Generate cat images for all possible pairs
const generateCatImages = (count: number) => {
  return Array.from({ length: count }, (_, i) => 
    `https://robohash.org/cat${i + 1}?set=set4&size=300x300`
  );
};

// Define levels with improved grid layouts
const levels = [
  { name: "Level 1", pairs: 4, gridCols: 4, rows: 2 },    // 8 cards (4x2)
  { name: "Level 2", pairs: 6, gridCols: 4, rows: 3 },    // 12 cards (4x3)
  { name: "Level 3", pairs: 8, gridCols: 4, rows: 4 },    // 16 cards (4x4)
  { name: "Level 4", pairs: 10, gridCols: 5, rows: 4 },   // 20 cards (5x4)
  { name: "Level 5", pairs: 12, gridCols: 6, rows: 4 },   // 24 cards (6x4)
];

interface CardType {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function CardGame() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [bestScores, setBestScores] = useState<number[]>(
    Array(levels.length).fill(Infinity)
  );

  // Initialize game
  useEffect(() => {
    initializeLevel(currentLevel);
  }, [currentLevel]);

  const initializeLevel = (levelIndex: number) => {
    const level = levels[levelIndex];
    const cardImages = generateCatImages(level.pairs);
    
    // Reset all states first
    setFlippedCards([]);
    setMoves(0);
    setIsGameComplete(false);
    
    // Create pairs of cards with guaranteed closed state
    const duplicatedCards = [...cardImages, ...cardImages]
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    // Set cards after a brief delay to ensure clean state
    setTimeout(() => {
      setCards(duplicatedCards);
    }, 100);
  };

  const handleCardClick = (clickedCardId: number) => {
    // Prevent clicking if two cards are already flipped
    if (flippedCards.length === 2) return;
    
    // Prevent clicking on already matched or flipped cards
    const clickedCard = cards.find(card => card.id === clickedCardId);
    if (clickedCard?.isMatched || clickedCard?.isFlipped) return;

    // Flip the card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === clickedCardId ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCards(prev => [...prev, clickedCardId]);

    // Check for matches when two cards are flipped
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const firstCardId = flippedCards[0];
      const secondCardId = clickedCardId;
      
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      if (firstCard?.image === secondCard?.image) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
          
          // Check if level is complete
          const allMatched = cards.every(card => 
            (card.id === firstCardId || card.id === secondCardId) 
              ? true 
              : card.isMatched
          );
          
          if (allMatched) {
            // Update best score
            setBestScores(prev => {
              const newScores = [...prev];
              newScores[currentLevel] = Math.min(prev[currentLevel], moves + 1);
              return newScores;
            });
            
            setIsGameComplete(true);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      // Reset cards first
      setCards([]);
      // Then change level
      setCurrentLevel(prev => prev + 1);
    }
  };

  const handlePreviousLevel = () => {
    if (currentLevel > 0) {
      // Reset cards first
      setCards([]);
      // Then change level
      setCurrentLevel(prev => prev - 1);
    }
  };

  const restartLevel = () => {
    // Reset cards first
    setCards([]);
    // Then reinitialize
    setTimeout(() => {
      initializeLevel(currentLevel);
    }, 100);
  };

  if (!hasStarted) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center py-12 space-y-8">
          <div className="text-4xl font-bold text-purple-800">
            🐱 Welcome to Cat Memory! 🐱
          </div>
          <div className="max-w-md mx-auto space-y-6">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-6 py-4 text-lg rounded-full border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-center"
              maxLength={20}
            />
            <button
              onClick={() => setHasStarted(true)}
              disabled={!playerName.trim()}
              className={`w-full px-8 py-4 rounded-full font-medium text-lg transition-all duration-200 ${
                playerName.trim() 
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Game! 🎮
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      {isGameComplete && currentLevel === levels.length - 1 ? (
        // Win Page
        <div className="text-center py-12 space-y-8">
          <div className="text-4xl font-bold text-purple-800 animate-bounce">
            🎉 YOU WIN, {playerName}! 🎉
          </div>
          <div className="space-y-4">
            <div className="text-2xl font-bold text-purple-600">
              Amazing job! You've mastered all levels!
            </div>
            <div className="text-xl text-purple-500">
              Final Score: {moves} moves
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-lg text-gray-600">
              {playerName}'s Best Scores:
            </div>
            <div className="max-w-xs mx-auto space-y-2">
              {levels.map((level, index) => (
                <div key={index} className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                  <span className="font-medium text-purple-700">{level.name}</span>
                  <span className="text-purple-600">
                    {bestScores[index] === Infinity ? '-' : `${bestScores[index]} moves`}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => {
                setHasStarted(false);
                setPlayerName('');
                setCurrentLevel(0);
                setBestScores(Array(levels.length).fill(Infinity));
              }}
              className="px-8 py-4 rounded-full font-medium bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-200 text-lg"
            >
              New Game 🎮
            </button>
            <button
              onClick={restartLevel}
              className="px-8 py-4 rounded-full font-medium bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200 text-lg ml-4"
            >
              Play Again 🔄
            </button>
          </div>
        </div>
      ) : (
        // Game Interface
        <>
          <div className="mb-8 space-y-6">
            {/* Player Name and Level Progress */}
            <div className="text-center mb-4">
              <span className="text-xl font-medium text-purple-600">Player: {playerName}</span>
            </div>
            
            {/* Level Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
                style={{ width: `${((currentLevel + 1) / levels.length) * 100}%` }}
              />
            </div>

            {/* Level and Score Info */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-800">
                  {levels[currentLevel].name}
                </div>
                <div className="text-lg text-purple-600">
                  Moves: {moves}
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-lg font-medium text-purple-800">
                  Best Score
                </div>
                <div className="text-lg text-purple-600">
                  {bestScores[currentLevel] === Infinity ? '-' : bestScores[currentLevel]}
                </div>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={restartLevel}
                className="px-6 py-3 rounded-full font-medium bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all duration-200"
              >
                ↺ Restart Level
              </button>
              {isGameComplete && currentLevel < levels.length - 1 && (
                <button
                  onClick={handleNextLevel}
                  className="px-6 py-3 rounded-full font-medium bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                >
                  Next Level →
                </button>
              )}
            </div>
          </div>
          
          {/* Game Grid */}
          <div 
            className="grid gap-4 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${levels[currentLevel].gridCols}, minmax(0, 1fr))`,
              maxWidth: `${levels[currentLevel].gridCols * 140}px`
            }}
          >
            {cards.map(card => (
              <Card
                key={card.id}
                {...card}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>

          {/* Level Complete Message */}
          {isGameComplete && currentLevel < levels.length - 1 && (
            <div className="mt-8 text-center space-y-4">
              <div className="text-2xl font-bold text-purple-600">
                Level Complete! 🌟
              </div>
              <div className="text-xl text-purple-500">
                {moves} moves - Click 'Next Level' to continue
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 