/**
 * Created by antonimuller on 26.10.16.
 */
//maximale Qualität(kostenfrei) falls Vektorgrafik dann Vektor
//Ornder anlegen automatisch und sortiert
//Funktion hinzufügen für automatischen download aller Ornder
const {ipcRenderer} = require('electron')
const ShutterServiceAPI = require('electron').remote.require('./ShutterService.js');
window.addEventListener('load',()=>{

    var LightBoxMap= new Map();
    var SelectedItems=new Map();
    var fetchedLightboxes;

    var pages = document.querySelector('iron-pages');

    var listView = document.querySelector("rush-listview");

    //Fetch the Login Page and Continue when Logged in. 
    document.querySelector("rush-login").addEventListener("authDone",()=>{
        console.log("Auth is Done, welcome");

        console.log("We're logged in");

        pages.selectNext();
        listView.load();        


    });
    listView.addEventListener("logoutRequested",()=>{pages.selectPrevious()})

   listView.addEventListener("selectionDone",(evnt)=>{
        var selectedBoxes = evnt.detail;
        console.log("Selection Fertig");
        pages.selectNext();

});


    var goBtn=document.getElementById("goBtn");

    goBtn.addEventListener('click', function(e) {

        //selected Lightboxes
        //rules
        //maximale Qualität(kostenfrei) falls Vektorgrafik dann Vektor
        //license getter

        //über jedes item in der Lightbox itterieren und daten sammeln


        ShutterServiceAPI.fetchUserSubs((err,data)=>{
           if(err==null)
           {
               var subscriptionId=data.data[0].id;
               console.log("Bruv its here! "+subscriptionId);
           }
           else
           {
               console.log("Fetch User Sub Error "+err);
           }
            ShutterServiceAPI.getDownloadByID((err,data)=>{
                if(err==null)
                {
                    var dlink=data.data[0].url;
                    console.log("Hellau! "+dlink);
                }
                else{
                    console.log("Error DLink");
                }
            });

        });

        //download test img
        var imageId=259670459;
        /*for(var i=0;i<SelectedItems.length;i++)
        {

        }*/


        var pages = document.querySelector('iron-pages');
        pages.selectNext();
        move();
    });

    var backBtn=document.getElementById("backBtn");

    backBtn.addEventListener('click', function(e) {
        var pages = document.querySelector('iron-pages');
        pages.selectPrevious();
        //Make all Selected -> False
        SelectedItems.forEach((value,key,map)=>{map.set(key,false)});
        document.querySelectorAll("paper-checkbox").forEach((box)=>{box.checked=false});
        var list=document.querySelector("#selLightbox");
        while (list.hasChildNodes()) {
            list.removeChild(list.lastChild);
        }



    });





    //Alle Login Buttons
    document.getElementById("backToLoginBtn").addEventListener("click",signOut);
    document.getElementById("differentFolder").addEventListener("click",diffFolder);
    /*for(var i=0;i<loginBtns.length;i++)
    {
        loginBtns[i].addEventListener("click",goBackL(0));
        console.log(loginBtns[i])
    }*/




});

function signOut(){
    var ironPages=document.getElementById("ironPages");
    ironPages.selectIndex(0);

}
function diffFolder()
{
    var ironPages=document.getElementById("ironPages");
    ironPages.selectIndex(1);

}
function move(){
    var progress=document.getElementById("container");



        var width = 1;
    //TODO: Keine animationen mit set Interval Lösen
    // You now requestAnimationFrame()?
        var id = setInterval(frame, 100);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                width=1;
            } else {
                width++;
                progress.style.width = width + '%';
                progress.innerText= width+"%";
            }
        }


}
function findLightboxCount(name,LightBoxMap,callback){

    LightBoxMap.forEach((value,key,map)=>{
        if(value==name)
        {
           callback(key.total_item_count);
        }
        })
    }



