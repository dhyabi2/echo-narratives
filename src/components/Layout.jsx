import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Mic, Car } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import CountrySelector from './CountrySelector';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { icon: Home, label: t('Home'), path: '/' },
    { icon: Mic, label: t('Record'), path: '/record' },
    { icon: Car, label: t('Car Mode'), path: '/car-mode' },
  ];

  if (location.pathname === '/car-mode') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('Welcome to Echoes')}</h1>
          <div className="flex items-center space-x-4">
            <CountrySelector value={selectedCountry} onChange={setSelectedCountry} />
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
                </nav>
              </SheetContent>
            </Sheet>
          </div>
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
                    item.label === t('Record') ? 'bg-blue-500 text-white rounded-full -mt-6' : ''
                  }`}
                >
                  <item.icon className={`h-6 w-6 ${item.label === t('Record') ? 'mb-1' : ''}`} />
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