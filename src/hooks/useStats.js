import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/data/stats");
        const json = await res.json();
        if (!res.ok) throw new Error("Terjadi kesalahan: ", res.text);
        return json;
      } catch (error) {
        console.error(error.message);
        toast(error.message);
        throw error;
      }
    },
    staleTime: 3600000, // 1 jam (1 hour = 60 * 60 * 1000 ms)
    onError: (error) => toast(error.message),
  });
}
