'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">Neolic</h1>
        <p className="text-gray-600 mt-2">Sistem Pencatatan Lisensi Tema</p>
        <Button
          className="mt-5 px-6 py-2"
          onClick={() => {
            return router.push('/login');
          }}
        >
          Menuju Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
