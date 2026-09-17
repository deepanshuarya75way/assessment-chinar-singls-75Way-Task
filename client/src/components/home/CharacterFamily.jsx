import { Box } from '@mui/material';
import { motion } from 'framer-motion';

// --- Shared Anime Eye Component (Highly Detailed) ---
const DetailedAnimeEye = ({ cx, cy, lookX = 0, lookY = 0, eyeColor = '#3B82F6' }) => (
  <g transform={`translate(${cx + lookX}, ${cy + lookY})`}>
    {/* Eyelashes / Upper Lid */}
    <path d="M-6 -4 C-2 -7 2 -7 6 -3 L7 -4 C3 -8 -3 -8 -7 -4 Z" fill="#1A1C29" />
    <path d="M-6 -4 C-8 -2 -8 0 -8 0 L-7 -1 C-7 -1 -7 -3 -5 -3 Z" fill="#1A1C29" />
    <path d="M6 -3 C7 -1 7 0 7 0 L6 -1 C6 -1 6 -2 5 -2 Z" fill="#1A1C29" />
    
    {/* Sclera (White) */}
    <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="#FFFFFF" />
    
    {/* Iris (Colored with Gradient) */}
    <defs>
      <linearGradient id={`iris-${cx}-${cy}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A1C29" />
        <stop offset="50%" stopColor={eyeColor} />
        <stop offset="100%" stopColor="#93C5FD" />
      </linearGradient>
    </defs>
    <ellipse cx="0" cy="0.5" rx="3.5" ry="4.5" fill={`url(#iris-${cx}-${cy})`} />
    
    {/* Pupil */}
    <ellipse cx="0" cy="0" rx="1.5" ry="2.5" fill="#0F172A" />
    
    {/* Catchlights (Highlights) */}
    <circle cx="-1.5" cy="-1.5" r="1.2" fill="#FFFFFF" />
    <circle cx="1.2" cy="2.2" r="0.6" fill="#FFFFFF" opacity="0.8" />
  </g>
);

// --- 👦 Curious Boy (Student Boy) ---
export function CuriousBoy({ width = 180, height = 220, sx = {} }) {
  return (
    <Box component={motion.div} sx={{ width, height, filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))', ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cb-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE0CC" />
            <stop offset="100%" stopColor="#FFC8A2" />
          </linearGradient>
          <linearGradient id="cb-skin-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC8A2" />
            <stop offset="100%" stopColor="#E5A681" />
          </linearGradient>
          <linearGradient id="cb-hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A3B32" />
            <stop offset="100%" stopColor="#2A201A" />
          </linearGradient>
          <linearGradient id="cb-hoodie" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="cb-hoodie-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>

        {/* Backpack Straps */}
        <path d="M45 100 L40 180 M115 100 L120 180" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
        
        {/* Hoodie Back / Body Base */}
        <path d="M30 200 C30 110 50 90 80 90 C110 90 130 110 130 200 Z" fill="url(#cb-hoodie)" />
        
        {/* Hoodie Strings */}
        <path d="M70 110 Q72 130 68 140 M90 110 Q88 130 92 140" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" fill="none" />
        
        {/* Cel Shading on Hoodie */}
        <path d="M50 140 Q65 170 80 180 Q95 170 110 140 L110 200 L50 200 Z" fill="url(#cb-hoodie-shade)" opacity="0.6" />
        <path d="M30 200 C30 140 45 120 55 120 L55 200 Z" fill="url(#cb-hoodie-shade)" opacity="0.8" />
        <path d="M130 200 C130 140 115 120 105 120 L105 200 Z" fill="url(#cb-hoodie-shade)" opacity="0.8" />

        {/* Neck & Shading */}
        <path d="M72 80 L88 80 L88 100 L72 100 Z" fill="url(#cb-skin-shade)" />
        <path d="M72 80 L88 80 L88 90 C88 95 80 95 72 90 Z" fill="url(#cb-skin)" />
        
        {/* Head / Face */}
        <path d="M50 55 C50 25 110 25 110 55 C110 85 95 95 80 95 C65 95 50 85 50 55 Z" fill="url(#cb-skin)" />
        
        {/* Cheek Blushes */}
        <ellipse cx="62" cy="72" rx="4" ry="2" fill="#F43F5E" opacity="0.25" />
        <ellipse cx="98" cy="72" rx="4" ry="2" fill="#F43F5E" opacity="0.25" />
        
        {/* Eyes */}
        <DetailedAnimeEye cx="65" cy="62" eyeColor="#059669" />
        <DetailedAnimeEye cx="95" cy="62" eyeColor="#059669" />
        
        {/* Eyebrows */}
        <path d="M58 52 Q65 50 72 54" stroke="#2A201A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M102 52 Q95 50 88 54" stroke="#2A201A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Nose */}
        <path d="M79 72 Q80 75 81 72" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
        
        {/* Smile */}
        <path d="M74 80 Q80 86 86 80" stroke="#9F1239" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Ears */}
        <path d="M50 58 C45 58 45 68 50 68" fill="url(#cb-skin)" />
        <path d="M110 58 C115 58 115 68 110 68" fill="url(#cb-skin)" />

        {/* Hair Back & Sides */}
        <path d="M45 50 C40 10 120 10 115 50 C115 70 105 80 105 80 L110 55 C110 20 50 20 50 55 L55 80 C55 80 45 70 45 50 Z" fill="url(#cb-hair)" />
        
        {/* Hair Front Bangs / Spikes (Highly Detailed) */}
        <path d="M48 45 Q55 25 75 35 Q65 35 60 48 Q70 25 90 35 Q80 38 75 50 Q90 25 105 40 Q95 42 90 52 Q105 35 112 45 Q100 50 105 60 Q95 50 90 55 Q90 40 85 50 Q75 40 70 52 Q65 42 60 55 Q60 45 55 58 Q55 40 48 45 Z" fill="url(#cb-hair)" />
        
        {/* Hair Highlights */}
        <path d="M65 30 Q80 20 95 30" stroke="#78716C" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Hand holding a detailed Book */}
        <g transform="translate(10, 40)">
          {/* Book */}
          <path d="M15 110 L50 90 L85 110 L50 130 Z" fill="#E2E8F0" />
          <path d="M15 110 L50 130 L50 145 L15 125 Z" fill="#CBD5E1" />
          <path d="M85 110 L50 130 L50 145 L85 125 Z" fill="#94A3B8" />
          <path d="M15 110 L50 90 L85 110" stroke="#0284C7" strokeWidth="2" fill="none" />
          {/* Hand */}
          <circle cx="50" cy="135" r="9" fill="url(#cb-skin)" />
          <path d="M44 135 C44 140 48 144 50 144" stroke="#E5A681" strokeWidth="1" fill="none" />
        </g>
      </svg>
    </Box>
  );
}

