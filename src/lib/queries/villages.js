import supabase from "@/lib/supabase";

export async function getVillages({ search = "", page = 1, pageSize = 10 }) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;

  let query = supabase
    .from("villages")
    .select(
      `
          id,
          name,
          district:districts(
            name,
            regency:regencies(
              name,
              province:provinces(name)
            )
          )
        `,
      { count: "exact" }
    )
    .range(startIndex, endIndex);

  if (search) {
    query = query.ilike("name", `%${search}%`);
    // query = query.eq('id', search)
  }
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data, count };
}
