"use client";

import { motion } from "framer-motion";

const LETTER_TEXT = `I don't know when it happened,
but somewhere between random conversations and shared silences,
you became home to me.

You make ordinary days softer,
and hard days easier just by being you.

Thank you for being patient with me on days 
I don't understand myself.

Happy Birthday,
I hope this year gives you everything you deserve (and of course, me, hahaha)
and a little more.`;

export default function LoveLetter() {
    return (
        <section className="py-32 px-4 bg-background flex flex-col items-center justify-center min-h-[80vh]">
            <motion.div
                className="max-w-3xl text-center space-y-8 bg-pastel-beige p-12 rounded-lg shadow-md border border-accent/20"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
            >
                <div className="font-handwriting text-2xl md:text-4xl text-foreground leading-relaxed md:leading-loose whitespace-pre-wrap">
                    {LETTER_TEXT.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.03, duration: 0.1 }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
