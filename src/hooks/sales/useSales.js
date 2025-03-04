import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSales({
  page = 1,
  pageSize = 10,
  sort = "purchased_at",
  order = "desc",
  search = "",
  startDate = null,
  endDate = null,
  productId = null,
}) {
  return useQuery({
    queryKey: [
      "sales",
      page,
      pageSize,
      sort,
      order,
      search,
      startDate,
      endDate,
      productId,
    ],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/data/sales?page=${page}&pageSize=${pageSize}&sort=${sort}&order=${order}&search=${search}&startDate=${startDate}&endDate=${endDate}&productId=${productId}`
        );

        if (!res.ok) {
          throw new Error(`Gagal memuat data penjualan.`);
        }

        const json = await res.json();

        if (json.data && json.data.length === 0) {
          toast.info("Data tidak ditemukan.", {
            duration: 5000,
          });
        }

        return json;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        throw new Error(error);
      }
    },
    keepPreviousData: true, // Supaya pagination terasa cepat
    staleTime: 5000, // Cache data selama 5 detik sebelum refetch
    onError: (error) => toast.error(error.message),
  });
}
