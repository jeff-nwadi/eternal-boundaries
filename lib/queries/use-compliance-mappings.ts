import { useQuery } from "@tanstack/react-query";

export interface ComplianceMapping {
  id: string;
  control_id: string;
  framework_component: string;
  status: string; // e.g., "COMPLIANT" | "NON_COMPLIANT"
  last_assessed: string;
}

export interface ComplianceMappingsResponse {
  status: string;
  framework: string;
  version: string;
  mappings: ComplianceMapping[];
}

export function useComplianceMappings() {
  return useQuery<ComplianceMappingsResponse>({
    queryKey: ["compliance-mappings"],
    queryFn: async () => {
      const res = await fetch("/api/gate/compliance-mappings");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch compliance mappings (${res.status})`
        );
      }
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
