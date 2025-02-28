"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Dasbor", path: "/dashboard" },
  { label: "Penjualan", path: "/sales" },
  { label: "Master Tema", path: "/themes" },
  { label: "Data Pembeli", path: "/buyers" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-stone-900 text-white shadow-md border-b-2 border-stone-700 px-4">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-widest uppercase">Neolic</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4">
          {menuItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "text-base font-medium transition-colors px-4 py-2 rounded-lg",
                  pathname === item.path
                    ? "bg-stone-700 text-white"
                    : "hover:bg-stone-700 hover:text-white hover:cursor-pointer"
                )}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </Button>
            </motion.div>
          ))}
        </nav>

        {/* Logout Button (Hidden on Small Screens) */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="destructive"
            className="hidden md:block rounded-lg cursor-pointer"
            onClick={() => router.push("/logout")}
          >
            Keluar
          </Button>
        </motion.div>

        {/* Hamburger Button (Mobile) */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col gap-3 bg-stone-800 py-4 px-6"
          >
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "text-base font-medium w-full text-left",
                  pathname === item.path
                    ? "bg-stone-700 text-white"
                    : "hover:bg-stone-700 hover:text-white hover:cursor-pointer"
                )}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* Logout Button (Mobile) */}
            <Button
              variant="destructive"
              className="text-base w-full cursor-pointer"
              onClick={() => {
                router.push("/logout");
                setIsOpen(false);
              }}
            >
              Keluar
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
