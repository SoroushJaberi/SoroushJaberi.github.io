import AppWrapper from '@/components/AppWrapper';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ResearchFocus from '@/components/ResearchFocus';
import AcademicSection from '@/components/AcademicSection';
import SkillsHeader from '@/components/SkillsHeader';
import SkillsSection from '@/components/SkillsSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import TimelineSection from '@/components/TimelineSection';
import ContactSection from '@/components/ContactSection';
import SectionBackground from '@/components/SectionBackground';

export default function Home() {
  return (
    <main className="relative z-10 w-full">
      <AppWrapper>
        <HeroSection />

        <div className="relative w-full overflow-x-hidden">
          <SectionBackground />

          <div className="relative z-10">
            <AboutSection />
            <ResearchFocus />
            <AcademicSection />
            <SkillsHeader />
            <SkillsSection />
            <FeaturedProjects />
            <TimelineSection />
            <ContactSection />
          </div>
        </div>
      </AppWrapper>
    </main>
  );
}
