export class GraphContextBuilder {
  public buildContext(seedId: string, depth: number = 4, maxNodes: number = 500) {
    // Generates a deterministic bounded graph context for the agent
    return {
      seed: seedId,
      nodes: [],
      edges: [],
      limits: { depth, maxNodes }
    };
  }
}
