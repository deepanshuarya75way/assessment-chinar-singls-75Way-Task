import { Box } from '@mui/material';
import AboutHero from '../../components/about/AboutHero';
import OurStory from '../../components/about/OurStory';
import LearningJourney from '../../components/about/LearningJourney';
import LearningSuperpowers from '../../components/about/LearningSuperpowers';
import FamilyBenefits from '../../components/about/FamilyBenefits';
import LearningAdventure from '../../components/about/LearningAdventure';
import LearningBuddy from '../../components/about/LearningBuddy';
import CoreValues from '../../components/about/CoreValues';

import AboutCTA from '../../components/about/AboutCTA';

/**
 * About Us — rebuilt around a storytelling structure:
 * Hero → Our Story → Learning Philosophy → Superpowers → Family Benefits
 * → Learning Adventure → Learning Buddy → Core Values → Testimonials → CTA.
 */
export default function AboutPage() {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <AboutHero />
      <OurStory />
      <LearningJourney />
      <LearningSuperpowers />
      <FamilyBenefits />
      <LearningAdventure />
      <LearningBuddy />
      <CoreValues />

      <AboutCTA />
    </Box>
  );
}