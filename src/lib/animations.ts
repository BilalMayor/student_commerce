import type { Variants } from 'framer-motion'

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export const cardContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

export const cardItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.15 } },
}

export const drawerVariants: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { y: '100%', transition: { duration: 0.2 } },
}

export const toastVariants: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.15 } },
}

export const wishlistVariants: Variants = {
  idle: { scale: 1 },
  pop: { scale: [1, 1.3, 1], transition: { duration: 0.2 } },
}

export const buttonHover = { scale: 1.03, transition: { duration: 0.1 } }
export const buttonTap = { scale: 0.97, transition: { duration: 0.08 } }
