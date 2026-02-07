"use client";

import { motion } from "framer-motion";

const JOKES = [
    "motiii",
    "clown cat",
    "bhaiii",
    "cat pappiii",
];

export default function InsideJokes() {
    return (
        <section className="py-24 px-4 bg-gradient-to-b from-pastel-lavender/30 to-pastel-pink/30 flex flex-col items-center">
            <motion.div
                className="max-w-2xl text-center space-y-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
            >
                <h2 className="text-2xl md:text-3xl font-serif text-muted">Thinking of...</h2>

                <h3 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
                    Things That Are Just Ours
                </h3>

                <div className="space-y-6">
                    {JOKES.map((joke, index) => (
                        <motion.p
                            key={index}
                            className="text-lg md:text-xl font-light text-foreground/80 italic"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 1 }}
                        >
                            {joke}
                        </motion.p>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
