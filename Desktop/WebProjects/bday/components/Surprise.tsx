"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Surprise() {
    const [showFinalMessage, setShowFinalMessage] = useState(false);

    const handleClick = () => {
        // Fire confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        setShowFinalMessage(true);
    };

    return (
        <section className="py-40 px-4 bg-gradient-to-t from-pastel-blue/20 to-background flex flex-col items-center justify-center min-h-[50vh]">
            {!showFinalMessage ? (
                <motion.button
                    onClick={handleClick}
                    className="px-8 py-4 bg-accent text-white text-lg font-serif rounded-full hover:bg-accent/80 transition-colors shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    whileHover={{ scale: 1.05 }}
                >
                    One last thing
                </motion.button>
            ) : (
                <motion.div
                    className="text-center space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                >
                    <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed">
                        No matter where life takes us,<br />
                        I’ll always be cheering for you.<br />
                        <span className="text-accent italic">Always.</span>
                    </p>
                </motion.div>
            )}
        </section>
    );
}
