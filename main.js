"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var fs = require("fs");
var fse = require('fs-extra');
var data = fs.readFileSync('./config.json');
var json = data.toString('utf8');
var configSrc = JSON.parse(json);
//distribucion, version
var dataDis = fs.readFileSync(configSrc.path_dist + '/config.json');
var jsonDis = dataDis.toString('utf8');
var configDis = JSON.parse(jsonDis);
var srcDir = configSrc.path_dist;
var destDir = configSrc.path_exe;
if (parseFloat(configSrc.version) < parseFloat(configDis.version)) {
    //actualizar la distribucion
    // To copy a folder or file, select overwrite accordingly
    try {
        fse.copySync(srcDir, destDir, { overwrite: true });
    }
    catch (err) {
        console.error(err);
    }
}
var win = null;
// detect serve mode
var args = process.argv.slice(1);
var serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            //webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true
        },
        autoHideMenuBar: true
    });
    win.maximize();
    if (serve) {
        // get dynamic version from localhost:4200
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
        win.show();
        // The following is optional and will open the DevTools:
        win.webContents.openDevTools();
    }
    else {
        // load the dist folder from Angular
        win.loadURL(url.format({
            pathname: path.join(__dirname, "/dist/index.html"),
            protocol: "file:",
            slashes: true
        }));
    }
    win.on('closed', function () {
        win = null;
    });
    win.webContents.on('did-finish-load', function () {
        //set title
        var name = require('./config.json').name;
        var version = require('./config.json').version;
        console.log("name version=>", name + " " + version);
        win.setTitle(name + " " + version);
    });
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    electron_1.app.on('ready', createWindow);
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    // initialize the app's main window
    electron_1.app.on("activate", function () {
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
