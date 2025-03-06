import { NextResponse } from 'next/server';
import {
  getDashboardData,
  getMonthlySalesData,
  getSalesPerProvinceData,
} from '@/lib/queries/stats';

export async function GET() {
  try {
    const [dashboardData, monthlySalesData, salesPerProvinceData] = await Promise.all([
      getDashboardData(),
      getMonthlySalesData(),
      getSalesPerProvinceData(),
    ]);

    return NextResponse.json({
      ...dashboardData,
      monthlySalesData,
      salesPerProvinceData,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
