"use client";

import { App } from "../app";
import SalesTable from "@/components/sales/SalesTable";
import ManageSalesDialog from "@/components/sales/ManageSalesDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function SalesPage() {
  const [isDialogOpenForAdd, setIsDialogOpenForAdd] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [initialSalesData, setInitialSalesData] = useState(null);
  const [refreshSalesTable, setRefreshSalesTable] = useState(false);

  const handleEditClick = useCallback((sale) => {
    setInitialSalesData(sale);
    setIsEditDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpenForAdd(false);
    setIsEditDialogOpen(false);
    setRefreshSalesTable((prev) => !prev);
  }, []);

  const handleDialogAddOpenChange = useCallback(
    (newOpenState, submittedSalesData) => {
      setIsDialogOpenForAdd(newOpenState);
      if (!newOpenState && submittedSalesData) {
        console.log("Data penjualan baru disubmit:", submittedSalesData);
        setRefreshSalesTable((prev) => !prev);
      }
    },
    []
  );

  const handleDialogEditOpenChange = useCallback(
    (newOpenState, submittedSalesData) => {
      setIsEditDialogOpen(newOpenState);
      if (!newOpenState && submittedSalesData) {
        console.log("Data penjualan diupdate:", submittedSalesData);
        setRefreshSalesTable((prev) => !prev);
      }
    },
    []
  );

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
        <h1 className="text-2xl font-bold mb-4">Data Penjualan</h1>
        <Button onClick={() => setIsDialogOpenForAdd(true)}>
          + Tambah Data Penjualan
        </Button>
      </div>

      <ManageSalesDialog
        open={isDialogOpenForAdd}
        onOpenChange={handleDialogAddOpenChange}
        mode="add"
        onDialogClose={handleDialogClose}
      />

      <ManageSalesDialog
        open={isEditDialogOpen}
        onOpenChange={handleDialogEditOpenChange}
        mode="edit"
        initialSalesData={initialSalesData}
        onDialogClose={handleDialogClose}
      />

      <SalesTable
        onEditClick={handleEditClick}
        refreshTrigger={refreshSalesTable}
      />
    </App>
  );
}
