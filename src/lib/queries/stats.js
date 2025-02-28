import supabase from "@/lib/supabase";

const getFirstAndLastDayOfMonth = () => {
  const date = new Date();
  return {
    firstDay: new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
    lastDay: new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString(),
  };
};

const getCount = async (table, filters = {}) => {
  let query = supabase.from(table).select("id", { count: "exact" });

  Object.entries(filters).forEach(([key, value]) => {
    query = query[key](...value);
  });

  const { count } = await query;
  return count;
};

const getDashboardData = async () => {
  const { firstDay, lastDay } = getFirstAndLastDayOfMonth();

  const queries = [
    getCount("purchases", {
      neq: ["status", 0],
      gte: ["purchased_at", firstDay],
      lte: ["purchased_at", lastDay],
    }),
    getCount("purchases"),
    getCount("products"),
    getCount("buyers"),
  ];

  const [currentMonthPurchase, totalPurchase, totalProducts, totalBuyers] =
    await Promise.all(queries);

  return { currentMonthPurchase, totalPurchase, totalProducts, totalBuyers };
};

export { getDashboardData };
