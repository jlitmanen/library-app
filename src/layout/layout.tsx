import React from 'react';
import Footer from './footer';
import Header from './header';
import ErrorBoundary from '../components/error';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <header>
        <Header />
      </header>
      <main className="content">
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      </main>
      <footer className="bg-dark py-3">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;