// --- 👧 Curious Girl (Student Girl) ---
export function CuriousGirl({ width = 180, height = 220, sx = {} }) {
  return (
    <Box component={motion.div} sx={{ width, height, filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))', ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cg-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF1E8" />
            <stop offset="100%" stopColor="#FFDBC4" />
          </linearGradient>
          <linearGradient id="cg-skin-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFDBC4" />
            <stop offset="100%" stopColor="#FDBA9B" />
          </linearGradient>
          <linearGradient id="cg-hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3730A3" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id="cg-sweater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="cg-shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* Back Hair (Pigtails) */}
        <path d="M40 50 C20 80 15 120 25 150 C30 140 35 120 45 100 Z" fill="url(#cg-hair)" />
        <path d="M120 50 C140 80 145 120 135 150 C130 140 125 120 115 100 Z" fill="url(#cg-hair)" />

        {/* Sweater & Collar */}
        <path d="M35 200 C35 120 55 95 80 95 C105 95 125 120 125 200 Z" fill="url(#cg-sweater)" />
        <path d="M65 95 L80 125 L95 95 Z" fill="url(#cg-shirt)" />
        <path d="M65 95 L80 115 L95 95" stroke="#9F1239" strokeWidth="2" fill="none" />
        <path d="M35 200 C35 150 45 130 55 130 L55 200 Z" fill="#9F1239" opacity="0.5" />
        <path d="M125 200 C125 150 115 130 105 130 L105 200 Z" fill="#9F1239" opacity="0.5" />

        {/* Neck */}
        <path d="M74 80 L86 80 L86 100 L74 100 Z" fill="url(#cg-skin-shade)" />
        <path d="M74 80 L86 80 L86 90 C86 95 74 95 74 90 Z" fill="url(#cg-skin)" />

        {/* Face */}
        <path d="M52 55 C52 25 108 25 108 55 C108 82 95 92 80 92 C65 92 52 82 52 55 Z" fill="url(#cg-skin)" />

        {/* Cheeks */}
        <ellipse cx="62" cy="70" rx="4" ry="2.5" fill="#F43F5E" opacity="0.3" />
        <ellipse cx="98" cy="70" rx="4" ry="2.5" fill="#F43F5E" opacity="0.3" />

        {/* Eyes */}
        <DetailedAnimeEye cx="64" cy="60" eyeColor="#9333EA" />
        <DetailedAnimeEye cx="96" cy="60" eyeColor="#9333EA" />

        {/* Eyebrows */}
        <path d="M56 48 Q64 45 70 50" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M104 48 Q96 45 90 50" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <path d="M79 70 Q80 72 81 70" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Happy Smile (Open mouth) */}
        <path d="M73 76 Q80 88 87 76 Z" fill="#9F1239" />
        <path d="M75 80 Q80 86 85 80 Z" fill="#FDA4AF" />

        {/* Front Bangs */}
        <path d="M50 50 Q60 30 80 30 Q100 30 110 50 Q100 45 90 55 Q85 45 80 50 Q75 45 70 55 Q60 45 50 50 Z" fill="url(#cg-hair)" />
        <path d="M48 40 Q55 20 80 20 Q105 20 112 40 Q100 25 80 25 Q60 25 48 40 Z" fill="url(#cg-hair)" />
        
        {/* Hair Accessories */}
        <circle cx="45" cy="45" r="4" fill="#FCD34D" />
        <circle cx="115" cy="45" r="4" fill="#FCD34D" />

        {/* Hair Highlight */}
        <path d="M65 32 Q80 25 95 32" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.3" />

        {/* Holding a glowing Tablet */}
        <g transform="rotate(10 100 130) translate(0, 30)">
          <rect x="80" y="90" width="55" height="40" rx="4" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" />
          <rect x="83" y="93" width="49" height="34" rx="2" fill="#E0F2FE" />
          <circle cx="108" cy="110" r="8" fill="#38BDF8" opacity="0.8" />
          <path d="M102 110 L114 110 M108 104 L108 116" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="95" cy="120" r="6" fill="url(#cg-skin)" />
        </g>
      </svg>
    </Box>
  );
}

