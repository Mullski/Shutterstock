/**
 * Created by antonimuller on 10.10.16.
 */
const{app, BrowserWindow}=require('electron');
const {ipcMain} = require('electron');
var request = require('request');
var ShutterService = require("./ShutterService.js");
let win;




function createWindow(){

    win = new BrowserWindow({width:800,height:600})

    win.loadURL(`file://${__dirname}/RenderProcess/index.html`);
    //    win.loadURL("http://localhost:8080");

    win.webContents.openDevTools()

    win.on('closed',()=>{
        win=null
    })

    win.once('ready-to-show', () => {
        win.show()
    });
    //Lambda ()=>{}   == function(){}
    //Referenz wird gelöscht





}
app.on('ready',createWindow)





