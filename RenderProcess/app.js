/**
 * Created by antonimuller on 26.10.16.
 */
//maximale Qualität(kostenfrei) falls Vektorgrafik dann Vektor
//Ornder anlegen automatisch und sortiert
//Funktion hinzufügen für automatischen download aller Ornder
const {ipcRenderer} = require('electron')
const ShutterServiceAPI = require('electron').remote.require('./ShutterService.js');
window.addEventListener('load',()=>{

    ipcRenderer.on("shutterservice",(sender,arg)=>{
        console.log("IPC Message");
        console.log(arg);

        switch (arg.task)
        {
            case "fetchBoxes":
                console.log("Fetched some Boxes Coach, ");

                var listbox = document.querySelector("#listbox");

                arg.res.data.forEach((e,i,a)=>{
                    //Namen der Lightboxes holen und in den Dropdown Content
                    var lightboxItem=document.createElement("paper-item");
                    lightboxItem.innerText=e.name;

                    Polymer.dom(listbox).appendChild(lightboxItem);
                    
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



