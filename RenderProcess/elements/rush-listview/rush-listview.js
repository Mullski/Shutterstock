try {
    const ShutterServiceAPI = require('electron').remote.require('./ShutterService.js');
} catch (e) {

}

Polymer({
    is: "rush-listview",

    propertys: {
        selectedImages:Number
    },

    created: function () {
       
    },

    attached: function () {
        //Set no Image is selected
         this.set("selectedImages",0);
    },

    selectChange:function(e){
        var boxes =this.get("lightboxes");
        boxes[e.model.index].selected= !boxes[e.model.index].selected;
        var sel=0;
        for(var i=0; i < boxes.length; i++){
            if(boxes[i].selected){
                sel=sel+boxes[i].total_item_count;
            }
        }
        this.set("selectedImages",sel);
    },

    load: function () {
        ShutterServiceAPI.fetchBoxes((err, data) => {
            //Fetch all the Boxes of this User
            if (err == null) {
                var lightboxes = data.data;
                lightboxes.forEach((box,index) => {
                    //Set some Extra info into Each Box 
                    box.selected=false;
                    if(box.total_item_count>0){
                        //If the Box Contains Images 
                        // Find the ones Uses as Thumbnail on the Shuterstock Website
                       ShutterServiceAPI.fetchThumb(box.cover_item.id, (err, data) => {
                        if (err == null) {
                            //If some Images are Found save them In the Model
                            this.set(["lightboxes",index,"cover_item","url"],data.assets.large_thumb.url);
                        }
                        });
                    }else{
                        //Use no Picture otherwise.
                        console.log("No Images");
                        
                    }
                    
                });
                //Set this as Model
                this.set("lightboxes", lightboxes);
            }
        });
    },
    continue:function(){
        //Continue to the Next Screeen -> Fetch all Selected Boxes and Pass them 
        var count = this.get("selectedImages");
        if(count>0){
            var boxes =this.get("lightboxes");
            selectedBoxes = boxes.filter((e)=>{return e.selected});
            this.fire("selectionDone",selectedBoxes)
        }else{
            this.$.toast.text="Bitte wählen sie Bilder aus";
            this.$.toast.open();
        }
        
    },
    logout:function(){
        // Call the Logout and Request to go Back. 
        ShutterServiceAPI.logout();
        this.fire("logoutRequested");
    }
});

