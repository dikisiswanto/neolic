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
import { Edit, Trash2, ArrowUp, ArrowDown, Download } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useExportCSV from "@/hooks/useExportCSV";

export default function SalesTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState("purchased_at");
  const [order, setOrder] = useState("desc");

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);
  const debounceSort = useDebounce(sort, 500);
  const debounceOrder = useDebounce(order, 500);

  const { data, isLoading } = useSales({
    page,
    pageSize,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
    sort: debounceSort,
    order: debounceOrder,
  });

  const pageSizeOptions = [10, 20, 25, 50, 100, 1000];

  const changeSortOrder = (sortValue, orderValue) => {
    setSort(sortValue);
    setOrder(orderValue);
  };

  const { handleExportCSV } = useExportCSV();

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
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(parseInt(value, 10))}
        >
          <SelectTrigger>Ukuran Halaman</SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize} per halaman
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="hover:cursor-pointer"
          onClick={() => handleExportCSV(data?.data)}
        >
          <Download /> Ekspor CSV
        </Button>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead className="w-auto">
              Tgl Transaksi{" "}
              <ArrowUp
                size={13}
                className={cn(
                  "hover:cursor-pointer inline-flex",
                  sort === "purchased_at" && order === "asc" && "text-blue-500"
                )}
                onClick={() => changeSortOrder("purchased_at", "asc")}
              />{" "}
              <ArrowDown
                size={13}
                className={cn(
                  "hover:cursor-pointer inline-flex",
                  sort === "purchased_at" && order === "desc" && "text-blue-500"
                )}
                onClick={() => changeSortOrder("purchased_at", "desc")}
              />
            </TableHead>
            <TableHead>
              Domain{" "}
              <ArrowUp
                size={13}
                className={cn(
                  "hover:cursor-pointer inline-flex",
                  sort === "domain_url" && order === "asc" && "text-blue-500"
                )}
                onClick={() => changeSortOrder("domain_url", "asc")}
              />{" "}
              <ArrowDown
                size={13}
                className={cn(
                  "hover:cursor-pointer inline-flex",
                  sort === "domain_url" && order === "desc" && "text-blue-500"
                )}
                onClick={() => changeSortOrder("domain_url", "desc")}
              />
            </TableHead>
            <TableHead>Desa</TableHead>
            <TableHead>Kecamatan</TableHead>
            <TableHead>Kabupaten</TableHead>
            <TableHead>Provinsi</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Pembeli</TableHead>
            <TableHead>Aksi</TableHead>
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
                <TableCell className="inline-flex gap-2">
                  <Button className="hover:cursor-pointer">
                    <Edit size={10} />
                  </Button>{" "}
                  <Button
                    className="hover:cursor-pointer"
                    variant="destructive"
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
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
