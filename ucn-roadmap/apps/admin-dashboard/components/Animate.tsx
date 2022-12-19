import { motion } from 'framer-motion';

const Animate = ({ children }) => (
  <motion.div
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 300, opacity: 0 }}
    transition={{
      duration: 1,
      type: 'spring',
      stiffness: 260,
      damping: 20,
    }}
  >
    <div className="animate">{children}</div>
  </motion.div>
);

export default Animate;
