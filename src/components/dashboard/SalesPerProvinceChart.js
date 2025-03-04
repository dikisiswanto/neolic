"use client";

import { TrendingUp } from "lucide-react";
import { generateHSLColor } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function SalesPerProvinceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Statistik Penjualan per Provinsi</CardTitle>
          <CardDescription>Tidak ada data untuk ditampilkan</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <p className="text-center text-muted-foreground">
            Tidak ada data penjualan provinsi untuk ditampilkan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => a.sales_count - b.sales_count);

  const chartConfig = {
    sales_count: {
      label: "Jumlah Penjualan",
    },
  };

  const chartColors = data.map((_, index) =>
    generateHSLColor(index, data.length)
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Statistik Penjualan per Provinsi</CardTitle>
        <CardDescription>Data penjualan berdasarkan provinsi</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-h-[600px] pb-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="4 4" horizontal={false} />
              <XAxis
                type="number"
                dataKey="sales_count"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) => new Intl.NumberFormat().format(value)}
              />
              <YAxis
                type="category"
                dataKey="province_name"
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => new Intl.NumberFormat().format(value)}
              />
              <Bar
                dataKey="sales_count"
                barSize={20}
                fill={(entry, index) => chartColors[index]}
                name="Jumlah Penjualan"
                label={false}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
