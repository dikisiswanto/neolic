'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { getMonthName } from '@/lib/utils';

const colorPalette = [
  '#3498db', // Blue
  '#f39c12', // Orange
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#1abc9c', // Cyan
  '#9b59b6', // Purple
  '#f1c40f', // Yellow
  '#34495e', // Dark Blue Gray
  '#95a5a6', // Light Gray
  '#d35400', // Dark Orange
];

export function MonthlyBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistik Penjualan Bulanan</CardTitle>
          <CardDescription>Tidak ada data penjualan untuk ditampilkan.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const uniqueYears = [
    ...new Set(
      data.map((item) => {
        return item.sale_year;
      })
    ),
  ]
    .sort()
    .slice(-4);
  const dynamicChartConfig = {};
  uniqueYears.forEach((year, index) => {
    dynamicChartConfig[year] = {
      label: String(year),
      color: colorPalette[index % colorPalette.length],
    };
  });
  const chartConfig = dynamicChartConfig;

  const monthlyGroupedData = Array(12)
    .fill(null)
    .map((_, monthIndex) => {
      const monthName = getMonthName(monthIndex + 1).slice(0, 3);
      const monthData = { month: monthName };

      data.forEach((item) => {
        if (item.sale_month === monthIndex + 1) {
          monthData[item.sale_year] = item.sales_count;
        }
      });
      return monthData;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Penjualan Bulanan (Per Tahun)</CardTitle>
        <CardDescription>
          Grafik penjualan bulanan per tahun ({uniqueYears.join('-')}).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyGroupedData} barCategoryGap={15}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {Object.keys(chartConfig).map((year) => {
                return (
                  <Bar
                    key={year}
                    dataKey={year}
                    fill={chartConfig[year].color}
                    barSize={25}
                    name={chartConfig[year].label}
                    radius={[4, 4, 0, 0]}
                  />
                );
              })}
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
}
