"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

// Placeholder data - replace with real images
const MEMORIES = [
    { id: 1, src: "/images/memory-1.jpg?v=2", caption: "this was a good day." },
    { id: 2, src: "/images/memory-2.jpg?v=2", caption: "sundarrrrr." },
    { id: 3, src: "/images/memory-3.jpg?v=2", caption: "laughs." },
    { id: 4, src: "/images/memory-4.jpg?v=2", caption: "just us." },
    { id: 5, src: "/images/memory-5.jpg?v=2", caption: "first kiss?" },
    { id: 6, src: "/images/memory-6.jpg?v=2", caption: "lovee youu" },
];

export default function Gallery() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <section className="py-20 px-4 bg-pastel-beige">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-foreground">
                Memories
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {MEMORIES.map((memory, index) => (
                    <motion.div
                        key={memory.id}
                        layoutId={`card-${memory.id}`}
                        onClick={() => setSelectedId(memory.id)}
                        className="relative aspect-square cursor-pointer overflow-hidden rounded-md shadow-sm group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* 
              Note: Using a div placeholder for now since images might not exist. 
              Uncomment standard Image component when files are added.
            */}
                        <div className={`w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out flex items-center justify-center text-foreground/50
                            ${index % 3 === 0 ? 'bg-pastel-pink' : index % 3 === 1 ? 'bg-pastel-blue' : 'bg-pastel-lavender'}`}
                        >
                            <span className="sr-only">{memory.caption}</span>
                            <Image
                                src={memory.src}
                                alt={memory.caption}
                                fill
                                className="object-cover transition-all duration-500 ease-in-out grayscale group-hover:grayscale-0"
                                unoptimized
                            />
                        </div>

                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            layoutId={`card-${selectedId}`}
                            className="relative max-w-4xl w-full bg-background rounded-sm overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedId(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="aspect-video relative bg-neutral-200 flex items-center justify-center">
                                {/* Replace with actual Image */}
                                {selectedId && (
                                    <Image
                                        src={MEMORIES.find((m) => m.id === selectedId)?.src || ""}
                                        alt="Selected memory"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                )}
                            </div>

                            <div className="p-6 text-center">
                                <p className="text-lg font-serif italic text-foreground">
                                    {MEMORIES.find((m) => m.id === selectedId)?.caption}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
