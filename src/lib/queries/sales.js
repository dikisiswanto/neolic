import supabase from '@/lib/supabase';

export async function getSales({
  page = 1,
  pageSize = 10,
  sort = 'created_at',
  order = 'desc',
  search = '',
  startDate = null,
  endDate = null,
  productId = null,
}) {
  let query = supabase
    .from('purchases')
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
      { count: 'exact' }
    )
    .order(sort, { ascending: order === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    const searchQuery = `%${search}%`;

    const [{ data: villages }, { data: buyers }] = await Promise.all([
      supabase.from('villages').select('id').ilike('name', searchQuery),
      supabase.from('buyers').select('id').ilike('full_name', searchQuery),
    ]);

    const villageIds =
      villages?.map((v) => {
        return v.id;
      }) || [];
    const buyerIds =
      buyers?.map((b) => {
        return b.id;
      }) || [];

    const filters = [
      `domain_url.ilike.${searchQuery}`,
      villageIds.length ? `village_id.in.(${villageIds.join(',')})` : null,
      buyerIds.length ? `buyer_id.in.(${buyerIds.join(',')})` : null,
    ]
      .filter(Boolean)
      .join(',');

    query = query.or(filters);
  }

  // 📆 Filter berdasarkan rentang tanggal transaksi
  if (startDate && endDate) {
    query = query.gte('purchased_at', startDate).lte('purchased_at', endDate);
  } else if (startDate) {
    query = query.gte('purchased_at', startDate);
  } else if (endDate) {
    query = query.lte('purchased_at', endDate);
  }

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data, count };
}

export const createSaleData = async (salesData) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          purchased_at: salesData.transactionDate,
          domain_url: salesData.domainURL,
          village_id: salesData.villageId,
          product_id: salesData.productId,
          buyer_id: salesData.buyerId,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error creating sales data:', error);
      throw error;
    }

    return data ? data[0] : null;
  } catch (error) {
    console.error('Error in createSaleData Supabase query:', error);
    throw error;
  }
};

export const updateSaleData = async (id, salesData) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .update({
        purchased_at: salesData.transactionDate,
        domain_url: salesData.domainURL,
        village_id: salesData.villageId,
        product_id: salesData.productId,
        buyer_id: salesData.buyerId,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error updating sales data:', error);
      throw error;
    }

    return data ? data[0] : null;
  } catch (error) {
    console.error('Error in updateSaleData Supabase query:', error);
    throw error;
  }
};

export async function deleteSale(id) {
  try {
    const { error } = await supabase.from('purchases').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error in deleteSaleByIdSupabase:', error);
      throw new Error(`Failed to delete sale data from Supabase: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteSaleByIdSupabase:', error);
    throw error;
  }
}

export async function getSaleByUrl(url) {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('domain_url, product_id, products(name, serial_number)')
      .eq('domain_url', url)
      .single();

    if (error) {
      console.error('Supabase get error in getSaleByUrl:', error);
      throw new Error(`Failed to get sale data from Supabase: ${error.message}`);
    }

    return { data, error };
  } catch (error) {
    console.error('Error in getSaleByUrl:', error);
    throw error;
  }
}

export async function getSaleByVillageId(villageId) {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(
        'domain_url, villages(id,name,district:districts(name, regency:regencies(name, province:provinces(name)))), product_id, products(name, serial_number)'
      )
      .eq('village_id', villageId)
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase get error in getSaleByVillageId:', error);
      throw new Error(`Failed to get sale data from Supabase: ${error.message}`);
    }

    return { data, error };
  } catch (error) {
    console.error('Error in getSaleByVillageId:', error);
    throw error;
  }
}
