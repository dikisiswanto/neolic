import supabase from '@/lib/supabase';

export async function getBuyers({ search = '', page = 1, pageSize = 10 }) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;

  let query = supabase.from('buyers').select('*', { count: 'exact' }).range(startIndex, endIndex);

  if (search) {
    query = query.ilike('full_name', `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching buyers:', error);
    return [];
  }

  return { data, count };
}

export async function getBuyerById(id) {
  try {
    const { data, error } = await supabase.from('buyers').select('*').eq('id', id).single();

    if (error) {
      console.error('Supabase error saat getBuyerById', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in getBuyerById query:', error);
    throw error;
  }
}
