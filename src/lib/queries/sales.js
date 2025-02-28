import supabase from "@/lib/supabase";

export async function getSales({
  page = 1,
  pageSize = 10,
  sort = "created_at",
  order = "desc",
  search = "",
  startDate = null,
  endDate = null,
}) {
  let query = supabase
    .from("purchases")
    .select(
      `
        *,
        product:products(name),
        village:villages(name, 
          district:districts(name, 
            regency:regencies(name, 
              province:provinces(name)
            )
          )
        ),
        buyer:buyers(full_name)
      `,
      { count: "exact" }
    )
    .order(sort, { ascending: order === "asc" })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    const searchQuery = `%${search}%`;

    const [{ data: villages }, { data: buyers }] = await Promise.all([
      supabase.from("villages").select("id").ilike("name", searchQuery),
      supabase.from("buyers").select("id").ilike("full_name", searchQuery),
    ]);

    const villageIds = villages?.map((v) => v.id) || [];
    const buyerIds = buyers?.map((b) => b.id) || [];

    const filters = [
      `domain_url.ilike.${searchQuery}`,
      villageIds.length ? `village_id.in.(${villageIds.join(",")})` : null,
      buyerIds.length ? `buyer_id.in.(${buyerIds.join(",")})` : null,
    ]
      .filter(Boolean)
      .join(",");

    query = query.or(filters);
  }

  // 📆 Filter berdasarkan rentang tanggal transaksi
  if (startDate && endDate) {
    query = query.gte("purchased_at", startDate).lte("purchased_at", endDate);
  } else if (startDate) {
    query = query.gte("purchased_at", startDate);
  } else if (endDate) {
    query = query.lte("purchased_at", endDate);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data, count };
}
