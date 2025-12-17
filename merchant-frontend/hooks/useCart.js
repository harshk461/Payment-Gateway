import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";

export const useCart = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/orders/cart",
    fetcher,
    {
      refreshInterval: 5000, // 🔥 every 5 seconds
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  return {
    cart: data?.cart || null,
    cartItems: data?.cartItems || [],
    cartTotal: data?.cartTotal || 0,
    isLoading,
    error,
    refreshCart: mutate,
  };
};
