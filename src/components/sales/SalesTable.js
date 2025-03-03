import { useState, useEffect } from "react";
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
import {
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  CalendarIcon,
  Download,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useExportCSV from "@/hooks/useExportCSV";
import { useSales } from "@/hooks/sales/useSales";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useProducts } from "@/hooks/products/useProducts";

export default function SalesTable({ onEditClick, refreshTrigger }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState("purchased_at");
  const [order, setOrder] = useState("desc");
  const [productId, setProductId] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);
  const debounceSort = useDebounce(sort, 500);
  const debounceOrder = useDebounce(order, 500);

  const { data, isLoading, error, refetch } = useSales({
    page,
    pageSize,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
    sort: debounceSort,
    order: debounceOrder,
    productId,
  });

  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts({ pageSize: 10 });

  const pageSizeOptions = [10, 15, 20, 25, 50, 100, 500, 1000];
  const { handleExportCSV } = useExportCSV();

  const changeSortOrder = (sortValue, orderValue) => {
    setSort(sortValue);
    setOrder(orderValue);
    setPage(1);
  };

  const resetStartDate = () => {
    setStartDate("");
    setPage(1);
  };

  const resetEndDate = () => {
    setEndDate("");
    setPage(1);
  };

  return (
    <section className="py-4 bg-white">
      <div className="flex justify-between gap-2 mb-4 flex-col lg:flex-row">
        <Input
          placeholder="Cari Desa, Domain, atau Pelaksana"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex gap-2 items-center justify-between w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "max-w-full flex-grow text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, "PPP", { locale: id })
                ) : (
                  <span>Tanggal Mulai</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date ? format(date, "yyyy-MM-dd") : undefined);
                  setPage(1);
                }}
                initialFocus
                locale={id}
              />
            </PopoverContent>
          </Popover>
          {startDate && (
            <Button
              className="w-auto inline-block"
              variant={"outline"}
              size={"sm"}
              onClick={resetStartDate}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 items-center justify-between w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "max-w-full flex-grow text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(endDate, "PPP", { locale: id })
                ) : (
                  <span>Tanggal Berakhir</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date ? format(date, "yyyy-MM-dd") : undefined);
                  setPage(1);
                }}
                initialFocus
                locale={id}
              />
            </PopoverContent>
          </Popover>
          {endDate && (
            <Button
              className="w-auto inline-block"
              variant={"outline"}
              size={"sm"}
              onClick={resetEndDate}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select
          value={productId}
          onValueChange={(value) => {
            setProductId(value === "all" ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="cursor-pointer">
            {productId
              ? productsData?.data?.find((product) => product.id === productId)
                  ?.name || "Pilih Produk"
              : "Semua Produk"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Produk</SelectItem>
            {isProductsLoading ? (
              <SelectItem disabled value="loading">
                Loading...
              </SelectItem>
            ) : productsError ? (
              <SelectItem disabled value="error">
                Error Memuat Produk
              </SelectItem>
            ) : (
              productsData?.data?.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select
          className="w-auto"
          value={pageSize.toString()}
          onValueChange={(value) => {
            setPageSize(parseInt(value, 10));
            setPage(1);
          }}
        >
          <SelectTrigger className="cursor-pointer">
            Tampilkan {pageSize} data per halaman
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((pageSizeOption) => (
              <SelectItem
                key={pageSizeOption}
                value={pageSizeOption.toString()}
              >
                {pageSizeOption} per halaman
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => handleExportCSV(data?.data)}>
          <Download /> Ekspor CSV
        </Button>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead className="w-auto">
              Tgl Transaksi
              <ArrowUp
                size={13}
                className={cn(
                  "hover:cursor-pointer inline-flex ml-3",
                  sort === "purchased_at" && order === "asc" && "text-blue-500"
                )}
                onClick={() => changeSortOrder("purchased_at", "asc")}
              />
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
              Domain
              <ArrowUp
                size={13}
                className={cn(
                  "hover:cursor-pointer inline-flex ml-3",
                  sort === "domain_url" && order === "asc" && "text-blue-500"
                )}
                onClick={() => changeSortOrder("domain_url", "asc")}
              />
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
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
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
                  <Button onClick={() => onEditClick(sale)}>
                    <Edit size={10} />
                  </Button>
                  <Button variant="destructive">
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
    </section>
  );
}
