import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reactive hook: returns true when the user prefers reduced motion.
 * Mirrors the existing `prefers-reduced-motion` handling in
 * `components/home/StatsSection.jsx` and `index.css`.
 */
export const usePrefersReducedMotion = () => useReducedMotion();

/**
 * Scroll-reveal wrapper. Gated by `prefers-reduced-motion`.
 * Animates only opacity/transform so no layout shift occurs.
 */
export function Reveal({ children, delay = 0, y = 28, style, ...rest }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Gentle infinite float for decorative elements.
 * Disabled entirely under `prefers-reduced-motion`.
 */
export function Float({ children, distance = 10, duration = 5, delay = 0, rotate = 0, style, ...rest }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={
        reduce
          ? undefined
          : {
              y: [0, -distance, 0],
              ...(rotate ? { rotate: [-rotate, rotate, -rotate] } : {}),
            }
      }
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}