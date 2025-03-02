"use client";

import { App } from "../app";
import SalesTable from "@/components/sales/SalesTable";
import AddSalesDialog from "@/components/sales/AddSalesDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PurchasePage() {
  return (
    <App>
      <div className="py-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Penjualan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold">Data Penjualan</h1>
      </div>
      <AddSalesDialog />
      <SalesTable />
    </App>
  );
}
