import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const REPO_ROOT = process.cwd();
const POLL_INTERVAL_MS = 10000; // 10 seconds check interval

console.log('🔄 ========================================================');
console.log('🚀 [Auto-Git-Sync] Node.js Intelligent Watcher Active');
console.log(`📍 Repository: ${REPO_ROOT}`);
console.log('🔄 ========================================================');

let isSyncing = false;

async function checkAndSync() {
  if (isSyncing) return;

  try {
    const { stdout: statusOut } = await execAsync('git status --porcelain', { cwd: REPO_ROOT });
    if (statusOut.trim().length > 0) {
      isSyncing = true;
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      console.log(`⚡ [Auto-Git-Sync] Detected modified files:\n${statusOut.trim()}`);
      console.log(`📦 Staging and committing at ${timestamp}...`);

      await execAsync('git add .', { cwd: REPO_ROOT });
      await execAsync(`git commit -m "chore(auto-sync): automated commit ${timestamp}"`, { cwd: REPO_ROOT });
      
      console.log('📤 Pushing to GitHub origin main...');
      await execAsync('git push origin main', { cwd: REPO_ROOT });
      console.log(`✅ [Auto-Git-Sync] Successfully pushed to GitHub at ${timestamp}!`);
    }
  } catch (err) {
    console.warn(`⚠️ [Auto-Git-Sync] Sync notice: ${err.message}`);
  } finally {
    isSyncing = false;
  }
}

// Start recurring check loop
setInterval(checkAndSync, POLL_INTERVAL_MS);
checkAndSync();
