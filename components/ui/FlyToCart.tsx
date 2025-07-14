import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyToCartProps {
  image: string;
  from: { x: number; y: number; width: number; height: number };
  to: { x: number; y: number; width: number; height: number };
  onComplete?: () => void;
  visible: boolean;
}

export default function FlyToCart({ image, from, to, onComplete, visible }: FlyToCartProps) {
  // Animate from 'from' to 'to' using Framer Motion
  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.img
          src={image}
          initial={{
            x: from.x,
            y: from.y,
            width: from.width,
            height: from.height,
            opacity: 1,
            borderRadius: 16,
            zIndex: 9999,
            position: 'fixed' as any,
          }}
          animate={{
            x: to.x,
            y: to.y,
            width: to.width,
            height: to.height,
            opacity: 0.7,
            borderRadius: 32,
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            pointerEvents: 'none',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 9999,
          }}
          onAnimationComplete={onComplete}
        />
      )}
    </AnimatePresence>,
    document.body
  );
} 