import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProducts({
  page = 1,
  pageSize = 10,
  sort = "created_at",
  order = "desc",
  search = "",
  isFetch = true,
}) {
  return useQuery({
    queryKey: ["products", page, pageSize, sort, order, search],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/data/products?page=${page}&pageSize=${pageSize}&sort=${sort}&order=${order}&search=${search}`
        );
        const json = await res.json();
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Gagal mengambil data produk. Status: ${res.status}`);
        }

        if (json.data && json.data.length === 0) {
          toast.info("Produk tidak ditemukan.", {
            duration: 5000,
          });
        }

        return json;
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data produk:", error);
        toast.error("Gagal memuat produk.", {
          duration: 5000,
        });
        throw error;
      }
    },
    keepPreviousData: true,
    staleTime: 5000,
    enabled: isFetch,
    onError: (error) => {
      toast.error("Gagal memuat produk.", {
        duration: 5000,
      });
    },
  });
}
