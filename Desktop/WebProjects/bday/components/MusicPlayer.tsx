"use client";

import { useState, useRef, useEffect } from "react";
import { Music, VolumeX, Volume2 } from "lucide-react";

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Attempt autoplay on mount
        if (audioRef.current) {
            audioRef.current.volume = 0.4;
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch((error) => {
                    // Autoplay was prevented
                    console.log("Autoplay prevented:", error);
                    setIsPlaying(false);
                });
            }
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <audio ref={audioRef} loop src="/music/background.mp3" /> {/* Replace with actual file */}

            <button
                onClick={togglePlay}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-foreground hover:bg-white/20 transition-all shadow-lg"
                aria-label="Toggle music"
            >
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
        </div>
    );
}
