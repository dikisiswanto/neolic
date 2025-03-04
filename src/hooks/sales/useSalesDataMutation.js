import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSalesDataMutation() {
  const queryClient = useQueryClient();

  const mutateSalesData = async (mode, salesData, id = null) => {
    let url = "/api/data/sales";
    let method = "POST";

    if (mode === "edit") {
      url = `/api/data/sales/${id}`;
      method = "PUT";
    } else if (mode === "delete") {
      url = `/api/data/sales/${id}`;
      method = "DELETE";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: mode === "delete" ? null : JSON.stringify(salesData),
    });

    console.log(res);

    if (!res.ok) {
      const errorData = await res.json();
      throw {
        message: `Gagal ${mode === "edit" ? "mengupdate" : mode === "delete" ? "menghapus" : "menambah"} data penjualan.`,
        errors: errorData.errors,
      };
    }

    const json = await res.json();
    return json.data;
  };

  const mutation = useMutation({
    mutationFn: ({ mode, salesData, id }) =>
      mutateSalesData(mode, salesData, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["sales"]);
      queryClient.invalidateQueries(["stats"]);
      toast.success("Data penjualan berhasil diperbarui!");
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan.");
    },
  });

  const mutate = mutation.mutate;
  const isLoading = mutation.isPending;

  return {
    mutateSalesData: mutate,
    isLoading,
    error: mutation.error,
  };
}
