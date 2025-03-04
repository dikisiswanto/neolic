import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useBuyers({
  page = 1,
  pageSize = 10,
  search = "",
  isFetch = true,
}) {
  return useQuery({
    queryKey: ["buyers", page, pageSize, search],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/data/buyers?page=${page}&pageSize=${pageSize}&search=${search}`
        );

        if (!res.ok) {
          throw new Error(`Gagal memuat data pembeli.`);
        }

        const json = await res.json();

        if (json.data && json.data.length === 0) {
          toast.info("Pembeli tidak ditemukan.", {
            duration: 5000,
          });
        }

        return json;
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data pembeli:", error);
        toast.error("Gagal memuat pembeli.", {
          duration: 5000,
        });
        throw error;
      }
    },
    keepPreviousData: true,
    placeholderData: [],
    enabled: isFetch,
    staleTime: 5000,
    onError: (error) => {
      toast.error("Gagal memuat pembeli.", {
        duration: 5000,
      });
    },
  });
}
