"use client";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      {/* Spinner Container */}
      <motion.div
        className="relative size-16"
        variants={spinnerVariants}
        animate="animate"
      >
        {/* Dots around the spinner */}
        <motion.div
          className="absolute left-1/2 top-0 size-4 -translate-x-1/2 rounded-full bg-slate-500"
          variants={dotVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-0 left-1/2 size-4 -translate-x-1/2 rounded-full bg-slate-500"
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="absolute left-0 top-1/2 size-4 -translate-y-1/2 rounded-full bg-slate-500"
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.4 }}
        />
        <motion.div
          className="absolute right-0 top-1/2 size-4 -translate-y-1/2 rounded-full bg-slate-500"
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.6 }}
        />
      </motion.div>
      {/* Loading Text */}
      <motion.p
        className="mt-4 text-lg font-semibold text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
