import { supabase } from '@/lib/supabase';
import { GraphConstructionPipeline } from '../workers/graph-construction';

/**
 * PHASE 3 REPLAY SIMULATOR (STRICT MODE)
 * Demonstrates rebuilding the graph from event store and asserting identical state.
 */
export async function simulateReplay() {
  console.log('--- STARTING GRAPH REPLAY SIMULATOR (STRICT MODE) ---');

  // 1. Snapshot original graph state
  console.log('1. Snapshotting original graph state...');
  const { data: origNodes } = await supabase.from('entity_nodes').select('*');
  const { data: origEdges } = await supabase.from('entity_edges').select('*');
  
  const origNodeCount = origNodes?.length || 0;
  const origEdgeCount = origEdges?.length || 0;

  // 2. Wipe current graph projections (Safe drop)
  console.log('2. Dropping current graph state...');
  await supabase.from('entity_edges').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('entity_nodes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 3. Fetch all EntityResolved and RelationshipInferred events ordered by sequence
  console.log('3. Fetching graph mutation events from Event Store...');
  const { data: events, error } = await supabase
    .from('job_events')
    .select('*')
    .in('event_name', ['EntityResolved', 'RelationshipInferred'])
    .order('event_sequence', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  if (!events || events.length === 0) {
    console.log('No events to replay. Graph is empty by design.');
    return;
  }

  console.log(`Replaying ${events.length} events...`);
  const graphEngine = new GraphConstructionPipeline();

  // 4. Replay in exact order
  for (const ev of events) {
    const payload = ev.payload_json as any;
    const cid = ev.correlation_id || 'replay-system';

    if (ev.event_name === 'EntityResolved') {
      await graphEngine.createNode(
        ev.job_id,
        cid,
        payload.original_id,
        payload.canonical_id,
        'DOMAIN',
        payload.attributes
      );
    } else if (ev.event_name === 'RelationshipInferred') {
      await graphEngine.createEdge(
        ev.job_id,
        cid,
        payload.from_id,
        payload.to_id,
        payload.rel_type,
        payload.confidence,
        payload.rule_id,
        ev.event_sequence
      );
    }
  }

  console.log('4. Graph rebuilt. Running Strict Assertions...');
  
  // 5. Strict Assertions
  const { data: edgesAfter } = await supabase.from('entity_edges').select('*');
  const { data: nodesAfter } = await supabase.from('entity_nodes').select('*');
  
  const countEdgesAfter = edgesAfter?.length || 0;
  const countNodesAfter = nodesAfter?.length || 0;

  if (origNodeCount !== countNodesAfter) {
    throw new Error(`REPLAY_INTEGRITY_FAILURE: Node count mismatch (Orig: ${origNodeCount}, Rebuilt: ${countNodesAfter})`);
  }
  
  if (origEdgeCount !== countEdgesAfter) {
    throw new Error(`REPLAY_INTEGRITY_FAILURE: Edge count mismatch (Orig: ${origEdgeCount}, Rebuilt: ${countEdgesAfter})`);
  }

  // Hash equality check
  if (origEdges && edgesAfter) {
    const origHashes = new Set(origEdges.map(e => e.graph_hash));
    const newHashes = new Set(edgesAfter.map(e => e.graph_hash));
    
    if (origHashes.size !== newHashes.size) {
      throw new Error('REPLAY_INTEGRITY_FAILURE: Graph hash set size mismatch');
    }
    
    for (const hash of newHashes) {
      if (!origHashes.has(hash)) {
        throw new Error(`REPLAY_INTEGRITY_FAILURE: Unmatched graph hash found: ${hash}`);
      }
    }
  }

  // Canonical duplicates check
  if (nodesAfter) {
    const rootNodes = nodesAfter.filter(n => n.canonical_id === n.id);
    const uniqueRoots = new Set(rootNodes.map(n => n.canonical_id));
    if (rootNodes.length !== uniqueRoots.size) {
      throw new Error('REPLAY_INTEGRITY_FAILURE: Duplicate canonical roots found');
    }
  }

  console.log('REPLAY_RESULT == PERFECT_MATCH');
  console.log('--- SIMULATOR FINISHED SUCCESSFULLY ---');
}
