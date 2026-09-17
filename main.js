const { app, BrowserWindow, screen} = require('electron');

let mainWindow;

const winWidth = 200;
const winHeight = 150;

let posX;
let posY;
let xDir = -1;
let yDir = -1;
const speed = 2;


function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  posX = width - 250;
  posY = height - 250;

  mainWindow = new BrowserWindow({
    x: Math.round(posX),
    y: Math.round(posY),
    width: winWidth,    
    height: winHeight,       
    transparent: true, 
    frame: false,       
    alwaysOnTop: true, 
    resizable: false,
    hasShadow: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.setIgnoreMouseEvents(false, { forward: true });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
