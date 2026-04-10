const { spawn } = require('child_process');
const path = require('path');

const isWin = /^win/.test(process.platform);
const npm = isWin ? 'npm.cmd' : 'npm';

console.log('🚀 Starting both Frontend and Backend concurrently...\n');

const backend = spawn(npm, ['run', 'dev'], { cwd: path.join(__dirname, 'backend'), stdio: 'inherit', shell: true });
const frontend = spawn(npm, ['run', 'dev'], { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit', shell: true });

// Handle graceful termination
const cleanup = () => {
    console.log('\nStopping servers...');
    backend.kill();
    frontend.kill();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
