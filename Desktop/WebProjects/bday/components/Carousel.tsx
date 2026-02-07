"use client";

import { motion } from "framer-motion";

import Image from "next/image";

const CAROUSEL_IMAGES = [
    "/images/carousel-1.jpg?v=2",
    "/images/carousel-2.jpg?v=2",
    "/images/carousel-3.jpg?v=2",
    "/images/carousel-4.jpg?v=2",
    "/images/carousel-5.jpg?v=2",
    "/images/carousel-6.jpg?v=2",
];

export default function Carousel() {
    // Triple the array to ensure smooth infinite looping without gaps
    const images = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="relative w-full">
                <div className="flex w-max animate-carousel hover:[animation-play-state:paused]">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="relative w-[300px] md:w-[400px] aspect-[4/5] mx-4 shrink-0 rounded-sm overflow-hidden bg-pastel-beige/50"
                        >
                            <Image
                                src={src}
                                alt="Memory"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
