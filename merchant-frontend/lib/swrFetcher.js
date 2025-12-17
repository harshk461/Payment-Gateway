import { apiRequest } from "./api";

export const fetcher = (url) => apiRequest.get(url);