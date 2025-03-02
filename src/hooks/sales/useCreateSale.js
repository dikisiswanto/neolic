import { useState } from "react";
import { toast } from "sonner";

export function useCreateSale() {
  const [isLoadingCreateSale, setIsLoadingCreateSale] = useState(false);
  const [errorCreateSale, setErrorCreateSale] = useState(null);
  const [isSuccessCreateSale, setIsSuccessCreateSale] = useState(false);

  const createSale = async (salesData) => {
    setIsLoadingCreateSale(true);
    setErrorCreateSale(null);
    setIsSuccessCreateSale(false);

    try {
      const response = await fetch("/api/data/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salesData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error ||
          response.statusText ||
          "Terjadi kesalahan saat menyimpan data penjualan.";
        setErrorCreateSale(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        throw new Error(errorMessage);
      }

      setIsSuccessCreateSale(true);
      toast.success("Data penjualan berhasil disimpan!", { duration: 5000 });
      return await response.json();
    } catch (error) {
      console.error("Error di useCreateSale hook:", error);
      setErrorCreateSale(
        error.message || "Terjadi kesalahan yang tidak diketahui."
      );
      toast.error(error.message || "Terjadi kesalahan yang tidak diketahui.", {
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoadingCreateSale(false);
    }
  };

  return {
    createSale,
    isLoadingCreateSale,
    errorCreateSale,
    isSuccessCreateSale,
    setIsSuccessCreateSale,
  };
}
