// hooks/sales/useManageSalesDialogLogic.js
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useVillages } from "@/hooks/villages/useVillages";
import { useBuyers } from "@/hooks/buyers/useBuyers";
import { useProducts } from "@/hooks/products/useProducts";
import useSalesDialogForm from "@/hooks/sales/useSalesDialogForm";
import { useInitialNames } from "@/hooks/sales/useInitialNames";
import { LoaderCircle } from "lucide-react";

const useManageSalesDialogLogic = ({
  open,
  mode,
  initialSalesData,
  onOpenChange,
  onDialogClose,
}) => {
  const {
    transactionDate,
    setTransactionDate,
    domainURL,
    setDomainURL,
    villageId,
    setVillageId,
    productId,
    setProductId,
    buyerId,
    setBuyerId,
    formErrors,
    setFormErrors,
    resetForm,
    validateForm,
    getSalesData,
  } = useSalesDialogForm();

  const { initialVillageName, initialBuyerName, isInitialNamesLoading } =
    useInitialNames(mode, initialSalesData);

  const [villageSearchTerm, setVillageSearchTerm] = useState("");
  const debouncedVillageSearchTerm = useDebounce(villageSearchTerm, 300);
  const [isVillageCommandDialogOpen, setIsVillageCommandDialogOpen] =
    useState(false);
  const villageSearchInputRef = useRef(null);
  const {
    data: villagesQueryData,
    isLoading: isVillagesLoading,
    error: villagesError,
  } = useVillages(
    open
      ? {
          page: 1,
          pageSize: 20,
          search: debouncedVillageSearchTerm,
        }
      : { isFetch: false }
  );
  const villagesData = villagesQueryData?.data || [];
  const handleVillageSelect = useCallback(
    (id) => {
      setVillageId(id);
      setIsVillageCommandDialogOpen(false);
    },
    [setVillageId]
  );

  const [buyerSearchTerm, setBuyerSearchTerm] = useState("");
  const debouncedBuyerSearchTerm = useDebounce(buyerSearchTerm, 300);
  const [isBuyerCommandDialogOpen, setIsBuyerCommandDialogOpen] =
    useState(false);
  const buyerSearchInputRef = useRef(null);
  const {
    data: buyersQueryData,
    isLoading: isBuyersLoading,
    error: buyersError,
  } = useBuyers(
    open
      ? {
          page: 1,
          pageSize: 20,
          search: debouncedBuyerSearchTerm,
        }
      : { isFetch: false }
  );
  const buyersData = buyersQueryData?.data || [];
  const handleBuyerSelect = useCallback(
    (id) => {
      setBuyerId(id);
      setIsBuyerCommandDialogOpen(false);
    },
    [setBuyerId]
  );

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts({});

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const salesData = getSalesData();

    if (mode === "add") {
      console.log("Menambahkan data penjualan:", salesData);
    } else if (mode === "edit" && initialSalesData) {
      console.log(
        "Mengedit data penjualan:",
        salesData,
        "ID:",
        initialSalesData.id
      );
    }

    onOpenChange(false, salesData);
    onDialogClose();
  };

  const handleDialogCloseButtonClick = () => {
    onOpenChange(false);
    onDialogClose();
  };

  useEffect(() => {
    if (mode === "edit" && initialSalesData) {
      setTransactionDate(new Date(initialSalesData.purchased_at));
      setDomainURL(initialSalesData.domain_url);
      setProductId(initialSalesData.product_id);
      setBuyerId(initialSalesData.buyer_id);
      setVillageId(initialSalesData.village_id);
    } else if (mode === "add" && open) {
      resetForm();
    }
  }, [mode, initialSalesData, resetForm, open]);

  return {
    transactionDate,
    setTransactionDate,
    domainURL,
    setDomainURL,
    villageId,
    setVillageId,
    productId,
    setProductId,
    buyerId,
    setBuyerId,
    formErrors,
    setFormErrors,
    resetForm,
    validateForm,
    getSalesData,
    initialVillageName,
    initialBuyerName,
    isInitialNamesLoading,
    villageSearchTerm,
    setVillageSearchTerm,
    isVillageCommandDialogOpen,
    setIsVillageCommandDialogOpen,
    villagesData,
    isVillagesLoading,
    villagesError,
    handleVillageSelect,
    villageSearchInputRef,
    buyerSearchTerm,
    setBuyerSearchTerm,
    isBuyerCommandDialogOpen,
    setIsBuyerCommandDialogOpen,
    buyersData,
    isBuyersLoading,
    buyersError,
    handleBuyerSelect,
    buyerSearchInputRef,
    productsData,
    isProductsLoading,
    productsError,
    handleSubmit,
    handleDialogCloseButtonClick,
    dialogTitle:
      mode === "edit" ? "Edit Data Penjualan" : "Tambah Data Penjualan Baru",
    dialogDescription:
      mode === "edit"
        ? "Edit formulir berikut untuk memperbarui data penjualan."
        : "Isi formulir berikut untuk menambahkan data penjualan.",
    mode,
    getVillageButtonLabel: () => {
      if (mode === "edit") {
        if (isInitialNamesLoading) {
          return (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
              Memuat Desa...
            </>
          );
        }
        if (
          villageId &&
          villagesData &&
          villagesData?.length &&
          !isVillagesLoading
        ) {
          const selectedVillage = villagesData.find((v) => v.id === villageId);
          if (selectedVillage) {
            return `${selectedVillage.name}, Kec. ${selectedVillage.district?.name}, ${selectedVillage.district?.regency?.name}`;
          }
        }
        return initialVillageName ? `${initialVillageName}` : "Pilih Desa";
      }
      if (!villageId) {
        return "Pilih Desa";
      }
      if (villagesData && villagesData?.length && !isVillagesLoading) {
        const selectedVillage = villagesData.find((v) => v.id === villageId);
        if (selectedVillage) {
          return `${selectedVillage.name}, Kec. ${selectedVillage.district?.name}, ${selectedVillage.district?.regency?.name}`;
        }
      }
      if (villagesError) {
        return "Gagal memuat Desa";
      }
      return "Pilih Desa";
    },
    getBuyerButtonLabel: () => {
      if (mode === "edit") {
        if (isInitialNamesLoading) {
          return (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
              Memuat Pembeli...
            </>
          );
        }
        if (buyerId && buyersData && buyersData?.length && !isBuyersLoading) {
          const selectedBuyer = buyersData.find((b) => b.id === buyerId);
          if (selectedBuyer) {
            return `${selectedBuyer.full_name}`;
          }
        }
        return initialBuyerName ? initialBuyerName : "Pilih Pembeli";
      }
      if (!buyerId) {
        return "Pilih Pembeli";
      }
      if (buyersData && buyersData?.length && !isBuyersLoading) {
        const selectedBuyer = buyersData.find((b) => b.id === buyerId);
        if (selectedBuyer) {
          return `${selectedBuyer.full_name}`;
        }
      }
      if (buyersError) {
        return "Gagal memuat Pembeli";
      }
      return "Pilih Pembeli";
    },
  };
};

export default useManageSalesDialogLogic;
