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

    var loginBtn=document.getElementById("loginBtn");

    //Fetch the Login Page and Continue when Logged in. 
    document.querySelector("rush-login").addEventListener("authDone",()=>{
        console.log("Auth is Done, welcome");    
    });


    loginBtn.addEventListener('click', function(e) {
        var pages = document.querySelector('iron-pages');

        ShutterServiceAPI.openAuth(function(err,data){
            if(err == null){
                console.log("We're logged in");
                pages.selectNext();
                ShutterServiceAPI.fetchBoxes((err,data)=>{
                    if(err==null){
                        var listbox = document.querySelector("#listbox");
                        fetchedLightboxes=data.data;
                        data.data.forEach((e,i,a)=>{
                            //Namen der Lightboxes holen und in den Dropdown Content
                            var lightboxItemDiv=document.createElement("div");
                            lightboxItemDiv.setAttribute("class","itemDiv");
                            var lightboxItemCheck=document.createElement("paper-checkbox");
                            var lightboxItem=document.createElement("paper-item");
                            lightboxItemDiv.appendChild(lightboxItemCheck);

                            lightboxItemDiv.appendChild(lightboxItem);
                            lightboxItem.innerText=e.name;

                            LightBoxMap.set(e,lightboxItemDiv);
                            SelectedItems.set(e,false);

                            Polymer.dom(listbox).appendChild(lightboxItemDiv);
                            console.log(e.name);

                            lightboxItemCheck.addEventListener("click",function(){
                                SelectedItems.set(e,!SelectedItems.get(e))
                            }.bind(this));

                        });
                        }

                });
            }
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
                selectedCover=key.cover_item.id;
                console.table("Hier ID "+selectedCover);
                console.log(selectedLightbox);
                var countText=document.querySelector("#countInfo");
                countText.innerHTML="";
                countText.innerHTML=selectedLightbox+" Bilder in der Lightbox";

                //ThumbNail
                ShutterServiceAPI.fetchThumb(selectedCover,(err,data)=>{
                    if(err==null){
                      var fetchedImage=data.assets.large_thumb.url;
                      //var fetchedImageUri=fetchedImage.preview.url;
                      var thumbCont=document.querySelector("#thumb");
                        thumbCont.setAttribute("src","");
                        thumbCont.setAttribute("src",fetchedImage);
                    }
                });
            }
        });


    });



    var selectBtn=document.getElementById("selectBtn");

    selectBtn.addEventListener('click', function(e) {
        var cont=false;
        SelectedItems.forEach((selected,lightbox)=>{
            if(selected){
                var list=document.querySelector("#selLightbox");
                var selItem=document.createElement("li");
                selItem.innerHTML=lightbox.name+"("+lightbox.total_item_count+" in der Lightbox)";
                list.appendChild(selItem);
                console.log(lightbox.name);
                cont=true;
            }

        });
            if(cont==true)
            {
                var pages = document.querySelector('iron-pages');
                pages.selectNext();
            }
            else
            {
                //dont go forward
            }



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