// --- 👩🏫 Friendly Tutor (Female) ---
export function FriendlyTutor({ width = 180, height = 220, sx = {} }) {
  return (
    <Box component={motion.div} sx={{ width, height, filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))', ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ft-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF1E8" />
            <stop offset="100%" stopColor="#FFDBC4" />
          </linearGradient>
          <linearGradient id="ft-skin-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFDBC4" />
            <stop offset="100%" stopColor="#FDBA9B" />
          </linearGradient>
          <linearGradient id="ft-hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="ft-blazer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Back Hair */}
        <path d="M40 40 C30 90 40 140 50 160 C55 120 60 90 65 80 Z" fill="url(#ft-hair)" />
        <path d="M120 40 C130 90 120 140 110 160 C105 120 100 90 95 80 Z" fill="url(#ft-hair)" />

        {/* Blazer / Shirt */}
        <path d="M30 200 C30 110 50 90 80 90 C110 90 130 110 130 200 Z" fill="url(#ft-blazer)" />
        <path d="M70 90 L80 130 L90 90 Z" fill="#F8FAFC" />
        <path d="M80 130 L80 200" stroke="#047857" strokeWidth="2" opacity="0.5" />
        <path d="M30 200 C30 140 45 120 60 120 L60 200 Z" fill="#047857" opacity="0.6" />
        <path d="M130 200 C130 140 115 120 100 120 L100 200 Z" fill="#047857" opacity="0.6" />

        {/* Neck */}
        <path d="M74 80 L86 80 L86 100 L74 100 Z" fill="url(#ft-skin-shade)" />
        <path d="M74 80 L86 80 L86 90 C86 95 74 95 74 90 Z" fill="url(#ft-skin)" />

        {/* Face */}
        <path d="M55 50 C55 20 105 20 105 50 C105 80 95 90 80 90 C65 90 55 80 55 50 Z" fill="url(#ft-skin)" />

        {/* Eyes */}
        <DetailedAnimeEye cx="66" cy="56" eyeColor="#B45309" />
        <DetailedAnimeEye cx="94" cy="56" eyeColor="#B45309" />

        {/* Eyebrows */}
        <path d="M58 46 Q65 44 72 48" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M102 46 Q95 44 88 48" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Glasses */}
        <rect x="56" y="50" width="20" height="12" rx="3" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
        <rect x="84" y="50" width="20" height="12" rx="3" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
        <line x1="76" y1="56" x2="84" y2="56" stroke="#F59E0B" strokeWidth="1.5" />
        <line x1="50" y1="52" x2="56" y2="52" stroke="#F59E0B" strokeWidth="1.5" />
        <line x1="104" y1="52" x2="110" y2="52" stroke="#F59E0B" strokeWidth="1.5" />

        {/* Nose */}
        <path d="M79 66 Q80 69 81 66" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Smile */}
        <path d="M73 75 Q80 82 87 75" stroke="#9F1239" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Front Hair */}
        <path d="M52 45 Q65 25 80 25 Q95 25 108 45 Q95 35 80 35 Q65 35 52 45 Z" fill="url(#ft-hair)" />
        <path d="M55 25 Q80 10 105 25 Q90 20 80 20 Q70 20 55 25 Z" fill="url(#ft-hair)" />

        {/* Hand with pen explaining */}
        <g transform="translate(10, 40)">
          <path d="M110 80 L125 50" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="115" cy="85" r="8" fill="url(#ft-skin)" />
          <path d="M110 85 C108 88 112 92 115 92" stroke="#E5A681" strokeWidth="1" fill="none" />
        </g>
      </svg>
    </Box>
  );
}

