const { app, BrowserWindow, screen} = require('electron');
const { uIOhook } = require('uiohook-napi');

let mainWindow;

const winWidth = 200;
const winHeight = 150;

let posX;
let posY;


function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  posX = width - 250;
  posY = height - 250;

  mainWindow = new BrowserWindow({
    x: Math.round(posX),
    y: Math.round(posY),
    icon: __dirname + '/icon.ico',
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
      contextIsolation: false,
      sandbox: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  uIOhook.on('mousemove', (e) => {
    const bounds = mainWindow.getBounds();

    const scale = screen.getDisplayMatching(bounds).scaleFactor;
    
    const isHovering = 
      e.x >= bounds.x * scale && 
      e.x <= (bounds.x + bounds.width) * scale && 
      e.y >= bounds.y * scale && 
      e.y <= (bounds.y + bounds.height) * scale;

    mainWindow.webContents.send('hovering', isHovering);
  });
  uIOhook.start();
}


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  uIOhook.stop();
  if (process.platform !== 'darwin') app.quit();
});
