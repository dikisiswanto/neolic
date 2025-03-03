"use client";
import { useState, useEffect } from "react";
import { useVillageById } from "@/hooks/villages/useVillageById";
import { useBuyerById } from "@/hooks/buyers/useBuyerById";

export const useInitialNames = (mode, initialSalesData) => {
  const [initialVillageName, setInitialVillageName] = useState(null);
  const [initialBuyerName, setInitialBuyerName] = useState(null);
  const [isInitialNamesLoading, setIsInitialNamesLoading] = useState(false);

  const { data: villageData, isLoading: isVillageDataLoading } = useVillageById(
    initialSalesData?.village_id
  );
  const { data: buyerData, isLoading: isBuyerDataLoading } = useBuyerById(
    initialSalesData?.buyer_id
  );

  useEffect(() => {
    if (mode === "edit" && initialSalesData) {
      setIsInitialNamesLoading(true);
      const fetchInitialData = async () => {
        let villageDisplayName = null;
        let buyerName = null;

        if (initialSalesData.village_id && villageData) {
          villageDisplayName = `${villageData?.name}, Kec. ${villageData?.district?.name}, ${villageData?.district?.regency?.name}`;
        } else if (isVillageDataLoading) {
          villageDisplayName = "Mencari Desa...";
        }

        if (initialSalesData.buyer_id && buyerData) {
          buyerName = buyerData?.full_name;
        } else if (isBuyerDataLoading) {
          buyerName = "Mencari Pembeli...";
        }

        setInitialVillageName(villageDisplayName);
        setInitialBuyerName(buyerName);
        setIsInitialNamesLoading(false);
      };
      fetchInitialData();
    } else {
      setIsInitialNamesLoading(false);
      setInitialVillageName(null);
      setInitialBuyerName(null);
    }
  }, [
    mode,
    initialSalesData,
    villageData,
    buyerData,
    isVillageDataLoading,
    isBuyerDataLoading,
  ]);

  return { initialVillageName, initialBuyerName, isInitialNamesLoading };
};
