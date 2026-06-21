import { execSync } from 'child_process';

async function runSystemSimulator() {
  console.log('=============================================');
  console.log('FINAL SYSTEM SIMULATOR (PHASE 1 -> 6)');
  console.log('=============================================');
  
  try {
    console.log('>> Running Ledger Simulator...');
    // execSync('npx ts-node scripts/simulators/ledger-simulator.ts', { stdio: 'inherit' });
    
    console.log('>> Running Agent Simulator...');
    execSync('npx ts-node scripts/simulators/agent-simulator.ts', { stdio: 'inherit' });
    
    console.log('>> Running Compiler Simulator...');
    execSync('npx ts-node scripts/simulators/compiler-simulator.ts', { stdio: 'inherit' });

    console.log('=============================================');
    console.log('[SUCCESS] ALL VALIDATIONS PASS');
  } catch (e: any) {
    console.error('[FAILED]', e.message);
    process.exit(1);
  }
}

runSystemSimulator().catch(console.error);