// --- 🧪 Little Scientist ---
export function LittleScientist({ width = 180, height = 220, sx = {} }) {
  return (
    <Box component={motion.div} sx={{ width, height, filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))', ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ls-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF1E8" />
            <stop offset="100%" stopColor="#FFDBC4" />
          </linearGradient>
          <linearGradient id="ls-skin-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFDBC4" />
            <stop offset="100%" stopColor="#FDBA9B" />
          </linearGradient>
          <linearGradient id="ls-coat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* Coat Base */}
        <path d="M35 200 C35 110 50 90 80 90 C110 90 125 110 125 200 Z" fill="url(#ls-coat)" />
        <path d="M70 90 L80 125 L90 90 Z" fill="#38BDF8" />
        <line x1="80" y1="125" x2="80" y2="200" stroke="#CBD5E1" strokeWidth="2" />
        
        <path d="M35 200 C35 140 45 120 55 120 L55 200 Z" fill="#CBD5E1" opacity="0.6" />
        <path d="M125 200 C125 140 115 120 105 120 L105 200 Z" fill="#CBD5E1" opacity="0.6" />

        {/* Neck */}
        <path d="M74 80 L86 80 L86 100 L74 100 Z" fill="url(#ls-skin-shade)" />
        <path d="M74 80 L86 80 L86 90 C86 95 74 95 74 90 Z" fill="url(#ls-skin)" />

        {/* Face */}
        <path d="M50 55 C50 25 110 25 110 55 C110 85 95 95 80 95 C65 95 50 85 50 55 Z" fill="url(#ls-skin)" />

        {/* Messy Spiky Hair */}
        <path d="M45 50 Q35 25 55 20 Q65 5 80 15 Q95 5 105 20 Q125 25 115 50 Q125 65 110 70 Q115 85 95 75 Q80 90 65 75 Q45 85 50 70 Q35 65 45 50 Z" fill="#F59E0B" />
        <path d="M50 55 C50 25 110 25 110 55 C110 85 95 95 80 95 C65 95 50 85 50 55 Z" fill="url(#ls-skin)" />

        {/* Safety Goggles on Forehead */}
        <rect x="48" y="30" width="64" height="20" rx="10" fill="rgba(56,189,248,0.2)" stroke="#1E293B" strokeWidth="2.5" />
        <circle cx="62" cy="40" r="5" fill="#FFFFFF" opacity="0.7" />
        <circle cx="98" cy="40" r="5" fill="#FFFFFF" opacity="0.7" />
        <path d="M40 40 L48 40 M112 40 L120 40" stroke="#1E293B" strokeWidth="3" />

        {/* Eyes */}
        <DetailedAnimeEye cx="65" cy="64" eyeColor="#0284C7" />
        <DetailedAnimeEye cx="95" cy="64" eyeColor="#0284C7" />

        {/* Nose & Smile */}
        <path d="M79 73 Q80 76 81 73" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M72 82 Q80 90 88 82 Z" fill="#9F1239" />
        <path d="M75 85 Q80 89 85 85 Z" fill="#FDA4AF" />

        {/* Cheek Blushes */}
        <ellipse cx="60" cy="74" rx="4" ry="2" fill="#F43F5E" opacity="0.3" />
        <ellipse cx="100" cy="74" rx="4" ry="2" fill="#F43F5E" opacity="0.3" />

        {/* Hand holding Flask */}
        <g transform="translate(15, 60)">
          <path d="M75 110 L95 135 L55 135 Z" fill="rgba(255,255,255,0.7)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <path d="M72 115 L90 133 L60 133 Z" fill="#10B981" />
          <circle cx="80" cy="125" r="3" fill="#A7F3D0" opacity="0.8" />
          <circle cx="85" cy="130" r="2" fill="#A7F3D0" opacity="0.8" />
          <circle cx="72" cy="128" r="2" fill="#A7F3D0" opacity="0.8" />
          <rect x="70" y="98" width="10" height="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          
          <circle cx="75" cy="115" r="9" fill="url(#ls-skin)" />
          <path d="M69 115 C69 120 73 124 75 124" stroke="#E5A681" strokeWidth="1" fill="none" />
          
          <motion.circle animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} cx="75" cy="85" r="4" fill="#34D399" opacity="0.7" />
          <motion.circle animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }} cx="82" cy="75" r="3" fill="#34D399" opacity="0.7" />
        </g>
      </svg>
    </Box>
  );
}

