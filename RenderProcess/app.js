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


    var fetchedLightboxes;
    ipcRenderer.on("shutterservice",(sender,arg)=>{
        console.log("IPC Message");
        console.log(arg);

        switch (arg.task)
        {
            case "fetchBoxes":
                console.log("Fetched some Boxes Coach, ");

                var listbox = document.querySelector("#listbox");
                fetchedLightboxes=arg.res.data;
                arg.res.data.forEach((e,i,a)=>{
                    //Namen der Lightboxes holen und in den Dropdown Content
                    var lightboxItemDiv=document.createElement("div");
                    lightboxItemDiv.setAttribute("class","itemDiv");
                    var lightboxItemCheck=document.createElement("paper-checkbox");
                    var lightboxItem=document.createElement("paper-item");
                    lightboxItemDiv.appendChild(lightboxItemCheck);

                    lightboxItemDiv.appendChild(lightboxItem);
                    lightboxItem.innerText=e.name;

                    LightBoxMap.set(e,lightboxItemDiv);

                    Polymer.dom(listbox).appendChild(lightboxItemDiv);
                    console.log(e.name);
                });

                break;
        }
    });



    var loginBtn=document.getElementById("loginBtn");

    loginBtn.addEventListener('click', function(e) {
        var pages = document.querySelector('iron-pages');

        ipcRenderer.send('shutterservice', {task:"auth"});

        ipcRenderer.once("shutterservice",function(){
            pages.selectNext();
            ipcRenderer.send("shutterservice",{task:"fetchBoxes"});
          });

    });

    document.querySelector("#listbox").addEventListener("iron-select",()=>{

        console.log("selected item changed");
        var selLightBox=document.querySelector("#listbox").selectedItem;

        var selectedLightbox;
        var selectedCover;
        LightBoxMap.forEach((value,key,map)=>{
            if(value==selLightBox){
                console.log("Gefunden");
                selectedLightbox = key.total_item_count;
                selectedCover=key.cover_item;
                console.table(selectedCover);
                console.log(selectedLightbox);
                var countText=document.querySelector("#countInfo");
                countText.innerHTML="";
                countText.innerHTML=selectedLightbox+" Bilder in der Lightbox";
            }
        });


    });



    var selectBtn=document.getElementById("selectBtn");

    selectBtn.addEventListener('click', function(e) {
        var pages = document.querySelector('iron-pages');
        pages.selectNext();
    });

    var goBtn=document.getElementById("goBtn");

    goBtn.addEventListener('click', function(e) {
        var pages = document.querySelector('iron-pages');
        pages.selectNext();
        move();
    });

    var backBtn=document.getElementById("backBtn");

    backBtn.addEventListener('click', function(e) {
        var pages = document.querySelector('iron-pages');
        pages.selectPrevious();
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



