import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Grid, Avatar, Chip, Button, IconButton,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, useTheme, useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

import { requestsAPI } from '../../services/api';
import StatusChip from '../../components/common/StatusChip';
import FeatureUnavailableDialog from '../../components/common/FeatureUnavailableDialog';

export default function MyStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await requestsAPI.getMyAssignments();
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1,2,3].map(i => <Box key={i} sx={{ width: '100%', height: 100, bgcolor: 'action.hover', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            My Students 👨‍🎓
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            {students.length} students currently assigned to you.
          </Typography>
        </Box>
      </Box>

      {students.length === 0 ? (
        <Card sx={{ 
          p: 6, textAlign: 'center', borderRadius: '24px', 
          bgcolor: isDark ? 'rgba(16,35,68,0.5)' : 'rgba(255,255,255,0.5)',
          border: `2px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: 'none'
        }}>
          <Typography sx={{ fontSize: '4rem', mb: 2, opacity: 0.8 }}>📚</Typography>
          <Typography variant="h5" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, mb: 1, color: isDark ? '#fff' : '#172A4D' }}>
            No Students Assigned Yet
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, maxWidth: 400, mx: 'auto' }}>
            Once the 75 Way Project Task team assigns students to you, they'll appear here.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {students.map((student, index) => (
            <Grid item xs={12} md={6} lg={4} key={student._id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} style={{ height: '100%' }}>
                <Card sx={{ 
                  p: 3, borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column',
                  bgcolor: isDark ? '#102344' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                  boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.2)' : '0 8px 30px rgba(37,99,235,0.05)',
                  transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, bgcolor: isDark ? '#142B52' : '#E5EDFF', color: isDark ? '#FBBF00' : '#2563EB', fontSize: '1.5rem', fontWeight: 800 }}>
                        {student.parentName?.[0] || 'S'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Nunito", sans-serif', color: isDark ? '#fff' : '#172A4D', lineHeight: 1.2 }}>
                          {student.parentName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {student.city} • {student.mode}
                        </Typography>
                      </Box>
                    </Box>
                    <StatusChip status={student.status} />
                  </Box>

                  <Box sx={{ mb: 3, flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalLibraryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {student.subject} • {student.class}
                      </Typography>
                    </Box>

                  </Box>

                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => setSelectedStudent(student)}
                    startIcon={<VisibilityIcon />}
                    sx={{ borderRadius: '16px', fontWeight: 700, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: isDark ? '#fff' : '#172A4D' }}
                  >
                    View Student Details
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <Dialog 
            open={Boolean(selectedStudent)} 
            onClose={() => setSelectedStudent(null)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: { borderRadius: '24px', bgcolor: isDark ? '#102344' : '#fff', backgroundImage: 'none', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }
            }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2 }}>
              <Typography variant="h5" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800 }}>
                Student Details
              </Typography>
              <IconButton onClick={() => setSelectedStudent(null)} size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: '#3B82F6', fontSize: '1.8rem', fontWeight: 800 }}>
                  {selectedStudent.parentName?.[0] || 'S'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{selectedStudent.parentName}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Assigned: {new Date(selectedStudent.createdAt).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <StatusChip status={selectedStudent.status} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Class</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedStudent.class}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Subject</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedStudent.subject}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Location</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedStudent.locality}, {selectedStudent.city}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Mode</Typography>
                  <Chip label={selectedStudent.mode} size="small" variant="outlined" sx={{ fontWeight: 600, mt: 0.5 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Budget</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedStudent.budget || 'N/A'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>Notes</Typography>
                <Box sx={{ p: 2, borderRadius: '16px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    No specific notes have been added yet.
                  </Typography>
                </Box>
              </Box>

            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button fullWidth variant="contained" onClick={() => setSelectedStudent(null)} sx={{ borderRadius: '16px', py: 1.2, fontWeight: 700, bgcolor: '#3B82F6' }}>
                Close Details
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
}
