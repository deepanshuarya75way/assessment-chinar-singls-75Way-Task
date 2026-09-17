import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const getReasonConfig = (reason) => {
  switch (reason) {
    case 'FEATURE_NOT_IMPLEMENTED':
      return {
        icon: '✨',
        defaultTitle: 'Coming Soon ✨',
        defaultMessage: "This feature hasn't been added to 75 Way Project Task yet. We're working on it."
      };
    case 'FEATURE_DISABLED':
      return {
        icon: '🔧',
        defaultTitle: 'Feature Currently Unavailable',
        defaultMessage: 'This feature is temporarily unavailable. Please try again later.'
      };
    case 'NO_DATA':
      return {
        icon: '📭',
        defaultTitle: 'Nothing to Show Yet',
        defaultMessage: "There isn't any information available for this action yet."
      };
    case 'MISSING_INFORMATION':
      return {
        icon: '📝',
        defaultTitle: 'More Information Needed',
        defaultMessage: "This action can't be completed because the required information is missing."
      };
    case 'PERMISSION_DENIED':
      return {
        icon: '🔒',
        defaultTitle: 'Access Restricted 🔒',
        defaultMessage: "You don't have permission to perform this action."
      };
    case 'CONFIGURATION_MISSING':
      return {
        icon: '⚙️',
        defaultTitle: 'Feature Not Configured',
        defaultMessage: "This feature hasn't been configured for this 75 Way Project Task environment yet."
      };
    case 'BACKEND_UNAVAILABLE':
      return {
        icon: '🔌',
        defaultTitle: "Couldn't Complete That",
        defaultMessage: "75 Way Project Task couldn't connect to the service required for this action. Please try again."
      };
    default:
      return {
        icon: '🚀',
        defaultTitle: 'Feature Not Available',
        defaultMessage: 'This feature is not available.'
      };
  }
};

export default function FeatureUnavailableDialog({
  open,
  onClose,
  title,
  message,
  reason = 'FEATURE_NOT_IMPLEMENTED',
  icon,
  primaryActionLabel = 'Got it',
  onPrimaryAction,
}) {
  const config = getReasonConfig(reason);
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;
  const displayIcon = icon || config.icon;

  const handlePrimary = () => {
    if (onPrimaryAction) onPrimaryAction();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              boxShadow: (theme) => theme.palette.mode === 'light' 
                ? '0 12px 40px rgba(23, 42, 77, 0.1)'
                : '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(59, 130, 246, 0.05)',
              border: (theme) => `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : 'rgba(148,163,184,0.15)'}`,
              overflow: 'hidden',
            }
          }}
        >
          <Box sx={{ position: 'relative', p: 3, textAlign: 'center' }}>
            <IconButton
              onClick={onClose}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}
              aria-label="Close dialog"
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Typography sx={{ fontSize: '3.5rem', mb: 2, lineHeight: 1 }}>
              {displayIcon}
            </Typography>

            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 1.5, fontFamily: '"Fredoka", "Nunito", sans-serif' }}>
              {displayTitle}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6, px: 1 }}>
              {displayMessage}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              onClick={handlePrimary}
              sx={{ 
                borderRadius: 20, 
                py: 1.2, 
                fontWeight: 700,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              {primaryActionLabel}
            </Button>
          </Box>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
