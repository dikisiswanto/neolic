import supabase from '@/lib/supabase';

export async function getVillages({ search = '', page = 1, pageSize = 10 }) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;

  let query = supabase
    .from('villages')
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
      { count: 'exact' }
    )
    .range(startIndex, endIndex);

  if (search) {
    const isDigitSearch = /^\d+$/.test(search);

    if (isDigitSearch) {
      query = query.or([`name.ilike.%${search}%`, `id.eq.${search}`]);
    } else {
      query = query.or([`name.ilike.%${search}%`]);
    }
  }
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data, count };
}

export async function getVillageById(id) {
  try {
    const { data, error } = await supabase
      .from('villages')
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
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error saat getVillageById', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in getVillageById query:', error);
    throw error;
  }
}
