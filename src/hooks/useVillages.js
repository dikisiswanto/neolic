import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useVillages({
  page = 1,
  pageSize = 10,
  search = "",
  isFetch = true,
}) {
  return useQuery({
    queryKey: ["villages", page, pageSize, search],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/data/villages?page=${page}&pageSize=${pageSize}&search=${search}`
        );
        const json = await res.json();

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Gagal mengambil data desa. Status: ${res.status}`);
        }

        if (json.data && json.data.length === 0) {
          toast.info("Desa tidak ditemukan.", {
            duration: 5000,
          });
        }

        return json;
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data desa:", error);
        toast.error("Gagal memuat desa.", {
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
      toast.error("Gagal memuat desa.", {
        duration: 5000,
      });
    },
  });
}
