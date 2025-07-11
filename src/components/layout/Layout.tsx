import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../nav/Navbar';
import Footer from '../footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {!isLoginPage && <Navbar />}
      <main className={`${!isLoginPage ? 'pt-0' : ''} animate-fade-in`}>
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default Layout;
