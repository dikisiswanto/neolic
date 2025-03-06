import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useVillageById = (id) => {
  const queryKey = ['village', id];

  const queryFn = async () => {
    if (!id) return null;
    try {
      const res = await fetch(`/api/data/villages/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mendapatkan data desa berdasarkan ID');
      }
      const { data } = await res.json();
      return data;
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data desa:', error);
      toast.error('Gagal memuat desa.', {
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
                                                                      toast.error('Gagal memuat desa.', {
        duration: 5000,
      });
    },
  });
};
