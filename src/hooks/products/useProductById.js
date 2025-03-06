import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useProductById = (id) => {
  const queryKey = ['product', id];

  const queryFn = async () => {
    if (!id) return null;
    try {
      const res = await fetch(`/api/data/products/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mendapatkan data produk berdasarkan ID');
      }
      const { data } = await res.json();
      return data;
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data produk:', error);
      toast.error('Gagal memuat produk.', {
        duration: 5000,
      });
      throw error;
    }
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!id,
    staleTime: 60 * 1000,
    onError: () => {
      toast.error('Gagal memuat produk.', {
        duration: 5000,
      });
    },
  });
};
