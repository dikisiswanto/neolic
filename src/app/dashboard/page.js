"use client";

import { useStats } from "@/hooks/useStats";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { App } from "../app";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data, isLoading } = useStats();
  const router = useRouter();

  const stats = [
    {
      bgColor: "bg-emerald-500 text-white",
      title: "Penjualan Bulan Ini",
      value: data?.currentMonthPurchase ?? 0,
    },
    {
      bgColor: "bg-amber-400 text-white",
      title: "Total Penjualan",
      value: data?.totalPurchase ?? 0,
    },
    {
      bgColor: "bg-rose-400 text-white",
      title: "Total Pembeli",
      value: data?.totalBuyers ?? 0,
    },
    {
      bgColor: "bg-sky-400 text-white",
      title: "Total Produk",
      value: data?.totalProducts ?? 0,
    },
  ];

  return (
    <App>
      <div className="py-5">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-4"
        >
          Dashboard
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => router.push("/sales")}
            className="mb-4 flex items-center gap-2 transition-transform cursor-pointer"
          >
            <Edit size={16} />
            Tambahkan Data Baru
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-3">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Skeleton className="h-32 w-full" />
                  </motion.div>
                ))
            : stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className={cn("shadow", stat.bgColor)}>
                    <CardHeader className="text-sm md:text-lg font-medium">
                      {stat.title}
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">
                      {stat.value}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </App>
  );
}
