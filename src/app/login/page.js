'use client';

import { useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

function LoginPageComponent() {
  const { login, loading } = useAuth();
  const { data: _, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="text-lg font-medium text-gray-700"
        >
          Checking session...
        </motion.p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    login(formData.get('username'), formData.get('password'));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 px-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="username" type="text" placeholder="Username" required />
          <Input type="password" name="password" placeholder="Password" required />
          <Button type="submit" className="w-full" disabled={loading} aria-live="polite">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-200 px-3">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      }
    >
      <LoginPageComponent />
    </Suspense>
  );
}
