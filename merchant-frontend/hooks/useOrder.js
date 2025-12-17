import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";

export const useOrder = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/orders",
    fetcher,
    {
      refreshInterval: 10000, // 🔥 every 5 seconds
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  return {
    orders:data?.orders || [],
    isLoading,
    error,
    refreshCart: mutate,
  };
};
