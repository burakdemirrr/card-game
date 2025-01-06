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
      className={`relative w-32 h-32 cursor-pointer ${isMatched ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full bg-white rounded-lg border-2 border-gray-300 
                     flex items-center justify-center text-4xl ${isFlipped ? 'backface-hidden' : ''}`}
        >
          🐾
        </div>
        
        {/* Back of card (animal image) */}
        <div
          className={`absolute w-full h-full bg-white rounded-lg border-2 border-gray-300 
                     flex items-center justify-center transform rotate-y-180 overflow-hidden
                     ${!isFlipped ? 'backface-hidden' : ''}`}
        >
          <Image
            src={image}
            alt={`Animal card ${id}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </motion.div>
    </div>
  );
} 