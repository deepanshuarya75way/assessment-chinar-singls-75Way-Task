import React, { createContext, useContext, useState, useEffect } from 'react';

const TeacherApplicationContext = createContext();

export const useTeacherApplication = () => useContext(TeacherApplicationContext);

export function TeacherApplicationProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('intent') === 'teacher_application') {
      setIsOpen(true);
      // Clean up URL without triggering a reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const openTeacherApplication = () => setIsOpen(true);
  const closeTeacherApplication = () => setIsOpen(false);

  return (
    <TeacherApplicationContext.Provider value={{ isOpen, openTeacherApplication, closeTeacherApplication }}>
      {children}
    </TeacherApplicationContext.Provider>
  );
}
