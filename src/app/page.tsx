import HeroSection from '@/components/hero/HeroSection';
import CollectionSection from '@/components/collection/CollectionSection';
import PhilosophySection from '@/components/philosophy/PhilosophySection';
import SkinFitnessSection from '@/components/skin-fitness/SkinFitnessSection';
import StepsSection from '@/components/steps/StepsSection';
import Footer from '@/components/footer/Footer';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section with parallax video and typography */}
      <HeroSection />

      {/* 2. The Collection - 4 product cards with dual-image hover & cart addition */}
      <CollectionSection />

      {/* 3. Philosophy Section - 3D MarchingCubes iridescent bubble with annotations */}
      <PhilosophySection />

      {/* 4. Skin Fitness - High-impact editorial parallax section */}
      <SkinFitnessSection />

      {/* 5. 4 Essential Steps - Sticky scroll with 3D product-revealing bubble canvas */}
      <StepsSection />

      {/* 6. Footer - Links, newsletter subscription, and socials */}
      <Footer />
    </>
  );
}
