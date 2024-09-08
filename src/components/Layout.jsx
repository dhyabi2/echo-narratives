import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Mic, Bell, User } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Mic, label: 'Record', path: '/record' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Echoes</h1>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="lg" className="p-2">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-4 text-xl font-medium"
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
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <ul className="flex justify-around items-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex flex-col items-center p-2 ${
                    location.pathname === item.path ? 'text-blue-500' : 'text-gray-600'
                  }`}
                >
                  <item.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{item.label}</span>
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