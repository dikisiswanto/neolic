"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  createRef,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useVillages } from "@/hooks/useVillages";
import { useProducts } from "@/hooks/useProducts";
import { useBuyers } from "@/hooks/useBuyers";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const MemoizedVillageCommandItem = memo(
  function VillageCommandItem({ village, onSelect }) {
    return (
      <CommandItem
        key={village.id}
        value={village.name}
        onSelect={() => onSelect(village.id)}
      >
        {village.name}, Kec. {village.district?.name},{" "}
        {village.district?.regency?.name},{" "}
        {village.district?.regency?.province?.name}
      </CommandItem>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.village === nextProps.village;
  }
);

const MemoizedBuyerCommandItem = memo(
  function BuyerCommandItem({ buyerData, onSelect }) {
    return (
      <CommandItem
        key={buyerData.id}
        value={buyerData.full_name}
        onSelect={() => onSelect(buyerData.id)}
      >
        {buyerData.full_name}
      </CommandItem>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.buyerData === nextProps.buyerData;
  }
);

function AddSalesDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [domainURL, setDomainURL] = useState("");
  const [villageId, setVillageId] = useState("");

  const [villageSearchTerm, setVillageSearchTerm] = useState("");
  const villageSearchInputRef = useRef(null);
  const debouncedVillageSearchTerm = useDebounce(villageSearchTerm, 300);
  const {
    data: villagesQueryData,
    isLoading: isVillagesLoading,
    error: villagesError,
  } = useVillages(
    isDialogOpen
      ? {
          page: 1,
          pageSize: 20,
          search: debouncedVillageSearchTerm,
        }
      : { isFetch: false }
  );
  const villagesData = villagesQueryData?.data || [];
  const villageItemRefs = useRef([]);

  const [productId, setProductId] = useState("");
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts({});

  const [buyerId, setBuyerId] = useState("");
  const [buyerSearchTerm, setBuyerSearchTerm] = useState("");
  const buyerSearchInputRef = useRef(null);
  const debouncedBuyerSearchTerm = useDebounce(buyerSearchTerm, 300);
  const {
    data: buyersQueryData,
    isLoading: isBuyersLoading,
    error: buyersError,
  } = useBuyers(
    isDialogOpen
      ? {
          page: 1,
          pageSize: 20,
          search: debouncedBuyerSearchTerm,
        }
      : { isFetch: false }
  );
  const buyersData = buyersQueryData?.data || [];
  const buyerItemRefs = useRef([]);

  const [formErrors, setFormErrors] = useState({});
  const [isVillageCommandDialogOpen, setIsVillageCommandDialogOpen] =
    useState(false);
  const [isBuyerCommandDialogOpen, setIsBuyerCommandDialogOpen] =
    useState(false);

  const resetDialogState = useCallback(() => {
    setTransactionDate(new Date());
    setDomainURL("");
    setVillageId("");
    setProductId("");
    setBuyerId("");
    setVillageSearchTerm("");
    setBuyerSearchTerm("");
    setFormErrors({});
    setIsVillageCommandDialogOpen(false);
    setIsBuyerCommandDialogOpen(false);
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      resetDialogState();
    }
  }, [isDialogOpen, resetDialogState]);

  useEffect(() => {
    if (villagesData && isVillageCommandDialogOpen) {
      if (villageSearchInputRef.current) {
        villageSearchInputRef.current.focus();
      }
      if (villagesData.length > 0 && villageItemRefs.current[0]) {
        villageItemRefs.current[0].current?.focus();
      }
    }
  }, [villagesData, isVillageCommandDialogOpen]);

  useEffect(() => {
    if (buyersData && isBuyerCommandDialogOpen) {
      if (buyerSearchInputRef.current) {
        buyerSearchInputRef.current.focus();
      }
      if (buyersData.length > 0 && buyerItemRefs.current[0]) {
        buyerItemRefs.current[0].current?.focus();
      }
    }
  }, [buyersData, isBuyerCommandDialogOpen]);

  const handleVillageSelect = useCallback(
    (id) => {
      setVillageId(id);
      setIsVillageCommandDialogOpen(false);
    },
    [setVillageId]
  );

  const handleBuyerSelect = useCallback(
    (id) => {
      setBuyerId(id);
      setIsBuyerCommandDialogOpen(false);
    },
    [setBuyerId]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>+ Tambah Data Penjualan</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Tambah Data Penjualan Baru</DialogTitle>
          <DialogDescription>
            Isi formulir berikut untuk menambahkan data penjualan.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div>
            <Label className="pb-1">Tanggal Transaksi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {format(transactionDate, "PPP", { locale: id })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={transactionDate}
                  onSelect={(date) => {
                    setTransactionDate(
                      date ? format(date, "yyyy-MM-dd") : undefined
                    );
                  }}
                  locale={id}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="pb-1">Domain URL</Label>
            <Input
              placeholder="Domain URL"
              value={domainURL}
              onChange={(e) => setDomainURL(e.target.value)}
            />
          </div>

          <div>
            <Label className="pb-1">Desa</Label>
            <Button
              variant="outline"
              className="w-full overflow-hidden text-ellipsis whitespace-nowrap items-start"
              type="button"
              disabled={isVillagesLoading || villagesError}
              onClick={() => setIsVillageCommandDialogOpen(true)}
            >
              {!villageId
                ? "Pilih Desa"
                : villageId &&
                    villagesData &&
                    villagesData?.length &&
                    !isVillagesLoading
                  ? `${villagesData.find((v) => v.id === villageId)?.name}, Kec. ${villagesData.find((v) => v.id === villageId)?.district?.name}, ${villagesData.find((v) => v.id === villageId)?.district?.regency?.name}`
                  : villagesError
                    ? "Gagal memuat Desa"
                    : "Pilih Desa"}
            </Button>
            <CommandDialog
              open={isVillageCommandDialogOpen}
              onOpenChange={setIsVillageCommandDialogOpen}
            >
              <Command>
                <CommandInput
                  placeholder="Cari desa..."
                  value={villageSearchTerm}
                  onValueChange={setVillageSearchTerm}
                  ref={villageSearchInputRef}
                  disabled={isVillagesLoading || villagesError}
                />
                <CommandList className="mobile:py-1">
                  <CommandEmpty>Desa tidak ditemukan.</CommandEmpty>
                  {isVillagesLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      <span className="ml-2">Mencari desa...</span>
                    </div>
                  ) : villagesError ? (
                    <CommandGroup>
                      <CommandItem disabled>Gagal memuat desa.</CommandItem>
                    </CommandGroup>
                  ) : (
                    <CommandGroup>
                      {villagesData?.map((village, index) => {
                        villageItemRefs.current[index] =
                          villageItemRefs.current[index] || createRef();
                        return (
                          <MemoizedVillageCommandItem
                            key={village.id}
                            village={village}
                            onSelect={handleVillageSelect}
                          />
                        );
                      })}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </CommandDialog>
            {villagesError && (
              <p className="text-sm text-red-500 mt-1">
                {villagesError.message || "Gagal memuat desa."}
              </p>
            )}
          </div>

          <div>
            <Label className="pb-1">Nama Produk</Label>
            <Select
              onValueChange={setProductId}
              value={productId}
              disabled={isProductsLoading || productsError}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    productsError ? "Gagal memuat Produk" : "Pilih Produk"
                  }
                >
                  {productId
                    ? productsData?.data?.find((p) => p.id == productId)
                        ?.name || "Produk Dipilih"
                    : productsError
                      ? "Gagal memuat Produk"
                      : "Pilih Produk"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                {isProductsLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    <span className="ml-2">Memuat produk...</span>
                  </div>
                ) : productsError ? (
                  <div className="p-2 text-center text-red-500">
                    Gagal memuat produk. Silakan coba lagi.
                  </div>
                ) : productsData?.data?.length ? (
                  productsData.data.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id}
                      selected={product.id == productId}
                    >
                      {product.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-gray-500">
                    Produk tidak ditemukan.
                  </div>
                )}
              </SelectContent>
            </Select>
            {productsError && (
              <p className="text-sm text-red-500 mt-1">
                {productsError.message || "Gagal memuat produk."}
              </p>
            )}
          </div>

          <div>
            <Label className="pb-1">Nama Pembeli</Label>
            <Button
              variant="outline"
              className="w-full overflow-hidden text-ellipsis whitespace-nowrap items-start"
              type="button"
              disabled={isBuyersLoading || buyersError}
              onClick={() => setIsBuyerCommandDialogOpen(true)}
            >
              {!buyerId
                ? "Pilih Pembeli"
                : buyerId &&
                    buyersData &&
                    buyersData?.length &&
                    !isBuyersLoading
                  ? `${buyersData.find((b) => b.id === buyerId)?.full_name}`
                  : buyersError
                    ? "Gagal memuat Pembeli"
                    : "Pilih Pembeli"}
            </Button>
            <CommandDialog
              open={isBuyerCommandDialogOpen}
              onOpenChange={setIsBuyerCommandDialogOpen}
            >
              <Command>
                <CommandInput
                  ref={buyerSearchInputRef}
                  placeholder="Cari nama pembeli..."
                  value={buyerSearchTerm}
                  onValueChange={setBuyerSearchTerm}
                  disabled={isBuyersLoading || buyersError}
                />
                <CommandList className="max-h-64 overflow-y-scroll mobile:py-1">
                  <CommandEmpty>Pembeli tidak ditemukan.</CommandEmpty>
                  {isBuyersLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      <span className="ml-2">Mencari pembeli...</span>
                    </div>
                  ) : buyersError ? (
                    <CommandGroup>
                      <CommandItem disabled>Gagal memuat pembeli.</CommandItem>
                    </CommandGroup>
                  ) : (
                    <CommandGroup>
                      {buyersData?.map((buyerData, index) => {
                        buyerItemRefs.current[index] =
                          buyerItemRefs.current[index] || createRef();
                        return (
                          <MemoizedBuyerCommandItem
                            key={buyerData.id}
                            buyerData={buyerData}
                            onSelect={handleBuyerSelect}
                          />
                        );
                      })}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </CommandDialog>
            {buyersError && (
              <p className="text-sm text-red-500 mt-1">
                {buyersError.message || "Gagal memuat pembeli."}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSalesDialog;
