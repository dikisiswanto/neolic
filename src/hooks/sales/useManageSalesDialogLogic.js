'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useVillages } from '@/hooks/villages/useVillages';
import { useBuyers } from '@/hooks/buyers/useBuyers';
import { useProducts } from '@/hooks/products/useProducts';
import useSalesDialogForm from '@/hooks/sales/useSalesDialogForm';
import { useSalesDataMutation } from '@/hooks/sales/useSalesDataMutation';
import { useInitialNames } from '@/hooks/sales/useInitialNames';
import { LoaderCircle } from 'lucide-react';

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

  const { initialVillageName, initialBuyerName, isInitialNamesLoading } = useInitialNames(
    mode,
    initialSalesData
  );

  const { mutateSalesData, isLoading: isSubmitting } = useSalesDataMutation();

  const [villageSearchTerm, setVillageSearchTerm] = useState('');
  const debouncedVillageSearchTerm = useDebounce(villageSearchTerm, 300);
  const [isVillageCommandDialogOpen, setIsVillageCommandDialogOpen] = useState(false);
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
  const villagesData = useMemo(() => {
    return villagesQueryData?.data || [];
  }, [villagesQueryData?.data]);
  const handleVillageSelect = useCallback(
    (id) => {
      setVillageId(id);
      setIsVillageCommandDialogOpen(false);
    },
    [setVillageId]
  );

  const [buyerSearchTerm, setBuyerSearchTerm] = useState('');
  const debouncedBuyerSearchTerm = useDebounce(buyerSearchTerm, 300);
  const [isBuyerCommandDialogOpen, setIsBuyerCommandDialogOpen] = useState(false);
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
  const buyersData = useMemo(() => {
    return buyersQueryData?.data || [];
  }, [buyersQueryData?.data]);
  const handleBuyerSelect = useCallback(
    (id) => {
      setBuyerId(id);
      setIsBuyerCommandDialogOpen(false);
    },
    [setBuyerId]
  );

  const {
    data: productsQueryData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts({});
  const productsData = useMemo(() => {
    return productsQueryData?.data || [];
  }, [productsQueryData?.data]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!validateForm()) {
        return;
      }

      const salesData = getSalesData();

      try {
        let newSalesData;
        if (mode === 'add') {
          newSalesData = await mutateSalesData({ mode: 'add', salesData });
          console.log('Sales data created successfully:', newSalesData);
        } else if (mode === 'edit' && initialSalesData) {
          newSalesData = await mutateSalesData({
            mode: 'edit',
            salesData,
            id: initialSalesData.id,
          });
          console.log('Sales data updated successfully:', newSalesData);
        }

        onOpenChange(false, newSalesData);
        onDialogClose();
        resetForm();
      } catch (error) {
        console.error(`Error submitting sales data (${mode} mode):`, error);
        if (typeof error === 'object' && error !== null && error.errors) {
          setFormErrors(error.errors);
        } else {
          setFormErrors((prevState) => {
            return {
              ...prevState,
              submission: `Failed to ${mode === 'edit' ? 'update' : 'create'} sales data.`,
            };
          });
        }
      }
    },
    [
      mode,
      initialSalesData,
      validateForm,
      getSalesData,
      mutateSalesData,
      onOpenChange,
      onDialogClose,
      resetForm,
      setFormErrors,
    ]
  );

  const handleDialogCloseButtonClick = useCallback(() => {
    onOpenChange(false);
    onDialogClose();
    resetForm();
  }, [onOpenChange, onDialogClose, resetForm]);

  useEffect(() => {
    if (mode === 'edit' && initialSalesData) {
      setTransactionDate(new Date(initialSalesData.purchased_at));
      setDomainURL(initialSalesData.domain_url);
      setProductId(initialSalesData.product_id);
      setBuyerId(initialSalesData.buyer_id);
      setVillageId(initialSalesData.village_id);
    } else if (mode === 'add' && open) {
      resetForm();
    }
  }, [
    mode,
    initialSalesData,
    resetForm,
    open,
    setBuyerId,
    setDomainURL,
    setProductId,
    setTransactionDate,
    setVillageId,
  ]);

  const getVillageButtonLabel = useCallback(() => {
    if (mode === 'edit') {
      if (isInitialNamesLoading) {
        return (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            Memuat Desa...
          </>
        );
      }
      if (villageId && villagesData && villagesData?.length && !isVillagesLoading) {
        const selectedVillage = villagesData.find((v) => {
          return v.id === villageId;
        });
        if (selectedVillage) {
          return `${selectedVillage.name}, Kec. ${selectedVillage.district?.name}, ${selectedVillage.district?.regency?.name}`;
        }
      }
      return initialVillageName ? `${initialVillageName}` : 'Pilih Desa';
    }
    if (!villageId) {
      return 'Pilih Desa';
    }
    if (villagesData && villagesData?.length && !isVillagesLoading) {
      const selectedVillage = villagesData.find((v) => {
        return v.id === villageId;
      });
      if (selectedVillage) {
        return `${selectedVillage.name}, Kec. ${selectedVillage.district?.name}, ${selectedVillage.district?.regency?.name}`;
      }
    }
    if (villagesError) {
      return 'Gagal memuat Desa';
    }
    return 'Pilih Desa';
  }, [
    mode,
    isInitialNamesLoading,
    villageId,
    villagesData,
    isVillagesLoading,
    villagesError,
    initialVillageName,
  ]);

  const getBuyerButtonLabel = useCallback(() => {
    if (mode === 'edit') {
      if (isInitialNamesLoading) {
        return (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            Memuat Pembeli...
          </>
        );
      }
      if (buyerId && buyersData && buyersData?.length && !isBuyersLoading) {
        const selectedBuyer = buyersData.find((b) => {
          return b.id === buyerId;
        });
        if (selectedBuyer) {
          return `${selectedBuyer.full_name}`;
        }
      }
      return initialBuyerName ? initialBuyerName : 'Pilih Pembeli';
    }
    if (!buyerId) {
      return 'Pilih Pembeli';
    }
    if (buyersData && buyersData?.length && !isBuyersLoading) {
      const selectedBuyer = buyersData.find((b) => {
        return b.id === buyerId;
      });
      if (selectedBuyer) {
        return `${selectedBuyer.full_name}`;
      }
    }
    if (buyersError) {
      return 'Gagal memuat Pembeli';
    }
    return 'Pilih Pembeli';
  }, [
    mode,
    isInitialNamesLoading,
    buyerId,
    buyersData,
    isBuyersLoading,
    buyersError,
    initialBuyerName,
  ]);

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
    dialogTitle: mode === 'edit' ? 'Edit Data Penjualan' : 'Tambah Data Penjualan Baru',
    dialogDescription:
      mode === 'edit'
        ? 'Edit formulir berikut untuk memperbarui data penjualan.'
        : 'Isi formulir berikut untuk menambahkan data penjualan.',
    mode,
    getVillageButtonLabel,
    getBuyerButtonLabel,
    isSubmitting,
  };
};

export default useManageSalesDialogLogic;
