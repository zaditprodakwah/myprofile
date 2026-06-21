import { ExecutionDAG, DAGNode, DAGNodeType, AgentMemory, MutationProposal } from './agent-types';
import { v4 as uuidv4 } from 'uuid';

export class DAGRuntime {
  public async execute(dag: ExecutionDAG, agentId: string, runId: string): Promise<MutationProposal[]> {
    let currentNodeId = dag.root_node_id;
    const proposals: MutationProposal[] = [];
    const executionLog: any[] = [];

    while (currentNodeId) {
      const node = dag.nodes[currentNodeId];
      if (!node) break;

      executionLog.push({ step_id: node.id, type: node.type });

      switch (node.type) {
        case 'QUERY':
        case 'FILTER':
        case 'REASON':
        case 'TOOL':
          // Mock execution for lock
          break;
        case 'PROPOSE':
          proposals.push({
            id: uuidv4(),
            agent_id: agentId,
            run_id: runId,
            action: node.payload.action,
            payload: node.payload.data,
            status: 'PENDING'
          });
          break;
        case 'VALIDATE':
          // All proposals are validated by Rule Engine later
          break;
        case 'END':
          currentNodeId = '';
          continue;
      }

      // Move to next (simplified sequential logic)
      currentNodeId = node.next_nodes[0] || '';
    }

    // Return the generated proposals without committing them
    return proposals;
  }
}
