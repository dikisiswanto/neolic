import supabase from "@/lib/supabase";

export async function getProducts({
  page = 1,
  pageSize = 10,
  sort = "created_at",
  order = "desc",
  search = "",
}) {
  let query = supabase
    .from("products")
    .select(
      `
        id,
        name,
        price,
        details,
        created_at,
        serial_number,
        current_version
      `,
      { count: "exact" }
    )
    .order(sort, { ascending: order === "asc" })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    const searchQuery = `%${search}%`;
    query = query.or([
      `name.ilike.${searchQuery}`,
      `serial_number.ilike.${searchQuery}`,
    ]);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data, count };
}

export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error saat getProductById", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in getProductById query:", error);
    throw error;
  }
}
