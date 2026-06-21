import { simulateReplay } from './src/modules/entity/tests/replay-simulator';

simulateReplay()
  .then(() => {
    console.log('Replay simulator executed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Simulator failed:', err);
    process.exit(1);
  });
