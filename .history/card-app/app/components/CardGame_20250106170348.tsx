'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

// Sample card images - using animal images from Unsplash
const cardImages = [
  'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&h=300&fit=crop', // Fox
  'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=300&h=300&fit=crop', // Turtle
  'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=300&h=300&fit=crop', // Giraffe
  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=300&h=300&fit=crop', // Penguin
  'https://images.unsplash.com/photo-1531494391841-6ac2ef3859b8?w=300&h=300&fit=crop', // Lion
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop', // Elephant
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop', // Panda
  'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300&h=300&fit=crop', // Tiger
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