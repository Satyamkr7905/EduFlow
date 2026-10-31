import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { PageTransition } from '../components/ui/Motion';

export default function NotFound() {
  return (
    <PageTransition className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <Logo className="mb-10" />
      <p className="font-heading text-7xl font-semibold text-ink/10">404</p>
      <h1 className="mt-2 font-heading text-2xl font-semibold text-ink">This page wandered off.</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button icon={ArrowLeft}>Back to home</Button>
      </Link>
    </PageTransition>
  );
}
