'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

// Sample card images - using robohash for reliable robot images
const cardImages = [
  'https://robohash.org/robot1?set=set4&size=300x300',  // Set 4 is cats
  'https://robohash.org/robot2?set=set4&size=300x300',
  'https://robohash.org/robot3?set=set4&size=300x300',
  'https://robohash.org/robot4?set=set4&size=300x300',
  'https://robohash.org/robot5?set=set4&size=300x300',
  'https://robohash.org/robot6?set=set4&size=300x300',
  'https://robohash.org/robot7?set=set4&size=300x300',
  'https://robohash.org/robot8?set=set4&size=300x300',
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
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
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
          
          // Check if game is complete
          const allMatched = cards.every(card => 
            (card.id === firstCardId || card.id === secondCardId) 
              ? true 
              : card.isMatched
          );
          if (allMatched) setIsGameComplete(true);
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

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-lg font-bold">Moves: {moves}</div>
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Game
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
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
          Congratulations! You completed the game in {moves} moves!
        </div>
      )}
    </div>
  );
} 