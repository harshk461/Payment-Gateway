
import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";

export const useAuth = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/users/me",
    fetcher,
    {
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  return {
    user: data?.user || null,
    isAuthenticated: !!data?.user,
    isLoading,
    error,
    refreshAuth: mutate,
  };
};
