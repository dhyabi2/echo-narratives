import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Mic, Bell, Car } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useTranslation } from 'react-i18next';
import { useCountry } from '../contexts/CountryContext';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { country, setCountry } = useCountry();

  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: Mic, label: 'تسجيل', path: '/record' },
    { icon: Bell, label: 'الإشعارات', path: '/notifications' },
    { icon: Car, label: 'وضع السيارة', path: '/car-mode' },
  ];

  const countries = [
    { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦' },
    { code: 'AE', name: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
    { code: 'OM', name: 'عمان', flag: '🇴🇲' },
    { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
    { code: 'QA', name: 'قطر', flag: '🇶🇦' },
    { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
    { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
    { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
  ];

  const handleCountryChange = (countryCode) => {
    setCountry(countryCode);
    navigate('/');
    setIsOpen(false);
  };

  if (location.pathname === '/car-mode') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">مرحبًا بك في إيكوز</h1>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-4 text-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                {countries.map((c) => (
                  <Button
                    key={c.code}
                    variant="ghost"
                    className="flex items-center space-x-4 text-xl justify-start"
                    onClick={() => handleCountryChange(c.code)}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 mb-16">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-2">
          <ul className="flex justify-around items-center">
            {navItems.map((item) => (
              <li key={item.path} className="flex-1">
                <Link 
                  to={item.path} 
                  className={`flex flex-col items-center py-2 ${
                    item.label === 'تسجيل' ? 'bg-blue-500 text-white rounded-full -mt-6' : ''
                  }`}
                >
                  <item.icon className={`h-6 w-6 ${item.label === 'تسجيل' ? 'mb-1' : ''}`} />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
