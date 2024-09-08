import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Mic, Bell, Car } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Mic, label: 'Record', path: '/record' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Car, label: 'Car Mode', path: '/car-mode' },
  ];

  if (location.pathname === '/car-mode') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Echoes</h1>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-2 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
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
          <ul className="flex justify-around">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="flex flex-col items-center">
                  <item.icon className="h-6 w-6" />
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