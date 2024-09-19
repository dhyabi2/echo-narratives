import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Layout from "./components/Layout";
import CarNavigationMode from "./components/CarNavigationMode";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { CountryProvider } from './contexts/CountryContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' });
        if (result.state === 'granted') {
          toast.success('Microphone permission granted');
        } else if (result.state === 'prompt') {
          // Request permission
          await navigator.mediaDevices.getUserMedia({ audio: true });
          toast.success('Microphone permission granted');
        } else if (result.state === 'denied') {
          // Check if it's an Android device
          const isAndroid = /Android/i.test(navigator.userAgent);
          if (isAndroid && 'Notification' in window) {
            // Create a notification for Android
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification('Microphone Permission Required', {
                  body: 'Click here to open settings and enable microphone access.',
                  icon: '/icon-192x192.png'
                }).onclick = function() {
                  // This will attempt to open Android settings
                  window.open('app-settings:');
                };
              }
            });
          }
          toast.error('Microphone permission denied. Please enable it in your browser settings.');
        }
      } catch (error) {
        console.error('Error requesting microphone permission:', error);
        toast.error('Error requesting microphone permission. Please try again.');
      }
    };

    requestMicrophonePermission();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <CountryProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  {navItems.map(({ to, page }) => (
                    <Route key={to} path={to} element={page} />
                  ))}
                  <Route path="/car-mode" element={<CarNavigationMode />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </CountryProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;
