import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { Hero } from "@/components/ui/Hero";
import { LearningMap } from "@/components/learning-map/LearningMap";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <GridBackdrop />
      <Hero />
      <LearningMap />
    </div>
  );
}
