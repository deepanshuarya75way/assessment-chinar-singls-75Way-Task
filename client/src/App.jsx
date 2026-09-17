import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import { AppThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TeacherApplicationProvider } from './context/TeacherApplicationContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <TeacherApplicationProvider>
          <AppRouter />
        </TeacherApplicationProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}
