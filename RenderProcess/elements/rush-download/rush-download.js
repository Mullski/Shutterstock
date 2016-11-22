
try {
    const ShutterServiceAPI = require('electron').remote.require('./ShutterService.js');

} catch (e) {

}

Polymer({
    is: "rush-download",

    propertys: {
        argument: Object
    },

    created: function () {

    },

    attached: function () {

    },

    openFolder:function(){
        var arg = this.get("argument");
        if(arg.path[0]!=null){
            shell.showItemInFolder(arg.path[0]);
        }
    },
    backToStart:function(){
        this.fire("back");
    },
    load: function (argument) {
       // this.args = { boxes: boxes, subscription: subscription, path: downloadPath };
        this.set("status", 0);
        this.set("argument",argument);

        var totalamount = 0;
        var doneamount=0;
        argument.boxes.forEach((e)=>{totalamount=totalamount+e.total_item_count})

        function applyRules(details) {
            //Find the Best Possible Size.
            var keys = Object.keys(details);
            var size = "";
            var format = "";
            if (keys.some((e) => { return e === "vector_eps" })) {
                size = "vector";
                format = "eps";
            }
            else if (keys.some((e) => { return e === "huge_jpg" })) {
                size = "huge";
                format = "jpg";
            }
            else if (keys.some((e) => { return e === "medium_jpg" })) {
                size = "medium";
                format = "jpg";
            }
            else if (keys.some((e) => { return e === "small_jpg" })) {
                size = "small";
                format = "jpg";
            }
            return { size: size, format: format };
        }

        fetchOneLightbox = (lightbox,callback) =>{
            var lightboxCount = lightbox.total_item_count;
            var lightboxDone = 0;
            //Find for Each Lightbox the Pictures
            ShutterServiceAPI.fetchCollItems(lightbox.id, (err, data) => {
                if (err != null) { throw err }
                var imageCollection = data.data;  // Data.data -> Fetched Images
                for (var i = 0; i < imageCollection.length; i++) {
                    ShutterServiceAPI.fetchImageDet(imageCollection[i].id, (err, imageDetail) => {
                        if (err != null) { throw err }
                        var rule = applyRules(imageDetail.assets);
                        ShutterServiceAPI.getDownloadByID(imageDetail.id, rule.size, argument.subscription.id, rule.format, (err, data) => {
                            if (err != null) { throw err }
                            var dlink = data.data[0].download.url;
                            ShutterServiceAPI.downloadImg(dlink, lightbox.name,argument.path[0], (err, data) => {
                                doneamount=doneamount+1;
                                lightboxDone=lightboxDone+1;
                                this.set("status",Math.round((doneamount*1.0/totalamount*1.0)*100));
                                if(lightboxDone==lightboxCount){
                                    callback(null)
                                }
                            });
                        });
                    });
                }
            });
        }

        fetchAllLightBoxes=(count,callback)=>{
            if(count<argument.boxes.length){
                fetchOneLightbox(argument.boxes[count],(err)=>{
                    count++;
                    fetchAllLightBoxes(count,callback);
                })
            }else{
                callback()
            }
        }
        fetchAllLightBoxes(0,()=>{
            this.$.page.selectNext();
        }); // Fetch all Lightboxes, start with 0 
            
    }
});

