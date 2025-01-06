'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

// Generate cat images for all possible pairs
const generateCatImages = (count: number) => {
  return Array.from({ length: count }, (_, i) => 
    `https://robohash.org/cat${i + 1}?set=set4&size=300x300`
  );
};

// Define levels
const levels = [
  { name: "Level 1", pairs: 4, gridCols: 4 },   // 8 cards (4x2)
  { name: "Level 2", pairs: 6, gridCols: 4 },   // 12 cards (4x3)
  { name: "Level 3", pairs: 8, gridCols: 4 },   // 16 cards (4x4)
  { name: "Level 4", pairs: 10, gridCols: 5 },  // 20 cards (5x4)
  { name: "Level 5", pairs: 12, gridCols: 6 },  // 24 cards (6x4)
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
    
    // Create pairs of cards
    const duplicatedCards = [...cardImages, ...cardImages]
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicatedCards);
    setFlippedCards([]);
    setMoves(0);
    setIsGameComplete(false);
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
      setCurrentLevel(prev => prev + 1);
    }
  };

  const handlePreviousLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(prev => prev - 1);
    }
  };

  const restartLevel = () => {
    initializeLevel(currentLevel);
  };

  return (
    <div className="p-4">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">
            {levels[currentLevel].name} - Moves: {moves}
          </div>
          <div className="text-md text-gray-600">
            Best Score: {bestScores[currentLevel] === Infinity ? '-' : bestScores[currentLevel]}
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePreviousLevel}
            disabled={currentLevel === 0}
            className={`px-4 py-2 rounded ${
              currentLevel === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous Level
          </button>
          <button
            onClick={restartLevel}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Restart Level
          </button>
          <button
            onClick={handleNextLevel}
            disabled={currentLevel === levels.length - 1 || !isGameComplete}
            className={`px-4 py-2 rounded ${
              currentLevel === levels.length - 1 || !isGameComplete
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Next Level
          </button>
        </div>
      </div>
      
      <div className={`grid grid-cols-${levels[currentLevel].gridCols} gap-4`}>
        {cards.map(card => (
          <Card
            key={card.id}
            {...card}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>

      {isGameComplete && (
        <div className="mt-4 text-center text-xl font-bold text-green-600">
          {currentLevel === levels.length - 1 ? (
            <>
              🎉 Congratulations! You've completed all levels! 🎉
              <div className="text-lg mt-2">
                Final Score: {moves} moves
              </div>
            </>
          ) : (
            <>
              Level Complete! {moves} moves
              <div className="text-lg mt-2">
                Click 'Next Level' to continue
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 