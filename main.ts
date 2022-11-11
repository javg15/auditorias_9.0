import {app, BrowserWindow, Menu, Tray} from 'electron';
import * as path from 'path';
import * as url from 'url';

import * as fs from 'fs';

const fse = require('fs-extra');
const data = fs.readFileSync('./config.json');
const json = data.toString('utf8');

let configSrc = JSON.parse(json);
//distribucion, version
const dataDis = fs.readFileSync(configSrc.path_dist + '/config.json');
const jsonDis = dataDis.toString('utf8');
let configDis = JSON.parse(jsonDis);
const srcDir = configSrc.path_dist;
const destDir = configSrc.path_exe;


if(parseFloat(configSrc.version)<parseFloat(configDis.version)){
    //actualizar la distribucion
      
    // To copy a folder or file, select overwrite accordingly
    try {
        fse.copySync(srcDir, destDir, { overwrite: true })
    } catch (err) {
        console.error(err)
    }
}

let win: BrowserWindow = null;

// detect serve mode
const args = process.argv.slice(1);
let serve: boolean = args.some(val => val === '--serve');

function createWindow() {

    win = new BrowserWindow({
        width: 800, 
        height: 600, 
        webPreferences: {
            //webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            //allowRunningInsecureContent: (serve) ? true : false,
        },
        autoHideMenuBar: true,
    });
    win.maximize();



    if (serve) {
        // get dynamic version from localhost:4200
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200');
        win.show();
        // The following is optional and will open the DevTools:
        win.webContents.openDevTools();
    } else {
        // load the dist folder from Angular
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, `/dist/index.html`),
                protocol: "file:",
                slashes: true,
                //icon: path.join(__dirname, 'assets/icons/favicon.png')
            })
        );
    }

    win.on('closed', () => {
        win = null;
    });

    win.webContents.on('did-finish-load',()=>{
        //set title
        let name=require('./config.json').name
        let version= require('./config.json').version
        console.log("name version=>",name + " " + version)
        win.setTitle(name + " " + version)
    })
}

try {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    // initialize the app's main window
    app.on("activate", () => {
        if (win === null) {
            createWindow();
        }
    });

} catch (e) {
    // Catch Error
    // throw e;
}
