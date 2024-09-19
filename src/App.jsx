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
      if ('serviceWorker' in navigator && 'Notification' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const permission = await registration.pushManager.permissionState({ userVisibleOnly: true });
          
          if (permission === 'granted') {
            const result = await navigator.permissions.query({ name: 'microphone' });
            if (result.state === 'granted') {
              toast.success('تم منح إذن الميكروفون');
            } else if (result.state === 'prompt') {
              await navigator.mediaDevices.getUserMedia({ audio: true });
              toast.success('تم منح إذن الميكروفون');
            } else {
              showMicrophonePermissionNotification();
            }
          } else {
            await Notification.requestPermission();
            showMicrophonePermissionNotification();
          }
        } catch (error) {
          console.error('خطأ في طلب إذن الميكروفون:', error);
          toast.error('حدث خطأ أثناء طلب إذن الميكروفون. يرجى المحاولة مرة أخرى.');
        }
      } else {
        console.warn('Service Worker or Notification API not supported');
      }
    };

    const showMicrophonePermissionNotification = () => {
      if ('serviceWorker' in navigator && 'Notification' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('مطلوب إذن الميكروفون', {
            body: 'انقر هنا لفتح الإعدادات وتمكين الوصول إلى الميكروفون.',
            icon: '/icon-192x192.png',
            tag: 'microphone-permission',
            data: { url: 'app-settings:' }
          });
        });
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
