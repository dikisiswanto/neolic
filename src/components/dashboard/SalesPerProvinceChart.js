'use client';

import * as React from 'react';
import { cn, generateHSLColor } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function SalesPerProvinceChart({ className, data }) {
  const totalSales = React.useMemo(() => {
    return data.reduce((acc, curr) => {
      return acc + curr.sales_count;
    }, 0);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card className={cn('flex flex-col', className)}>
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

  const chartConfig = {
    province_name: {
      label: 'Provinsi',
    },
    sales_count: {
      label: 'Jumlah Penjualan',
    },
  };

  const chartColors = data.map((_, index) => {
    return generateHSLColor(index, data.length);
  });

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Statistik Penjualan per Provinsi</CardTitle>
        <CardDescription>Data penjualan berdasarkan provinsi</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={350} height={350}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie
                data={data}
                dataKey="sales_count"
                nameKey="province_name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
              >
                {data.map((entry, index) => {
                  return (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  );
                })}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalSales.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Penjualan
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
