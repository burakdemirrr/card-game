import { motion } from 'framer-motion';
import Image from 'next/image';

interface CardProps {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function Card({ id, image, isFlipped, isMatched, onClick }: CardProps) {
  return (
    <div
      className={`relative w-32 h-32 cursor-pointer transition-transform duration-200 transform hover:scale-105 
                 ${isMatched ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full rounded-xl border-4 border-pink-200 bg-gradient-to-br from-purple-100 to-pink-100
                     flex items-center justify-center text-4xl shadow-lg
                     ${isFlipped ? 'backface-hidden' : ''}`}
        >
          <span className="animate-bounce">🐱</span>
        </div>
        
        {/* Back of card (animal image) */}
        <div
          className={`absolute w-full h-full rounded-xl border-4 border-purple-200 bg-white
                     flex items-center justify-center transform rotate-y-180 overflow-hidden shadow-lg
                     ${!isFlipped ? 'backface-hidden' : ''}`}
        >
          <div className="relative w-full h-full p-2">
            <Image
              src={image}
              alt={`Cat card ${id}`}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
} 