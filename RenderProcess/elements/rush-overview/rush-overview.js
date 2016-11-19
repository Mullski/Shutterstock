try {
    const ShutterServiceAPI = require('electron').remote.require('./ShutterService.js');
} catch (e) {

}

Polymer({
    is: "rush-overview",

    created: function () {
       
    },

    attached: function () {
        
    },
    setList:function(boxes){
        this.set("lightboxes",boxes);
        var sel=0;
        for(var i=0; i < boxes.length; i++){
            if(boxes[i].selected){
                sel=sel+boxes[i].total_item_count;
            }
        }
        this.set("selectedImages",sel);
    }

});

