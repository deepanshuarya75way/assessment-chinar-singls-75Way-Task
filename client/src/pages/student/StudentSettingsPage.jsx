import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Switch,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SecurityIcon from "@mui/icons-material/Security";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockResetIcon from "@mui/icons-material/LockReset";

// --- CUSTOM SWITCH ---
const TutorSwitch = styled(Switch)(({ theme }) => ({
  width: 52,
  height: 30,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 30,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(18px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#2563EB",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 26,
    height: 26,
    borderRadius: 13,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 30 / 2,
    opacity: 1,
    backgroundColor: "#CBD5E1",
    boxSizing: "border-box",
    transition: theme.transitions.create(["background-color"], {
      duration: 200,
    }),
  },
}));

import { useColorMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function StudentSettingsPage() {
  const { mode, toggleColorMode } = useColorMode();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handlePassChange = (e) =>
    setPassData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passData.newPassword !== passData.confirmPassword) {
      return setError("New passwords do not match");
    }

    setLoading(true);
    try {
      await authAPI.updatePassword(
        passData.currentPassword,
        passData.newPassword,
      );
      setSuccess("Password updated successfully!");
      setPassData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    // In a real app, call API to delete account
    setDeleteDialogOpen(false);
    logout();
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* 🌟 HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "16px",
            bgcolor: "rgba(107, 114, 128, 0.1)",
            color: "#6B7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SettingsIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Fredoka", sans-serif',
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Settings
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Preferences, security, and account management
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {/* APPEARANCE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                mb: 4,
                bgcolor: mode === "dark" ? "#102A52" : "#FFFFFF",
                border: `2px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
                boxShadow:
                  mode === "dark" ? "none" : "0 10px 30px rgba(0,0,0,0.03)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid",
                  borderColor:
                    mode === "dark" ? "rgba(255,255,255,0.05)" : "divider",
                  bgcolor: mode === "dark" ? "#081426" : "#FFFFFF",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Fredoka", sans-serif',
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: mode === "dark" ? "#F8FAFC" : "text.primary",
                  }}
                >
                  {mode === "dark" ? (
                    <DarkModeIcon sx={{ color: "#FBBF00" }} />
                  ) : (
                    <LightModeIcon sx={{ color: "#FBBF00" }} />
                  )}
                  Appearance
                </Typography>
              </Box>

              <Box
                onClick={toggleColorMode}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor:
                      mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(37, 99, 235, 0.02)",
                    "& .theme-icon": {
                      transform: "scale(1.1) rotate(5deg)",
                    },
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    className="theme-icon"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      bgcolor:
                        mode === "dark"
                          ? "rgba(59, 130, 246, 0.15)"
                          : "#EFF6FF",
                      color: mode === "dark" ? "#60A5FA" : "#3B82F6",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {mode === "dark" ? (
                        <motion.div
                          key="dark"
                          initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <DarkModeIcon />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="light"
                          initial={{ scale: 0.5, rotate: 90, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0.5, rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <LightModeIcon />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: mode === "dark" ? "#F8FAFC" : "text.primary",
                        fontFamily: '"Nunito", sans-serif',
                        mb: 0.2,
                      }}
                    >
                      Dark Mode
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: mode === "dark" ? "#A9B9D1" : "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      Toggle dark theme
                    </Typography>
                  </Box>
                </Box>

                <TutorSwitch
                  checked={mode === "dark"}
                  onChange={toggleColorMode}
                  inputProps={{ "aria-label": "Toggle dark mode" }}
                  onClick={(e) => e.stopPropagation()} // Prevent double trigger
                />
              </Box>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* SECURITY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                mb: 4,
                bgcolor: mode === "dark" ? "#102344" : "#FFFFFF",
                border: `2px solid ${mode === "dark" ? "rgba(96,165,250,0.1)" : "#E2E8F0"}`,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  bgcolor: mode === "dark" ? "#0B1830" : "#F9FAFB",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Fredoka", sans-serif',
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SecurityIcon /> Security
                </Typography>
              </Box>

              <Box
                component="form"
                onSubmit={handlePasswordSubmit}
                sx={{ p: 3 }}
              >
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  type={showPwd.current ? "text" : "password"}
                  label="Current Password"
                  name="currentPassword"
                  value={passData.currentPassword}
                  onChange={handlePassChange}
                  required
                  sx={{ mb: 2 }}
                  slotProps={{
                  input: {
                    sx: { borderRadius: "12px" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPwd((p) => ({ ...p, current: !p.current }))
                          }
                          edge="end"
                          aria-label={
                            showPwd.current ? "Hide password" : "Show password"
                          }
                        >
                          {showPwd.current ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                  }}
                />
                <TextField
                  fullWidth
                  type={showPwd.new ? "text" : "password"}
                  label="New Password"
                  name="newPassword"
                  value={passData.newPassword}
                  onChange={handlePassChange}
                  required
                  sx={{ mb: 2 }}
                  slotProps={{
                  input: {
                    sx: { borderRadius: "12px" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPwd((p) => ({ ...p, new: !p.new }))
                          }
                          edge="end"
                          aria-label={
                            showPwd.new ? "Hide password" : "Show password"
                          }
                        >
                          {showPwd.new ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                  }}
                />
                <TextField
                  fullWidth
                  type={showPwd.confirm ? "text" : "password"}
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passData.confirmPassword}
                  onChange={handlePassChange}
                  required
                  sx={{ mb: 3 }}
                  slotProps={{
                  input: {
                    sx: { borderRadius: "12px" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPwd((p) => ({ ...p, confirm: !p.confirm }))
                          }
                          edge="end"
                          aria-label={
                            showPwd.confirm ? "Hide password" : "Show password"
                          }
                        >
                          {showPwd.confirm ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <LockResetIcon />
                  }
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
                    fontWeight: 700,
                    bgcolor: "#3B82F6",
                    "&:hover": { bgcolor: "#2563EB" },
                  }}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </Box>
            </Card>
          </motion.div>

          {/* DANGER ZONE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                bgcolor:
                  mode === "dark" ? "rgba(239, 68, 68, 0.05)" : "#FEF2F2",
                border: `2px solid ${mode === "dark" ? "rgba(239, 68, 68, 0.2)" : "#FECACA"}`,
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "error.main",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <DeleteForeverIcon /> Danger Zone
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 3 }}
                >
                  Once you delete your account, there is no going back. Please
                  be certain.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
                    fontWeight: 700,
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 },
                  }}
                >
                  Delete Account
                </Button>
              </Box>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle
          sx={{
            color: "error.main",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DeleteForeverIcon /> Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you absolutely sure you want to delete your account? This action
            cannot be undone and will permanently delete your profile, requests,
            and all associated data.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            sx={{ borderRadius: "8px", fontWeight: 700 }}
          >
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
