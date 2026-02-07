"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-gradient-to-b from-pastel-lavender to-background">
            {/* Background grain or subtle effect can go here if needed, keeping it clean for now */}

            <div className="z-10 max-w-3xl space-y-8">
                <motion.h1
                    className="text-4xl md:text-6xl lg:text-7xl font-serif text-foreground leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    Happy Birthday, my love. <span className="text-accent drop-shadow-sm">💗</span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl text-muted font-light tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                >
                    I made this because I'm bad at creativity.
                </motion.p>
            </div>

            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <div className="w-[1px] h-16 bg-accent animate-pulse" />
            </motion.div>
        </section>
    );
}
