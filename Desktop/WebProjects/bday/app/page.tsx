import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Carousel from "@/components/Carousel";
import Gallery from "@/components/Gallery";
import VideoSection from "@/components/VideoSection";
import InsideJokes from "@/components/InsideJokes";
import LoveLetter from "@/components/LoveLetter";
import Surprise from "@/components/Surprise";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-accent/30 selection:text-foreground">
      <MusicPlayer />

      <Hero />
      <Countdown />
      <Carousel />
      <Gallery />
      <VideoSection />
      <InsideJokes />
      <LoveLetter />
      <Surprise />

      <footer className="py-8 text-center text-muted text-sm font-light">
        <p>Made with love.</p>
      </footer>
    </main>
  );
}
