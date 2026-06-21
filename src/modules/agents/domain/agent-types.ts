export type AgentRole = 'DiscoveryAgent' | 'IdentityAgent' | 'MonetizationAgent' | 'AnalystAgent' | 'OrchestratorAgent';

export interface AgentRegistryEntry {
  id: string;
  role: AgentRole;
  version: string;
  permissions: string[];
  executionLimits: {
    maxNodes: number;
    maxEdges: number;
    maxMemory: number;
  };
  health: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
}

export type DAGNodeType = 'QUERY' | 'FILTER' | 'REASON' | 'TOOL' | 'VALIDATE' | 'PROPOSE' | 'COMMIT' | 'WAIT' | 'PARALLEL' | 'MERGE' | 'END';

export interface DAGNode {
  id: string;
  type: DAGNodeType;
  payload: any;
  next_nodes: string[];
}

export interface ExecutionDAG {
  id: string;
  root_node_id: string;
  nodes: Record<string, DAGNode>;
}

export interface AgentMemory {
  id: string;
  agent_id: string;
  run_id: string;
  type: 'SHORT_TERM' | 'EPISODIC' | 'LONG_TERM';
  content: Record<string, any>;
  validated: boolean;
  created_at: Date;
}

export interface MutationProposal {
  id: string;
  agent_id: string;
  run_id: string;
  action: 'CREATE_ENTITY' | 'CREATE_EDGE' | 'UPDATE_ENTITY' | 'MERGE' | 'DELETE';
  payload: Record<string, any>;
  status: 'PENDING' | 'VALIDATED' | 'REJECTED' | 'COMMITTED';
}
