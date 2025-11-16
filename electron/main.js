const { app, BrowserWindow } = require('electron');
const { fork } = require('child_process');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const HOST = process.env.NEXT_HOST || '127.0.0.1';
const PORT = Number(process.env.NEXT_PORT || process.env.PORT || 3000);
const START_URL = process.env.ELECTRON_START_URL || `http://${HOST}:${PORT}`;

let nextServerProcess;
const isDev = !app.isPackaged;

function getStandaloneServerPath() {
  const candidates = [
    path.join(app.getAppPath(), '.next', 'standalone', 'server.js'),
    path.join(
      process.resourcesPath,
      'app.asar.unpacked',
      '.next',
      'standalone',
      'server.js',
    ),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

function startProductionServer() {
  const serverPath = getStandaloneServerPath();

  if (!serverPath) {
    throw new Error(
      'Cannot find the Next.js standalone server. Please run `pnpm build` before packaging.',
    );
  }

  const serverDirectory = path.dirname(serverPath);
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: PORT.toString(),
    HOSTNAME: HOST,
  };

  nextServerProcess = fork(serverPath, ['-H', HOST, '-p', PORT.toString()], {
    cwd: serverDirectory,
    env,
    stdio: 'inherit',
  });
}

function stopProductionServer() {
  if (nextServerProcess && !nextServerProcess.killed) {
    nextServerProcess.kill();
    nextServerProcess = undefined;
  }
}

function waitForServer(target, attempts = 30, delayMs = 500) {
  const url = new URL(target);
  const client = url.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    let remaining = attempts;

    const check = () => {
      const request = client.get(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
        },
        (response) => {
          response.destroy();
          resolve(true);
        },
      );

      request.on('error', () => {
        remaining -= 1;
        if (remaining <= 0) {
          reject(new Error(`Server at ${target} did not respond.`));
          return;
        }
        setTimeout(check, delayMs);
      });
    };

    check();
  });
}

async function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  if (!isDev) {
    await waitForServer(START_URL);
  }

  await window.loadURL(START_URL);
}

app.whenReady().then(async () => {
  if (!isDev) {
    startProductionServer();
  }

  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopProductionServer();
});