// --- 💻 Little Coder ---
export function LittleCoder({ width = 180, height = 220, sx = {} }) {
  return (
    <Box component={motion.div} sx={{ width, height, filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))', ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lc-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE0CC" />
            <stop offset="100%" stopColor="#FFC8A2" />
          </linearGradient>
          <linearGradient id="lc-skin-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC8A2" />
            <stop offset="100%" stopColor="#E5A681" />
          </linearGradient>
          <linearGradient id="lc-hoodie" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
        </defs>

        {/* Hoodie Base */}
        <path d="M30 200 C30 110 50 90 80 90 C110 90 130 110 130 200 Z" fill="url(#lc-hoodie)" />
        <path d="M60 90 Q80 130 100 90" stroke="#A78BFA" strokeWidth="3" fill="none" />
        <path d="M30 200 C30 140 45 120 55 120 L55 200 Z" fill="#4C1D95" opacity="0.6" />
        <path d="M130 200 C130 140 115 120 105 120 L105 200 Z" fill="#4C1D95" opacity="0.6" />

        {/* Neck */}
        <path d="M74 80 L86 80 L86 100 L74 100 Z" fill="url(#lc-skin-shade)" />
        <path d="M74 80 L86 80 L86 90 C86 95 74 95 74 90 Z" fill="url(#lc-skin)" />

        {/* Face */}
        <path d="M50 55 C50 25 110 25 110 55 C110 85 95 95 80 95 C65 95 50 85 50 55 Z" fill="url(#lc-skin)" />

        {/* Beanie */}
        <path d="M47 45 C47 -5 113 -5 113 45 Z" fill="#F59E0B" />
        <rect x="45" y="40" width="70" height="12" rx="6" fill="#D97706" />
        
        {/* Headphones */}
        <path d="M45 55 C45 10 115 10 115 55" stroke="#1E293B" strokeWidth="5" fill="none" />
        <rect x="38" y="45" width="12" height="28" rx="6" fill="#334155" />
        <rect x="110" y="45" width="12" height="28" rx="6" fill="#334155" />
        <circle cx="44" cy="59" r="4" fill="#38BDF8" />
        <circle cx="116" cy="59" r="4" fill="#38BDF8" />

        {/* Eyes */}
        <DetailedAnimeEye cx="65" cy="62" eyeColor="#EA580C" />
        <DetailedAnimeEye cx="95" cy="62" eyeColor="#EA580C" />

        {/* Nose & Confident Smile */}
        <path d="M79 72 Q80 75 81 72" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M72 82 Q80 86 88 80" stroke="#8A4A33" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Glowing Laptop */}
        <g transform="translate(0, 30)">
          <rect x="40" y="90" width="80" height="50" rx="4" fill="#1E293B" stroke="#0EA5E9" strokeWidth="2.5" />
          <rect x="45" y="95" width="70" height="40" rx="2" fill="#0F172A" />
          <text x="58" y="122" fill="#38BDF8" fontSize="18" fontWeight="bold" fontFamily="monospace">&lt;/&gt;</text>
          <path d="M25 142 L135 142 L145 160 L15 160 Z" fill="#475569" />
          <path d="M35 145 L125 145 L130 155 L30 155 Z" fill="#334155" />
          {/* Hands Typing */}
          <circle cx="60" cy="148" r="8" fill="url(#lc-skin)" />
          <circle cx="100" cy="148" r="8" fill="url(#lc-skin)" />
        </g>
      </svg>
    </Box>
  );
}

