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

    //Fetch the Login Page and Continue when Logged in. 
    document.querySelector("rush-login").addEventListener("authDone",()=>{
        console.log("Auth is Done, welcome");

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
                ShutterServiceAPI.fetchImageDetThumb(selectedCover,(err,data)=>{
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

        var validSubscriptionId;
        ShutterServiceAPI.fetchUserSubs((err,data)=>{
            if(err==null)
            {
                for(var i=0;i<data.data.length;i++)
                {
                    var subscriptionId=data.data[i].id;
                    console.log(subscriptionId);
                    var expirationDate=data.data[i].expiration_time;
                    var valid=checkIfValid(expirationDate);
                    if(valid==true)
                    {
                        validSubscriptionId=subscriptionId;
                    }
                    else
                    {
                        validSubscriptionId="";
                    }
                    console.log("Valid "+validSubscriptionId);
                }
            }
            else
            {
                console.log("Fetch User Sub Error "+err);
            }

        });


        var itemId;
        SelectedItems.forEach((selected,lightbox)=>
        {
            if(selected){
                var lightboxIds =lightbox.id;
                var lightboxName=lightbox.name;
                ShutterServiceAPI.fetchCollItems(lightboxIds,(err,data)=>{
                    if(err==null)
                    {
                        for(var i=0;i<data.data.length;i++)
                        {
                            //jedes Item

                            itemId=data.data[i].id;
                            console.log("Item ids "+itemId);
                            ShutterServiceAPI.fetchImageDet(itemId,(err,data)=> {
                                if (err == null)
                                {
                                    var details=data.assets;
                                    var imgId=data.id;
                                    console.log("image ids "+imgId);
                                    //vektor eps checken ob es vektorgrafiken gibt
                                    var info=applyRules(details);


                                    ShutterServiceAPI.getDownloadByID(imgId,info.size,validSubscriptionId,info.format,(err,data)=>{
                                        if(err==null)
                                        {
                                            var dlink=data.data[0].download.url;
                                            console.log(dlink);
                                            //downloaden
                                            ShutterServiceAPI.downloadImg(dlink,lightboxName,(err,data)=>{

                                            });

                                        }
                                        else{
                                            console.log("Error DLink");
                                        }
                                    });

                                }
                            });

                        }

                    }
                    else
                    {

                    }
                });

            }
        });



        //download test img
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
function checkIfValid(expirationDate)
{
    var localDate=new Date();
    var timeStempLocal=Math.round(new Date(localDate).getTime()/1000);
    var timeStemp=Math.round(new Date(expirationDate).getTime()/1000);
    var valid=false;
    if(timeStempLocal<timeStemp)
    {
        return valid=true;
    }
    else
    {
        return valid=false;
    }

}
function applyRules(details)
{
    console.log(details);
    console.log(Object.keys(details));
    var keys = Object.keys(details);
    var size="";
    var format="";
    if(keys.some((e)=>{return e === "vector_eps"}))
    {
        size="vector";
        format="eps";
    }
    /*else if(keys.some((e)=>{return e === "supersize_jpg"}))
    {
        size="supersize";
        format="jpg";
    }*/
    else if(keys.some((e)=>{return e === "huge_jpg"}))
    {
        size="huge";
        format="jpg";
    }
    else if(keys.some((e)=>{return e === "medium_jpg"}))
    {
        size="medium";
        format="jpg";
    }
    else if(keys.some((e)=>{return e === "small_jpg"}))
    {
        size="small";
        format="jpg";
    }
    else
    {
        console.log("error size");
    }


        return {size:size,format:format};



}




