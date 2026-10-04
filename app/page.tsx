import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Gallery } from "@/components/Gallery";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <ProductGrid />
      <Gallery />
    </div>
  );
}
