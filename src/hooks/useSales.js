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
    ],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/data/sales?page=${page}&pageSize=${pageSize}&sort=${sort}&order=${order}&search=${search}&startDate=${startDate}&endDate=${endDate}`
        );
        const json = await res.json();
        if (!res.ok) throw new Error("Terjadi kesalahan: ", res.text);
        return json;
      } catch (error) {
        console.error(error);
        toast(error.message);
        throw new Error(error);
      }
    },
    keepPreviousData: true, // Supaya pagination terasa cepat
    staleTime: 5000, // Cache data selama 5 detik sebelum refetch
    onError: (error) => toast(error.message),
  });
}
