"use client";

import { App } from "../app";
import { motion } from "framer-motion";
import SalesTable from "@/components/SalesTable";

export default function PurchasePage() {
  return (
    <App>
      <div className="py-5">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold"
        >
          Data Penjualan
        </motion.h1>
      </div>
      <SalesTable />
    </App>
  );
}
