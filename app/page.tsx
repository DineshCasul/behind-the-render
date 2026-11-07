import { HomeHero } from "@/components/home/HomeHero";
import { HomeSections } from "@/components/home/HomeSections";

/** The hero (pick a site), then the roads and the tricks, each grouped. */
export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="py-4 sm:py-6">
        <HomeHero />
      </div>
      <HomeSections />
    </div>
  );
}
