import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  Button,
  TextField,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PaletteIcon from "@mui/icons-material/Palette";
import SecurityIcon from "@mui/icons-material/Security";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

import { useColorMode } from "../../context/ThemeContext";
import { authAPI } from "../../services/api";
import FeatureUnavailableDialog from "../../components/common/FeatureUnavailableDialog";

const SETTING_TABS = [
  { id: "appearance", label: "Appearance", icon: PaletteIcon, available: true },
  { id: "security", label: "Security", icon: SecurityIcon, available: true },
];

export default function TeacherSettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance");
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    message: "",
    reason: "",
  });
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { mode, toggleColorMode } = useColorMode();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      4000,
    );
  };

  const handleTabClick = (tab) => {
    if (!tab.available) {
      setDialogState({
        open: true,
        reason: "FEATURE_NOT_IMPLEMENTED",
        title: "Coming Soon ✨",
        message: `The ${tab.label} settings are currently being integrated. Check back soon!`,
      });
      return;
    }
    setActiveTab(tab.id);
  };

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Fredoka", "Nunito", sans-serif',
            fontWeight: 800,
            color: isDark ? "#fff" : "#172A4D",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        >
          Settings ⚙️
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "text.secondary",
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 600,
          }}
        >
          Manage your portal preferences and security.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3.5} lg={3}>
          <Card
            sx={{
              borderRadius: "24px",
              bgcolor: isDark ? "#102344" : "#ffffff",
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.2)"
                : "0 8px 32px rgba(37,99,235,0.06)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"}`,
              overflow: "hidden",
              position: { md: "sticky" },
              top: { md: 90 },
            }}
          >
            <List
              sx={{
                p: 1.5,
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
                overflowX: { xs: "auto", md: "visible" },
                gap: 0.5,
              }}
            >
              {SETTING_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <ListItem
                    key={tab.id}
                    disablePadding
                    sx={{ width: { xs: "auto", md: "100%" } }}
                  >
                    <ListItemButton
                      onClick={() => handleTabClick(tab)}
                      sx={{
                        borderRadius: "16px",
                        py: 1.2,
                        px: 2,
                        minWidth: { xs: 140, md: "auto" },
                        bgcolor: active
                          ? isDark
                            ? "#142B52"
                            : "#F0F4FF"
                          : "transparent",
                        color: active
                          ? isDark
                            ? "#fff"
                            : "#172A4D"
                          : "text.secondary",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: isDark
                            ? active
                              ? "#142B52"
                              : "rgba(255,255,255,0.03)"
                            : active
                              ? "#F0F4FF"
                              : "#F8FAFC",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: active ? "#2563EB" : "text.secondary",
                        }}
                      >
                        <tab.icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={tab.label}
                        primaryTypographyProps={{
                          fontFamily: '"Nunito", sans-serif',
                          fontWeight: active ? 800 : 600,
                          fontSize: "0.9rem",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={8.5} lg={9}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "appearance" && (
                <AppearanceSettings
                  mode={mode}
                  toggleColorMode={toggleColorMode}
                />
              )}
              {activeTab === "security" && (
                <SecuritySettings showToast={showToast} />
              )}
            </motion.div>
          </AnimatePresence>
        </Grid>
      </Grid>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: 32,
              right: 32,
              zIndex: 9999,
              background:
                toast.type === "success"
                  ? isDark
                    ? "#16A765"
                    : "#1FAA59"
                  : "#F87171",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircleIcon />
            ) : (
              <ErrorOutlineIcon />
            )}
            <Typography
              sx={{ fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}
            >
              {toast.message}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      <FeatureUnavailableDialog
        open={dialogState.open}
        onClose={() => setDialogState((prev) => ({ ...prev, open: false }))}
        title={dialogState.title}
        message={dialogState.message}
        reason={dialogState.reason}
      />
    </Box>
  );
}

const SettingCard = ({ title, children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 4 },
        mb: 3,
        borderRadius: "24px",
        bgcolor: isDark ? "#102344" : "#ffffff",
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.2)"
          : "0 8px 32px rgba(37,99,235,0.06)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"}`,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Fredoka", "Nunito", sans-serif',
          fontWeight: 700,
          mb: 3,
          color: isDark ? "#fff" : "#172A4D",
        }}
      >
        {title}
      </Typography>
      {children}
    </Card>
  );
};

const AppearanceSettings = ({ mode, toggleColorMode }) => {
  return (
    <SettingCard title="Theme Preferences">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Dark Mode
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Switch between light and dark themes
          </Typography>
        </Box>
        <Switch
          checked={mode === "dark"}
          onChange={toggleColorMode}
          color="primary"
        />
      </Box>
    </SettingCard>
  );
};

const SecuritySettings = ({ showToast }) => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (pwd.match(/[A-Z]/)) score += 25;
    if (pwd.match(/[0-9]/)) score += 25;
    if (pwd.match(/[^A-Za-z0-9]/)) score += 25;
    return score;
  };
  const strength = getStrength(passwords.new);

  const handleSave = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm)
      return showToast("Please fill all fields", "error");
    if (passwords.new !== passwords.confirm)
      return showToast("New passwords do not match", "error");
    if (strength < 50) return showToast("Password is too weak", "error");

    setLoading(true);
    try {
      await authAPI.updatePassword(passwords.current, passwords.new);
      showToast("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      showToast(err.message || "Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingCard title="Change Password">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type={showPwd.current ? "text" : "password"}
            label="Current Password"
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
            slotProps={{
              input: {
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
                    {showPwd.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type={showPwd.new ? "text" : "password"}
            label="New Password"
            value={passwords.new}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
            slotProps={{
              input: {
                endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPwd((p) => ({ ...p, new: !p.new }))}
                    edge="end"
                    aria-label={showPwd.new ? "Hide password" : "Show password"}
                  >
                    {showPwd.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              }
            }}
          />
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={strength}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                bgcolor: "rgba(0,0,0,0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor:
                    strength < 50
                      ? "#F87171"
                      : strength < 75
                        ? "#FBBF00"
                        : "#22C55E",
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", width: 40 }}
            >
              {strength < 50 ? "Weak" : strength < 75 ? "Fair" : "Strong"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type={showPwd.confirm ? "text" : "password"}
            label="Confirm Password"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
           slotProps={{
              input: {
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
                    {showPwd.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          }
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSave}
          sx={{
            borderRadius: "20px",
            px: 4,
            py: 1.2,
            fontWeight: 700,
            bgcolor: "#2563EB",
            color: "#fff",
          }}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </Box>
    </SettingCard>
  );
};
