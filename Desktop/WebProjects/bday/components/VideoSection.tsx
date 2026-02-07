"use client";

import { motion } from "framer-motion";

export default function VideoSection() {
    return (
        <section className="py-24 px-4 bg-pastel-blue/20 overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12 text-center">
                <motion.h2
                    className="text-3xl md:text-5xl font-serif text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    Moments I’ll Always Replay
                </motion.h2>

                <motion.div
                    className="relative aspect-video w-full bg-muted/10 rounded-sm overflow-hidden shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                >

                    {/* Local Video */}
                    <video controls className="w-full h-full object-cover">
                        <source src="/videos/our-video.mp4" type="video/mp4" />
                    </video>
                </motion.div>
            </div>
        </section>
    );
}
