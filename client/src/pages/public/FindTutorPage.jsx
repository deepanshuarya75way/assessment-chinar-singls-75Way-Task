import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  LinearProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { SUBJECTS } from '../../data/mockData';
import { teachersAPI } from '../../services/api';

import {
  CuriousBoy,
  CuriousGirl,
  FriendlyTutor,
  ParentMom,
  ParentDad,
} from '../../components/home/CharacterFamily';

import RequestTutorModal from '../../components/student/RequestTutorModal';

/* -------------------------------------------------------------------------- */
/* OPTIONS                                                                    */
/* -------------------------------------------------------------------------- */

const LEARNING_GOALS = [
  'Improve school grades',
  'Prepare for exams',
  'Prepare for board exams',
  'Build strong fundamentals',
  'Homework & assignment support',
  'Competitive exam preparation',
  'Learn a new subject',
  'Improve problem-solving skills',
  'Develop study habits',
  'Catch up on missed topics',
];

const PREFERRED_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const BUDGET_OPTIONS = [
  'Under ₹300/hr',
  '₹300–₹500/hr',
  '₹500–₹750/hr',
  '₹750–₹1,000/hr',
  '₹1,000+/hr',
];

const TUITION_MODES = [
  'Online',
  'Offline',
  'Online & Offline',
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const getTutorAvatar = (name, isDark) => {
  const safeName = name || 'Tutor';

  const sum = safeName
    .split('')
    .reduce((a, b) => a + b.charCodeAt(0), 0);

  const type = sum % 3;

  const colors = [
    isDark ? '#0B1830' : '#DBEAFE',
    isDark ? '#102344' : '#D1FAE5',
    isDark ? '#142B52' : '#F3E8FF',
    isDark ? '#07111F' : '#FEF3C7',
  ];

  const color = colors[sum % colors.length];

  return (
    <Box
      sx={{
        width: 100,
        height: 100,
        borderRadius: '50%',
        bgcolor: color,
        border: `3px solid ${
          isDark ? 'rgba(96,165,250,0.3)' : '#FDE68A'
        }`,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: isDark
          ? '0 0 15px rgba(96,165,250,0.15)'
          : '0 8px 20px rgba(0,0,0,0.1)',
      }}
    >
      {type === 0 && (
        <FriendlyTutor
          width={95}
          height={115}
          sx={{ mb: -1 }}
        />
      )}

      {type === 1 && (
        <ParentMom
          width={95}
          height={115}
          sx={{ mb: -1 }}
        />
      )}

      {type === 2 && (
        <ParentDad
          width={95}
          height={115}
          sx={{ mb: -1 }}
        />
      )}
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* NORMALIZE API RESPONSE                                                     */
/* -------------------------------------------------------------------------- */

const normalizeTeachersResponse = (response) => {
  /*
   * Supports all of these possible backend responses:
   *
   * {
   *   success: true,
   *   data: [...]
   * }
   *
   * {
   *   success: true,
   *   data: {
   *     teachers: [...]
   *   }
   * }
   *
   * {
   *   success: true,
   *   data: {
   *     results: [...]
   *   }
   * }
   *
   * {
   *   teachers: [...]
   * }
   */

  const payload = response?.data ?? response;

  if (Array.isArray(payload)) {
    return {
      teachers: payload,
      total: payload.length,
    };
  }

  if (Array.isArray(payload?.teachers)) {
    return {
      teachers: payload.teachers,
      total: payload.total ?? payload.teachers.length,
    };
  }

  if (Array.isArray(payload?.results)) {
    return {
      teachers: payload.results,
      total: payload.total ?? payload.results.length,
    };
  }

  if (Array.isArray(payload?.data)) {
    return {
      teachers: payload.data,
      total: payload.total ?? payload.data.length,
    };
  }

  return {
    teachers: [],
    total: 0,
  };
};

/* -------------------------------------------------------------------------- */
/* NORMALIZE TEACHER                                                          */
/* -------------------------------------------------------------------------- */

const normalizeTeacher = (teacher, index) => {
  const matchScore = Number(
    teacher.matchScore ??
      teacher.score ??
      teacher.match?.score ??
      0
  );

  const breakdown =
    teacher.matchBreakdown ||
    teacher.matchingBreakdown ||
    teacher.breakdown ||
    teacher.match?.breakdown ||
    {};

  let reasons = [];

  if (Array.isArray(teacher.matchReasons)) {
    reasons = teacher.matchReasons;
  } else if (Array.isArray(teacher.reasons)) {
    reasons = teacher.reasons;
  } else if (Array.isArray(teacher.match?.reasons)) {
    reasons = teacher.match.reasons;
  }

  return {
    ...teacher,

    /*
     * Keep the original teacher object intact while ensuring
     * the UI always has predictable fields.
     */
    _id: teacher._id || teacher.id || `teacher-${index}`,

    name:
      teacher.name ||
      teacher.fullName ||
      'Teacher',

    subjects: Array.isArray(teacher.subjects)
      ? teacher.subjects
      : [],

    classes: Array.isArray(teacher.classes)
      ? teacher.classes
      : [],

    cities: Array.isArray(teacher.cities)
      ? teacher.cities
      : [],

    preferredDays: Array.isArray(teacher.preferredDays)
      ? teacher.preferredDays
      : Array.isArray(teacher.availability)
        ? teacher.availability
        : [],

    teachingMode:
      teacher.teachingMode ||
      teacher.mode ||
      'Online & Offline',

    expectedFee:
      teacher.expectedFee ??
      teacher.fee ??
      '₹500/hr',

    experience:
      teacher.experience ??
      '3+ Years',

    rating: Number(teacher.rating ?? 4.9),

    applicationStatus:
      teacher.applicationStatus ||
      teacher.status ||
      'approved',

    matchScore,

    matchBreakdown: {
      subject:
        Number(
          breakdown.subject ??
            breakdown.subjectMatch ??
            teacher.subjectMatch ??
            0
        ),

      goal:
        Number(
          breakdown.goal ??
            breakdown.goalMatch ??
            teacher.goalMatch ??
            0
        ),

      availability:
        Number(
          breakdown.availability ??
            breakdown.availabilityMatch ??
            teacher.availabilityMatch ??
            0
        ),

      budget:
        Number(
          breakdown.budget ??
            breakdown.budgetMatch ??
            teacher.budgetMatch ??
            0
        ),

      experience:
        Number(
          breakdown.experience ??
            breakdown.experienceMatch ??
            teacher.experienceMatch ??
            0
        ),

      rating:
        Number(
          breakdown.rating ??
            breakdown.ratingMatch ??
            teacher.ratingMatch ??
            0
        ),
    },

    matchReasons: reasons,
  };
};

/* -------------------------------------------------------------------------- */
/* MATCH REASON FALLBACK                                                       */
/* -------------------------------------------------------------------------- */

const buildFallbackReasons = (teacher) => {
  const reasons = [];
  const breakdown = teacher.matchBreakdown || {};

  if (breakdown.subject > 0) {
    if (breakdown.subject >= 30) {
      reasons.push({
        type: 'subject',
        text: 'Teaches all your selected subjects',
        points: breakdown.subject,
      });
    } else {
      reasons.push({
        type: 'subject',
        text: 'Teaches some of your selected subjects',
        points: breakdown.subject,
      });
    }
  }

  if (breakdown.goal > 0) {
    reasons.push({
      type: 'goal',
      text: 'Good fit for your learning goal',
      points: breakdown.goal,
    });
  }

  if (breakdown.availability > 0) {
    reasons.push({
      type: 'availability',
      text: 'Available on your preferred days',
      points: breakdown.availability,
    });
  }

  if (breakdown.budget > 0) {
    reasons.push({
      type: 'budget',
      text: 'Fits your preferred budget',
      points: breakdown.budget,
    });
  }

  if (breakdown.experience > 0) {
    reasons.push({
      type: 'experience',
      text: 'Relevant teaching experience',
      points: breakdown.experience,
    });
  }

  if (breakdown.rating > 0) {
    reasons.push({
      type: 'rating',
      text: 'Highly rated teacher',
      points: breakdown.rating,
    });
  }

  return reasons;
};

/* -------------------------------------------------------------------------- */
/* REASON COLOR                                                                */
/* -------------------------------------------------------------------------- */

const getReasonColor = (type, isDark) => {
  const colors = {
    subject: isDark ? '#60A5FA' : '#2563EB',
    goal: isDark ? '#A78BFA' : '#7C3AED',
    availability: isDark ? '#34D399' : '#059669',
    budget: isDark ? '#FBBF24' : '#D97706',
    experience: isDark ? '#FB7185' : '#E11D48',
    rating: isDark ? '#FCD34D' : '#CA8A04',
  };

  return colors[type] || (isDark ? '#93C5FD' : '#2563EB');
};

/* -------------------------------------------------------------------------- */
/* SCORE BAR                                                                   */
/* -------------------------------------------------------------------------- */

const MatchScore = ({ teacher, isDark }) => {
  const score = Math.max(
    0,
    Math.min(100, Number(teacher.matchScore || 0))
  );

  return (
    <Box
      sx={{
        mb: 2,
        p: 1.5,
        borderRadius: '14px',
        bgcolor: isDark
          ? 'rgba(34,197,94,0.08)'
          : '#F0FDF4',
        border: `1px solid ${
          isDark ? 'rgba(34,197,94,0.2)' : '#BBF7D0'
        }`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.8,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
          }}
        >
          <EmojiEventsIcon
            sx={{
              fontSize: 18,
              color: '#22C55E',
            }}
          />

          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              color: isDark ? '#86EFAC' : '#15803D',
            }}
          >
            Match Score
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 900,
            color: isDark ? '#86EFAC' : '#15803D',
          }}
        >
          {score}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={score}
        sx={{
          height: 7,
          borderRadius: 10,
          bgcolor: isDark
            ? 'rgba(255,255,255,0.08)'
            : '#DCFCE7',
          '& .MuiLinearProgress-bar': {
            borderRadius: 10,
            bgcolor: '#22C55E',
          },
        }}
      />
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* MATCH REASONS                                                               */
/* -------------------------------------------------------------------------- */

const MatchReasons = ({ teacher, isDark }) => {
  const reasons =
    teacher.matchReasons?.length > 0
      ? teacher.matchReasons
      : buildFallbackReasons(teacher);

  if (!reasons.length) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 1,
          fontWeight: 900,
          color: 'text.secondary',
          letterSpacing: 0.5,
        }}
      >
        WHY THIS TUTOR MATCHES
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.7,
        }}
      >
        {reasons.slice(0, 5).map((reason, index) => {
          const type =
            typeof reason === 'string'
              ? 'subject'
              : reason.type || 'subject';

          const text =
            typeof reason === 'string'
              ? reason
              : reason.text ||
                reason.reason ||
                reason.message ||
                'Matches your requirements';

          const points =
            typeof reason === 'object'
              ? reason.points
              : undefined;

          return (
            <Box
              key={`${text}-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                p: 0.8,
                px: 1,
                borderRadius: '9px',
                bgcolor: isDark
                  ? 'rgba(255,255,255,0.04)'
                  : '#F8FAFC',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.8,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: getReasonColor(
                      type,
                      isDark
                    ),
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {text}
                </Typography>
              </Box>

              {points !== undefined && (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 900,
                    color: getReasonColor(
                      type,
                      isDark
                    ),
                    flexShrink: 0,
                  }}
                >
                  +{points}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                              */
/* -------------------------------------------------------------------------- */

export default function StudentFindTutorPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [filters, setFilters] = useState({
    goal: '',
    subjects: [],
    preferredDays: [],
    budget: '',
    mode: '',
    location: '',
  });

  const [teachers, setTeachers] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  /* ------------------------------------------------------------------------ */
  /* INITIAL FETCH                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------------ */
  /* FETCH                                                                    */
  /* ------------------------------------------------------------------------ */

  const fetchTeachers = async () => {
    setLoading(true);

    try {
      const requestParams = {
        goal: filters.goal || undefined,

        subjects:
          filters.subjects.length > 0
            ? filters.subjects
            : undefined,

        preferredDays:
          filters.preferredDays.length > 0
            ? filters.preferredDays
            : undefined,

        budget: filters.budget || undefined,

        mode: filters.mode || undefined,

        location:
          filters.mode === 'Offline' && filters.location
            ? filters.location
            : undefined,
      };

      /*
       * The backend is responsible for:
       *
       * Subject       = 30
       * Goal          = 20
       * Availability  = 20
       * Budget        = 15
       * Experience    = 10
       * Rating        = 5
       *
       * The API should therefore return the teachers
       * already ranked by matchScore.
       */
      const response =
        await teachersAPI.fetchAll(requestParams);

      const normalized =
        normalizeTeachersResponse(response);

      const normalizedTeachers =
        normalized.teachers
          .map(normalizeTeacher)
          /*
           * Defensive frontend sorting.
           *
           * Even if the backend accidentally returns
           * an unordered array, the UI will preserve
           * the matching order.
           */
          .sort(
            (a, b) =>
              Number(b.matchScore || 0) -
              Number(a.matchScore || 0)
          );

      setTeachers(normalizedTeachers);
      setTotalTeachers(
        normalized.total || normalizedTeachers.length
      );
      setSearched(true);
    } catch (err) {
      console.error(
        'Failed to fetch tutors:',
        err
      );

      setTeachers([]);
      setTotalTeachers(0);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* FILTER HELPERS                                                           */
  /* ------------------------------------------------------------------------ */

  const clearFilters = () => {
    const emptyFilters = {
      goal: '',
      subjects: [],
      preferredDays: [],
      budget: '',
      mode: '',
      location: '',
    };

    setFilters(emptyFilters);

    /*
     * We intentionally don't automatically fetch here.
     * User can click Find My Tutor again.
     */
  };

  const handleFilterChange = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* ------------------------------------------------------------------------ */
  /* MODAL                                                                    */
  /* ------------------------------------------------------------------------ */

  const handleRequestTutor = (tutor) => {
    setSelectedTutor(tutor);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTutor(null);
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <Box sx={{ pb: 6 }}>
      {/* ==================================================================== */}
      {/* HERO                                                                 */}
      {/* ==================================================================== */}

      <Box
        sx={{
          bgcolor: isDark
            ? 'rgba(251, 191, 0, 0.05)'
            : '#FFF7D6',
          p: { xs: 3, md: 4 },
          borderRadius: '24px',
          mb: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1px solid ${
            isDark
              ? 'rgba(251,191,0,0.2)'
              : '#FDE68A'
          }`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 650,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Fredoka", sans-serif',
              fontWeight: 800,
              color: 'text.primary',
              mb: 2,
              fontSize: {
                xs: '2rem',
                md: '3rem',
              },
            }}
          >
            Find Your{' '}
            <span style={{ color: '#2563EB' }}>
              Learning Buddy!
            </span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 600,
              fontSize: '1.1rem',
              lineHeight: 1.7,
            }}
          >
            Tell us what you want to learn, when you are
            available and what works for your budget. We'll
            help you find tutors who fit your needs.
          </Typography>
        </Box>

        <Box
          sx={{
            display: {
              xs: 'none',
              md: 'flex',
            },
            position: 'relative',
            zIndex: 2,
            alignItems: 'flex-end',
          }}
        >
          <FriendlyTutor
            width={140}
            height={180}
          />

          <CuriousGirl
            width={120}
            height={160}
          />
        </Box>
      </Box>

      {/* ==================================================================== */}
      {/* REQUIREMENTS FORM                                                    */}
      {/* ==================================================================== */}

      <Card
        elevation={0}
        sx={{
          borderRadius: '24px',
          bgcolor: isDark ? '#0B1F44' : '#FFFFFF',
          border: `2px solid ${
            isDark ? '#102A50' : '#E2E8F0'
          }`,
          mb: 6,
        }}
      >
        <Box
          sx={{
            bgcolor: isDark ? '#102A50' : '#FFFDF5',
            py: 2,
            px: { xs: 2, md: 3 },
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            borderBottom: `1px dashed ${
              isDark ? '#1E3A8A' : '#E2E8F0'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Fredoka", sans-serif',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <span>🎯</span>
              Tell Us What You Need
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 0.5,
                fontWeight: 600,
              }}
            >
              We'll find tutors who match your learning
              requirements.
            </Typography>
          </Box>

          <Button
            onClick={clearFilters}
            startIcon={<RestartAltIcon />}
            sx={{
              color: '#FBBF00',
              fontWeight: 700,
              textTransform: 'none',
              flexShrink: 0,
            }}
          >
            Reset
          </Button>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr',
              },
              gap: 2.5,
            }}
          >
            {/* GOAL */}

            <FormControl fullWidth>
              <InputLabel id="goal-label">
                🎯 What is your goal?
              </InputLabel>

              <Select
                labelId="goal-label"
                value={filters.goal}
                label="🎯 What is your goal?"
                onChange={(e) =>
                  handleFilterChange(
                    'goal',
                    e.target.value
                  )
                }
                sx={{
                  borderRadius: '12px',
                  bgcolor: isDark
                    ? '#07111F'
                    : '#F6F8FC',
                  fontFamily: '"Nunito", sans-serif',
                }}
              >
                <MenuItem value="">
                  <em>Select your goal</em>
                </MenuItem>

                {LEARNING_GOALS.map((goal) => (
                  <MenuItem key={goal} value={goal}>
                    {goal}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* SUBJECTS */}

            <FormControl fullWidth>
              <InputLabel id="subjects-label">
                📚 Subjects
              </InputLabel>

              <Select
                multiple
                labelId="subjects-label"
                value={filters.subjects}
                input={
                  <OutlinedInput label="📚 Subjects" />
                }
                onChange={(e) => {
                  const value = e.target.value;

                  handleFilterChange(
                    'subjects',
                    typeof value === 'string'
                      ? value.split(',')
                      : value
                  );
                }}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      flexWrap: 'wrap',
                    }}
                  >
                    {selected.map((subject) => (
                      <Chip
                        key={subject}
                        label={subject}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
                sx={{
                  borderRadius: '12px',
                  bgcolor: isDark
                    ? '#07111F'
                    : '#F6F8FC',
                  fontFamily: '"Nunito", sans-serif',
                }}
              >
                {SUBJECTS.map((subject) => (
                  <MenuItem
                    key={subject}
                    value={subject}
                  >
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* DAYS */}

            <FormControl fullWidth>
              <InputLabel id="days-label">
                📅 Preferred Days
              </InputLabel>

              <Select
                multiple
                labelId="days-label"
                value={filters.preferredDays}
                input={
                  <OutlinedInput label="📅 Preferred Days" />
                }
                onChange={(e) => {
                  const value = e.target.value;

                  handleFilterChange(
                    'preferredDays',
                    typeof value === 'string'
                      ? value.split(',')
                      : value
                  );
                }}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      flexWrap: 'wrap',
                    }}
                  >
                    {selected.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
                sx={{
                  borderRadius: '12px',
                  bgcolor: isDark
                    ? '#07111F'
                    : '#F6F8FC',
                  fontFamily: '"Nunito", sans-serif',
                }}
              >
                {PREFERRED_DAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* BUDGET */}

            <FormControl fullWidth>
              <InputLabel id="budget-label">
                💰 Budget
              </InputLabel>

              <Select
                labelId="budget-label"
                value={filters.budget}
                label="💰 Budget"
                onChange={(e) =>
                  handleFilterChange(
                    'budget',
                    e.target.value
                  )
                }
                sx={{
                  borderRadius: '12px',
                  bgcolor: isDark
                    ? '#07111F'
                    : '#F6F8FC',
                  fontFamily: '"Nunito", sans-serif',
                }}
              >
                <MenuItem value="">
                  <em>Any budget</em>
                </MenuItem>

                {BUDGET_OPTIONS.map((budget) => (
                  <MenuItem key={budget} value={budget}>
                    {budget}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* MODE */}

            <FormControl fullWidth>
              <InputLabel id="mode-label">
                🏠 Preferred Mode
              </InputLabel>

              <Select
                labelId="mode-label"
                value={filters.mode}
                label="🏠 Preferred Mode"
                onChange={(e) => {
                  const mode = e.target.value;

                  setFilters((previous) => ({
                    ...previous,
                    mode,
                    location:
                      mode === 'Offline'
                        ? previous.location
                        : '',
                  }));
                }}
                sx={{
                  borderRadius: '12px',
                  bgcolor: isDark
                    ? '#07111F'
                    : '#F6F8FC',
                  fontFamily: '"Nunito", sans-serif',
                }}
              >
                <MenuItem value="">
                  <em>Any mode</em>
                </MenuItem>

                {TUITION_MODES.map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode === 'Online' && '💻 '}
                    {mode === 'Offline' && '🏠 '}
                    {mode === 'Online & Offline' && '🔄 '}
                    {mode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* LOCATION */}

            {filters.mode === 'Offline' && (
              <TextField
                fullWidth
                label="📍 Your Location"
                placeholder="Enter your area, locality or city"
                value={filters.location}
                onChange={(e) =>
                  handleFilterChange(
                    'location',
                    e.target.value
                  )
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: isDark
                      ? '#07111F'
                      : '#F6F8FC',
                    fontFamily: '"Nunito", sans-serif',
                  },
                }}
              />
            )}
          </Box>

          {/* SUMMARY */}

          {(filters.goal ||
            filters.subjects.length > 0 ||
            filters.preferredDays.length > 0 ||
            filters.budget ||
            filters.mode ||
            filters.location) && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: '16px',
                bgcolor: isDark
                  ? 'rgba(59,130,246,0.08)'
                  : '#F8FAFC',
                border: `1px solid ${
                  isDark ? '#1E3A8A' : '#E2E8F0'
                }`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: 'text.secondary',
                  display: 'block',
                  mb: 1,
                }}
              >
                YOUR REQUIREMENTS
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {filters.goal && (
                  <Chip
                    label={`🎯 ${filters.goal}`}
                    size="small"
                  />
                )}

                {filters.subjects.map((subject) => (
                  <Chip
                    key={subject}
                    label={`📚 ${subject}`}
                    size="small"
                  />
                ))}

                {filters.preferredDays.map((day) => (
                  <Chip
                    key={day}
                    label={`📅 ${day}`}
                    size="small"
                  />
                ))}

                {filters.budget && (
                  <Chip
                    label={`💰 ${filters.budget}`}
                    size="small"
                  />
                )}

                {filters.mode && (
                  <Chip
                    label={`🏠 ${filters.mode}`}
                    size="small"
                  />
                )}

                {filters.location && (
                  <Chip
                    label={`📍 ${filters.location}`}
                    size="small"
                  />
                )}
              </Box>
            </Box>
          )}

          {/* SEARCH */}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={fetchTeachers}
            disabled={loading}
            startIcon={<SearchIcon />}
            sx={{
              mt: 3,
              borderRadius: '14px',
              py: 1.5,
              bgcolor: '#FBBF00',
              color: '#1B2A4A',
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: '"Fredoka", sans-serif',
              '&:hover': {
                bgcolor: '#F59E0B',
              },
            }}
          >
            {loading
              ? 'Finding Tutors...'
              : 'Find My Tutor 🚀'}
          </Button>
        </CardContent>
      </Card>

      {/* ==================================================================== */}
      {/* RESULTS HEADER                                                       */}
      {/* ==================================================================== */}

      {!loading && searched && teachers.length > 0 && (
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            gap: 1,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Fredoka", sans-serif',
                fontWeight: 800,
              }}
            >
              Your Best Matches 🎯
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 0.5,
                fontWeight: 600,
              }}
            >
              Tutors are ranked by how closely they match
              your requirements.
            </Typography>
          </Box>

          <Chip
            label={`${totalTeachers || teachers.length} tutors found`}
            sx={{
              fontWeight: 800,
              bgcolor: isDark
                ? 'rgba(59,130,246,0.12)'
                : '#EFF6FF',
              color: isDark ? '#93C5FD' : '#2563EB',
            }}
          />
        </Box>
      )}

      {/* ==================================================================== */}
      {/* RESULTS                                                              */}
      {/* ==================================================================== */}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '50px 0',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'linear',
              }}
            >
              <AutoAwesomeIcon
                sx={{
                  fontSize: 50,
                  color: '#FBBF00',
                }}
              />
            </motion.div>

            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontFamily: '"Fredoka", sans-serif',
                fontWeight: 700,
              }}
            >
              Finding your learning buddies...
            </Typography>
          </motion.div>
        ) : teachers.length > 0 ? (
          <Box
            key="results"
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: '1fr 1fr',
              },
              gap: 4,
            }}
          >
            {teachers.map((tutor, idx) => (
              <motion.div
                key={tutor._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: idx * 0.05,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '24px',
                    bgcolor: isDark
                      ? '#102344'
                      : '#FFFFFF',
                    border: `1px solid ${
                      isDark
                        ? 'rgba(96,165,250,0.2)'
                        : '#E2E8F0'
                    }`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: isDark
                        ? '0 10px 30px rgba(0,0,0,0.5)'
                        : '0 10px 30px rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* RANK */}

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: 1,
                      }}
                    >
                      <Chip
                        size="small"
                        label={
                          idx === 0
                            ? '🥇 Best Match'
                            : `#${idx + 1} Match`
                        }
                        sx={{
                          fontWeight: 800,
                          bgcolor:
                            idx === 0
                              ? isDark
                                ? 'rgba(251,191,36,0.12)'
                                : '#FEF3C7'
                              : isDark
                                ? 'rgba(59,130,246,0.1)'
                                : '#EFF6FF',
                          color:
                            idx === 0
                              ? isDark
                                ? '#FCD34D'
                                : '#B45309'
                              : isDark
                                ? '#93C5FD'
                                : '#2563EB',
                        }}
                      />
                    </Box>

                    {/* HEADER */}

                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      {getTutorAvatar(
                        tutor.name,
                        isDark
                      )}

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily:
                                '"Fredoka", sans-serif',
                              fontWeight: 700,
                              wordBreak: 'break-word',
                            }}
                          >
                            {tutor.name}
                          </Typography>

                          {tutor.applicationStatus ===
                            'approved' && (
                            <VerifiedIcon
                              sx={{
                                color: '#3B82F6',
                                fontSize: 20,
                              }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <LocationOnIcon
                            sx={{
                              fontSize: 16,
                            }}
                          />

                          {tutor.cities?.[0] ||
                            tutor.location ||
                            'Remote'}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 1,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Chip
                            size="small"
                            icon={
                              <StarIcon
                                sx={{
                                  color:
                                    '#FBBF00 !important',
                                }}
                              />
                            }
                            label={tutor.rating.toFixed
                              ? tutor.rating.toFixed(1)
                              : tutor.rating}
                            sx={{
                              bgcolor:
                                'rgba(251,191,0,0.1)',
                              color: isDark
                                ? '#FDE68A'
                                : '#D97706',
                              fontWeight: 800,
                            }}
                          />

                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 600,
                            }}
                          >
                            🎓 {tutor.experience}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* MATCH SCORE */}

                    <MatchScore
                      teacher={tutor}
                      isDark={isDark}
                    />

                    {/* MATCH REASONS */}

                    <MatchReasons
                      teacher={tutor}
                      isDark={isDark}
                    />

                    {/* SUBJECTS */}

                    <Box
                      sx={{
                        bgcolor: isDark
                          ? '#0B1830'
                          : '#F6F8FC',
                        p: 2,
                        borderRadius: '16px',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {(tutor.subjects || [])
                          .slice(0, 3)
                          .map((subject) => (
                            <Chip
                              key={subject}
                              label={subject}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                bgcolor: isDark
                                  ? 'rgba(255,255,255,0.1)'
                                  : '#fff',
                              }}
                            />
                          ))}

                        {(tutor.subjects || [])
                          .length > 3 && (
                          <Chip
                            label={`+${
                              tutor.subjects.length - 3
                            }`}
                            size="small"
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <SchoolIcon
                          sx={{
                            fontSize: 16,
                            color: '#3B82F6',
                          }}
                        />

                        Classes:{' '}
                        {(tutor.classes || []).join(
                          ', '
                        ) || 'All Classes'}
                      </Typography>
                    </Box>

                    {/* MODE */}

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={`🏠 ${
                          tutor.teachingMode ||
                          'Online & Home'
                        }`}
                        size="small"
                        sx={{
                          bgcolor: 'transparent',
                          border: `1px dashed ${
                            isDark
                              ? '#334155'
                              : '#CBD5E1'
                          }`,
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* DAYS */}

                    {tutor.preferredDays?.length >
                      0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                          mb: 2,
                        }}
                      >
                        {tutor.preferredDays
                          .slice(0, 4)
                          .map((day) => (
                            <Chip
                              key={day}
                              label={`📅 ${day}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.7rem',
                              }}
                            />
                          ))}
                      </Box>
                    )}

                    {/* FOOTER */}

                    <Box sx={{ mt: 'auto' }}>
                      <Divider sx={{ mb: 2 }} />

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: 'primary.main',
                            fontFamily:
                              '"Fredoka", sans-serif',
                          }}
                        >
                          {tutor.expectedFee}
                        </Typography>

                        <Button
                          variant="contained"
                          endIcon={
                            <RocketLaunchIcon />
                          }
                          onClick={() =>
                            handleRequestTutor(
                              tutor
                            )
                          }
                          sx={{
                            borderRadius: '12px',
                            px: 3,
                            fontWeight: 700,
                            fontFamily:
                              '"Fredoka", sans-serif',
                            bgcolor: '#FBBF00',
                            color: '#1B2A4A',
                            '&:hover': {
                              bgcolor: '#F59E0B',
                            },
                          }}
                        >
                          Request Tutor
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box
            key="empty"
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
              bgcolor: isDark
                ? '#0B1F44'
                : '#FFFFFF',
              borderRadius: '24px',
              border: `2px dashed ${
                isDark
                  ? '#1E3A8A'
                  : '#93C5FD'
              }`,
            }}
          >
            <CuriousBoy
              width={150}
              height={180}
            />

            <Typography
              variant="h5"
              sx={{
                fontFamily:
                  '"Fredoka", sans-serif',
                fontWeight: 700,
                mt: 2,
                mb: 1,
              }}
            >
              {searched
                ? 'No Matching Tutors Found'
                : "Let's Find Your Perfect Match! 🎯"}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 3,
              }}
            >
              {searched
                ? 'Try changing your subjects, budget, location or preferred days.'
                : 'Tell us what you want to learn and we’ll search for tutors who match your requirements.'}
            </Typography>

            <Button
              variant="contained"
              onClick={clearFilters}
              startIcon={<RestartAltIcon />}
              sx={{
                borderRadius: '12px',
                px: 3,
                bgcolor: '#FBBF00',
                color: '#1B2A4A',
                fontWeight: 700,
              }}
            >
              Reset Requirements
            </Button>
          </Box>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* REQUEST TUTOR MODAL                                                  */}
      {/* ==================================================================== */}

      <RequestTutorModal
        open={modalOpen}
        onClose={handleModalClose}
        tutor={selectedTutor}
      />
    </Box>
  );
}