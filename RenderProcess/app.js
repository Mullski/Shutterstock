/**
 * Created by antonimuller on 26.10.16.
 */
//maximale Qualität(kostenfrei) falls Vektorgrafik dann Vektor
//Ornder anlegen automatisch und sortiert
//Funktion hinzufügen für automatischen download aller Ornder
const {ipcRenderer} = require('electron');
const { remote } =require('electron');
const {shell} = require('electron')
const ShutterServiceAPI = require('electron').remote.require('./ShutterService.js');
window.addEventListener('load',()=>{


    var SelectedItems;
    var fetchedLightboxes;

    var pages = document.querySelector('iron-pages');

    var listView = document.querySelector("rush-listview");
    var overView = document.querySelector("rush-overview");
    var downloadView = document.querySelector("rush-download");
    //Fetch the Login Page and Continue when Logged in. 
    document.querySelector("rush-login").addEventListener("authDone",()=>{
        console.log("Auth is Done, welcome");

        console.log("We're logged in");

        pages.selectNext();
        listView.load();        

    });
    listView.addEventListener("logoutRequested",()=>{pages.selectPrevious()})

   listView.addEventListener("selectionDone",(evnt)=>{
        SelectedItems = evnt.detail;
        console.log("Selection Fertig");
        pages.selectNext();
        overView.setList(SelectedItems);
    });

    overView.addEventListener("back",()=>{pages.selectPrevious()})
    overView.addEventListener("continue",(e)=> {
        var args = e.detail;
        downloadView.load(args);
        pages.selectNext();
    });

    downloadView.addEventListener("back",()=>{
        pages.select(pages.indexOf(listView));
    })
});


