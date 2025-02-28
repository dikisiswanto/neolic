import { useState } from "react";
import { useSales } from "@/hooks/useSales";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";

export default function SalesTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  const { data, isLoading } = useSales({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-white rounded-lg"
    >
      <div className="flex justify-between gap-2 mb-4">
        <Input
          placeholder="Cari Nama Desa, Domain, atau Pelaksana"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Tgl Transaksi</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Desa</TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead>Kabupaten</TableHead>
            <TableHead>Provinsi</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Pembeli</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data?.data?.map((sale, index) => (
              <TableRow key={sale.id}>
                <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                <TableCell>
                  {new Date(sale.purchased_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{sale.domain_url}</TableCell>
                <TableCell>{sale.village?.name}</TableCell>
                <TableCell>{sale.village?.district?.name}</TableCell>
                <TableCell>{sale.village?.district?.regency?.name}</TableCell>
                <TableCell>
                  {sale.village?.district?.regency?.province?.name}
                </TableCell>
                <TableCell>{sale.product?.name}</TableCell>
                <TableCell>{sale.buyer?.full_name}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        page={page}
        total={data?.total || 0}
        pageSize={data?.pageSize || 10}
        onChange={(newPage) => setPage(newPage)}
      />
    </motion.div>
  );
}
