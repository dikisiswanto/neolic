// src/hooks/useSalesDialogForm.js
import { useState, useCallback } from "react";
import { format } from "date-fns";

function useSalesDialogForm() {
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [domainURL, setDomainURL] = useState("");
  const [villageId, setVillageId] = useState("");
  const [productId, setProductId] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const resetForm = useCallback(() => {
    setTransactionDate(new Date());
    setDomainURL("");
    setVillageId("");
    setProductId("");
    setBuyerId("");
    setFormErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!transactionDate)
      errors.transactionDate = "Tanggal Transaksi wajib diisi.";
    if (!domainURL) errors.domainURL = "Domain URL wajib diisi.";
    if (!villageId) errors.villageId = "Desa wajib dipilih.";
    if (!productId) errors.productId = "Nama Produk wajib dipilih.";
    if (!buyerId) errors.buyerId = "Nama Pembeli wajib dipilih.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true jika tidak ada error
  }, [transactionDate, domainURL, villageId, productId, buyerId]);

  const getSalesData = useCallback(() => {
    return {
      transaction_date: format(transactionDate, "yyyy-MM-dd"),
      domain_url: domainURL,
      village_id: villageId,
      product_id: productId,
      buyer_id: buyerId,
    };
  }, [transactionDate, domainURL, villageId, productId, buyerId]);

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
  };
}

export default useSalesDialogForm;
