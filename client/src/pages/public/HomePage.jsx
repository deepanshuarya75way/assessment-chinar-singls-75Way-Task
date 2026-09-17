import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import PopularClasses from '../../components/home/PopularClasses';
import CompetitiveExams from '../../components/home/CompetitiveExams';
import HowItWorks from '../../components/home/HowItWorks';

import WhyChooseUs from '../../components/home/WhyChooseUs';
import FinalCTA from '../../components/home/FinalCTA';

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* 1. Hero Section (No search form, rich visual composition, trust badges & strong CTAs) */}
      <HeroSection />

      {/* 2. Full-Width Statistics & Animated Counter Section */}
      <StatsSection />

      {/* 3. Popular Classes & Pill Selector Section */}
      <PopularClasses />

      {/* 4. Competitive Exam Coaching Section (Equal-sized cards with taglines & hover effects) */}
      <CompetitiveExams />

      {/* 5. How 75 Way Project Task Works Process (One horizontal line on desktop, vertical timeline on mobile) */}
      <HowItWorks />


      {/* 7. Why Parents Choose 75 Way Project Task (Interactive feature cards) */}
      <WhyChooseUs />

      {/* 8. Final CTA Banner Section */}
      <FinalCTA />
    </Box>
  );
}
