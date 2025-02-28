import Navbar from "@/components/ui/navbar";
import { useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { startProgress, stopProgress } from "@/lib/progress";

export function App({ children }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startProgress();

    startTransition(() => {
      stopProgress();
    });
  }, [pathname]);
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <main className="container mx-auto px-3">{children}</main>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
