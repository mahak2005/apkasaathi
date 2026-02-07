import { ReactNode } from 'react';
import { Navbar } from './navbar';
import Footer from './Footer';
interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16" style={{ paddingTop: 'var(--navbar-height, 4rem)' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

