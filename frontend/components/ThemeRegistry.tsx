'use client'; // This must be a Client Component because MUI is client-side

/**
 * Theme Registry — MUI & Tailwind Interop
 *
 * This component wraps our app in the MUI ThemeProvider and Configures
 * global notifications (Toasts).
 * 
 * We use a custom dark theme that matches our Tailwind colors.
 */

import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Define our custom MUI theme
  // We use useState to avoid re-creating the theme object on every render
  const [theme] = useState(() =>
    createTheme({
      palette: {
        mode: 'dark',
        // Our primary action color (Tailwind Teal 500)
        primary: {
          main: '#14b8a6', 
          contrastText: '#ffffff',
        },
        // Backgrounds matching Tailwind Slate 800/900
        background: {
          default: '#0f172a',
          paper: '#1e293b',
        },
        // We redefine standard colours for "sentiment" badges to be vibrant
        success: { main: '#10b981' }, // Emerald 500 (Positive)
        info: { main: '#3b82f6' },    // Blue 500 (Neutral)
        warning: { main: '#f59e0b' }, // Amber 500
        error: { main: '#ef4444' },   // Red 500 (Negative)
      },
      typography: {
        // Tell MUI to use our Next.js Inter font variable
        fontFamily: 'var(--font-inter), sans-serif',
        button: {
          textTransform: 'none', // Don't ALL CAPS buttons (modern look)
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 8, // Softer corners for inputs, cards, dialogs
      },
      components: {
        // Global overrides for specific components to look "cleaner"
        MuiButton: {
          styleOverrides: {
            root: {
              boxShadow: 'none', // Flat design is currently trendier than material shadow
              '&:hover': {
                boxShadow: 'none',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none', // Remove the default "elevation" gradient in MUI dark mode
            },
          },
        },
      },
    })
  );

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline guarantees standard HTML elements match the theme initially */}
      <CssBaseline />
      
      {/* 
        Toaster provides floating success/error notifications at the top right.
        We style the Toast boxes slightly transparent (glassmorphism) for a premium feel.
      */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1e293b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1e293b',
            },
          },
        }} 
      />
      
      {/* Render the rest of the app */}
      {children}
    </ThemeProvider>
  );
}
