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

const queryClient = new QueryClient();

const App = () => {
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
