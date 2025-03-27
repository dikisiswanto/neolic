import { useCallback } from 'react';
import { toast } from 'sonner';

function useExportCSV() {
  const convertToCSV = useCallback((data) => {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = [
      'No',
      'Tgl Transaksi',
      'Domain',
      'Desa',
      'Kecamatan',
      'Kabupaten',
      'Provinsi',
      'Produk',
      'Pembeli',
    ];
    const csvRows = [];

    csvRows.push(headers.join(','));

    data.forEach((sale, index) => {
      const values = headers.map((header) => {
        let value = '';

        switch (header) {
          case 'No':
            value = index + 1;
            break;
          case 'Tgl Transaksi':
            if (sale.purchased_at) {
              value = new Intl.DateTimeFormat('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).format(new Date(sale.purchased_at));
            } else {
              value = '';
            }
            break;
          case 'Domain':
            value = sale.domain_url || '';
            break;
          case 'Desa':
            value = sale.village?.name || '';
            break;
          case 'Kecamatan':
            value = sale.village?.district?.name || '';
            break;
          case 'Kabupaten':
            value = sale.village?.district?.regency?.name || '';
            break;
          case 'Provinsi':
            value = sale.village?.district?.regency?.province?.name || '';
            break;
          case 'Produk':
            value = sale.product?.name || '';
            break;
          case 'Pembeli':
            value = sale.buyer?.full_name || '';
            break;
          default:
            value = '';
        }

        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }, []);

  const handleExportCSV = useCallback(
    (dataToExport) => {
      if (!dataToExport || dataToExport.length === 0) {
        toast.info('Data tidak tersedia untuk diekspor.');
        return;
      }

      const csvData = convertToCSV(dataToExport);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const now = new Date();
      const timestamp = now.toLocaleString().replace(/[/:]/g, '-').replace(/ /g, '_');
      const filename = `sales_data_${timestamp}.csv`;
      link.setAttribute('download', filename);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [convertToCSV]
  );

  return { handleExportCSV };
}

export default useExportCSV;
