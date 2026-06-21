import { DAGRuntime } from '../../src/modules/agents/domain/dag-runtime';
import { ExecutionDAG } from '../../src/modules/agents/domain/agent-types';
import { v4 as uuidv4 } from 'uuid';

async function runAgentSimulator() {
  console.log('[PHASE 5] Starting STRICT Agent DAG Simulator...');
  
  const runtime = new DAGRuntime();
  const runId = uuidv4();
  
  const sampleDag: ExecutionDAG = {
    id: 'dag-001',
    root_node_id: 'node-1',
    nodes: {
      'node-1': { id: 'node-1', type: 'QUERY', payload: {}, next_nodes: ['node-2'] },
      'node-2': { id: 'node-2', type: 'REASON', payload: {}, next_nodes: ['node-3'] },
      'node-3': { id: 'node-3', type: 'PROPOSE', payload: { action: 'CREATE_EDGE', data: {} }, next_nodes: ['node-4'] },
      'node-4': { id: 'node-4', type: 'END', payload: {}, next_nodes: [] }
    }
  };

  console.log(`[1] Executing Deterministic DAG: ${sampleDag.id}`);
  const proposals = await runtime.execute(sampleDag, 'agent-xyz', runId);

  console.log(`[2] Generated Proposals: ${proposals.length}`);
  if (proposals.length !== 1 || proposals[0].action !== 'CREATE_EDGE') {
    throw new Error('DAG Execution Drift Detected!');
  }

  console.log(`[3] Replaying Execution...`);
  const replayProposals = await runtime.execute(sampleDag, 'agent-xyz', runId);
  
  if (replayProposals.length !== proposals.length || replayProposals[0].action !== proposals[0].action) {
    throw new Error('Replay Determinism Failed!');
  }

  console.log('[SUCCESS] Agent DAG Replay and Integrity PASS');
}

runAgentSimulator().catch(console.error);