// --- ⭐ Achievement Star (Student with Trophy) ---
export function AchievementStar({ width = 180, height = 220, sx = {} }) {
  return (
    <Box component={motion.div} sx={{ width, height, filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))', ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="as-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF1E8" />
            <stop offset="100%" stopColor="#FFDBC4" />
          </linearGradient>
          <linearGradient id="as-skin-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFDBC4" />
            <stop offset="100%" stopColor="#FDBA9B" />
          </linearGradient>
          <linearGradient id="as-shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="as-hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4A3B32" />
            <stop offset="100%" stopColor="#2A201A" />
          </linearGradient>
          <linearGradient id="as-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Shirt Base */}
        <path d="M35 200 C35 110 50 90 80 90 C110 90 125 110 125 200 Z" fill="url(#as-shirt)" />
        <path d="M35 200 C35 140 45 120 55 120 L55 200 Z" fill="#047857" opacity="0.6" />
        <path d="M125 200 C125 140 115 120 105 120 L105 200 Z" fill="#047857" opacity="0.6" />

        {/* Neck */}
        <path d="M74 80 L86 80 L86 100 L74 100 Z" fill="url(#as-skin-shade)" />
        <path d="M74 80 L86 80 L86 90 C86 95 74 95 74 90 Z" fill="url(#as-skin)" />

        {/* Face */}
        <path d="M50 55 C50 25 110 25 110 55 C110 85 95 95 80 95 C65 95 50 85 50 55 Z" fill="url(#as-skin)" />

        {/* Happy Closed Anime Eyes */}
        <path d="M58 60 Q65 52 72 60" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M88 60 Q95 52 102 60" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M56 48 Q64 46 70 50" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M104 48 Q96 46 90 50" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <ellipse cx="60" cy="68" rx="5" ry="3" fill="#F43F5E" opacity="0.4" />
        <ellipse cx="100" cy="68" rx="5" ry="3" fill="#F43F5E" opacity="0.4" />

        {/* Big Open Smile */}
        <path d="M70 70 Q80 85 90 70 Z" fill="#9F1239" />
        <path d="M74 76 Q80 82 86 76 Z" fill="#FDA4AF" />

        {/* Neat Hair */}
        <path d="M48 45 Q55 25 80 25 Q105 25 112 45 Q100 35 80 35 Q60 35 48 45 Z" fill="url(#as-hair)" />
        <path d="M50 25 Q80 10 110 25 Q95 20 80 20 Q65 20 50 25 Z" fill="url(#as-hair)" />
        
        {/* Celebration Stars / Sparkles */}
        <motion.path animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 4 }} d="M35 35 L40 25 L45 35 L55 40 L45 45 L40 55 L35 45 L25 40 Z" fill="#F59E0B" />
        <motion.path animate={{ scale: [1, 1.2, 1], rotate: [0, -90, -180] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }} d="M120 25 L123 18 L126 25 L133 28 L126 31 L123 38 L120 31 L113 28 Z" fill="#F59E0B" />

        {/* Trophy */}
        <g transform="translate(0, 30)">
          <path d="M60 90 L100 90 L90 120 Q80 130 80 140 L70 140 L70 120 Q70 120 60 90 Z" fill="url(#as-gold)" />
          <path d="M65 140 L95 140 L100 150 L60 150 Z" fill="#B45309" />
          <path d="M60 95 Q50 95 50 105 Q50 115 65 110" stroke="url(#as-gold)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M100 95 Q110 95 110 105 Q110 115 95 110" stroke="url(#as-gold)" strokeWidth="4" fill="none" strokeLinecap="round" />
          
          {/* Hands holding trophy */}
          <circle cx="55" cy="120" r="9" fill="url(#as-skin)" />
          <circle cx="105" cy="120" r="9" fill="url(#as-skin)" />
        </g>
      </svg>
    </Box>
  );
}

