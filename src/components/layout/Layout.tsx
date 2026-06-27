import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FeedbackForm from '../feedback/FeedbackForm';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <FeedbackForm />
      <Footer />
    </div>
  );
}
