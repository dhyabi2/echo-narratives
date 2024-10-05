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
    const requestPermissions = async () => {
      if ('serviceWorker' in navigator && 'Notification' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          
          // Request notification permission
          const notificationPermission = await Notification.requestPermission();
          
          if (notificationPermission === 'granted') {
            const microphonePermission = await navigator.permissions.query({ name: 'microphone' });
            
            if (microphonePermission.state === 'granted') {
              toast.success('تم منح إذن الميكروفون');
            } else if (microphonePermission.state === 'prompt') {
              await navigator.mediaDevices.getUserMedia({ audio: true });
              toast.success('تم منح إذن الميكروفون');
            } else {
              showMicrophonePermissionNotification(registration);
            }
          } else {
            toast.error('لم يتم منح إذن الإشعارات. بعض الميزات قد لا تعمل بشكل صحيح.');
          }
        } catch (error) {
          console.error('خطأ في طلب الأذونات:', error);
          toast.error('حدث خطأ أثناء طلب الأذونات. يرجى المحاولة مرة أخرى.');
        }
      } else {
        console.warn('Service Worker or Notification API not supported');
      }
    };

    const showMicrophonePermissionNotification = (registration) => {
      if (Notification.permission === 'granted') {
        registration.showNotification('مطلوب إذن الميكروفون', {
          body: 'انقر هنا لفتح الإعدادات وتمكين الوصول إلى الميكروفون.',
          icon: '/icon-192x192.png',
          tag: 'microphone-permission',
          data: { url: 'app-settings:' }
        });
      } else {
        toast.error('لم يتم منح إذن الإشعارات. لا يمكن عرض إشعار إذن الميكروفون.');
      }
    };

    requestPermissions();
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