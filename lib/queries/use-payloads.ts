import { useQuery } from "@tanstack/react-query";

export interface LinkedControl {
  control_id: string;
  control_name: string;
  framework?: string;
  status: string;
}

export interface CveControlMatrixItem {
  cve_id: string;
  affected_asset: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  enforcement_status: string;
  linked_controls: LinkedControl[];
}

export interface PayloadsResponse {
  status: string;
  timestamp?: string;
  cve_control_matrix?: CveControlMatrixItem[];
  findings?: CveControlMatrixItem[];
  payloads?: CveControlMatrixItem[];
}

export function usePayloads() {
  return useQuery<PayloadsResponse>({
    queryKey: ["payloads"],
    queryFn: async () => {
      const res = await fetch("/api/v1/payloads");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch payloads (${res.status})`
        );
      }
      return res.json();
    },
    // Poll on a 5-second interval using TanStack Query to prevent request piling & maintain clean state
    refetchInterval: 5000,
    staleTime: 4000,
  });
}
