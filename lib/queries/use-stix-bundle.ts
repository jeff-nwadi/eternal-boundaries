import { useQuery } from "@tanstack/react-query";

/** ETBV Layer-Zero gate receipt attached to each STIX object (engine-reported). */
export interface GateProof {
  enforcement_layer?: string;
  action?: string;
  boundary_violation?: string;
  protocol?: string;
  status?: string;
}

export interface StixBundleObject {
  type: string;
  id: string;
  name?: string;
  description?: string;
  created?: string;
  modified?: string;
  labels?: string[];
  x_etbv_gate_proof?: GateProof;
}

export interface StixBundle {
  type: string;
  id: string;
  spec_version?: string;
  objects: StixBundleObject[];
}

/**
 * Live STIX 2.1 bundle from the engine (via our /api/gate/stix-bundle proxy).
 * Server state → TanStack Query (CLAUDE.md §7). Light 60s refetch for a "live"
 * feel without an aggressive polling loop. Data is engine-reported, not verified.
 */
export function useStixBundle() {
  return useQuery<StixBundle>({
    queryKey: ["stix-bundle"],
    queryFn: async () => {
      const res = await fetch("/api/gate/stix-bundle");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to fetch live feed (${res.status})`);
      }
      return res.json();
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: 1,
  });
}