// --- 👩 Parent Avatars for Testimonials ---
export const ParentMom = ({ size = 60, color = "#EC4899" }) => (
  <Box sx={{ width: size, height: size, borderRadius: '50%', bgcolor: color, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', border: '3px solid #F2B705' }}>
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M20 100 C20 60 80 60 80 100" fill="#FFFFFF" />
      <path d="M30 100 C30 70 70 70 70 100" fill="#FCE7F3" />
      {/* Neck */}
      <rect x="42" y="55" width="16" height="20" fill="#FFC8A2" />
      {/* Head */}
      <ellipse cx="50" cy="45" rx="22" ry="26" fill="#FFE0CC" />
      {/* Eyes */}
      <DetailedAnimeEye cx="41" cy="45" eyeColor="#9333EA" />
      <DetailedAnimeEye cx="59" cy="45" eyeColor="#9333EA" />
      {/* Smile */}
      <path d="M46 56 Q50 62 54 56" stroke="#9F1239" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Elegant Hair */}
      <path d="M25 45 C25 10 75 10 75 45 C75 70 85 80 85 80 L90 50 C90 0 10 0 10 50 L15 80 C15 80 25 70 25 45 Z" fill="#4A3B32" />
      <path d="M30 35 Q50 15 70 35 Q60 25 50 25 Q40 25 30 35 Z" fill="#4A3B32" />
    </svg>
  </Box>
);

export const ParentDad = ({ size = 60, color = "#3B82F6" }) => (
  <Box sx={{ width: size, height: size, borderRadius: '50%', bgcolor: color, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', border: '3px solid #F2B705' }}>
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M15 100 C15 60 85 60 85 100" fill="#E0F2FE" />
      <path d="M45 65 L50 75 L55 65 Z" fill="#FFFFFF" />
      <path d="M50 75 L50 100" stroke="#BAE6FD" strokeWidth="2" />
      {/* Neck */}
      <rect x="40" y="55" width="20" height="20" fill="#FDBA9B" />
      {/* Head */}
      <ellipse cx="50" cy="45" rx="24" ry="28" fill="#FFC8A2" />
      {/* Glasses */}
      <rect x="30" y="40" width="16" height="10" rx="2" fill="none" stroke="#1E293B" strokeWidth="2" />
      <rect x="54" y="40" width="16" height="10" rx="2" fill="none" stroke="#1E293B" strokeWidth="2" />
      <line x1="46" y1="45" x2="54" y2="45" stroke="#1E293B" strokeWidth="2" />
      {/* Eyes */}
      <DetailedAnimeEye cx="38" cy="45" eyeColor="#0F172A" />
      <DetailedAnimeEye cx="62" cy="45" eyeColor="#0F172A" />
      {/* Smile */}
      <path d="M44 58 Q50 64 56 58" stroke="#8A4A33" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Short Hair */}
      <path d="M26 40 C26 15 74 15 74 40 Q74 45 70 50 Q60 30 50 30 Q40 30 30 50 Q26 45 26 40 Z" fill="#1E293B" />
      <path d="M28 35 Q50 15 72 35 Q60 25 50 25 Q40 25 28 35 Z" fill="#1E293B" />
    </svg>
  </Box>
);
