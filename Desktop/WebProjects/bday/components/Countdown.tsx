"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BIRTHDAY_DATE = "2026-01-10T00:00:00"; // YYYY-MM-DDTHH:mm:ss

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(BIRTHDAY_DATE) - +new Date();
            let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return newTimeLeft;
        };

        setTimeLeft(calculateTimeLeft()); // Initial call

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-20 md:py-32 flex flex-col items-center justify-center text-center px-4 bg-pastel-pink/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="space-y-12"
            >
                <div className="grid grid-cols-4 gap-4 md:gap-12">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="flex flex-col items-center p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
                            <span className="text-4xl md:text-6xl font-serif font-medium text-foreground tabular-nums">
                                {String(value).padStart(2, "0")}
                            </span>
                            <span className="text-xs md:text-sm uppercase tracking-widest text-accent font-semibold mt-2">
                                {unit}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="text-muted font-light tracking-wide text-sm md:text-base italic">
                    Counting down to the day you were born.
                </p>
            </motion.div>
        </section>
    );
}
