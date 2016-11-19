try {
    const ShutterServiceAPI = require('electron').remote.require('./ShutterService.js');
    const { remote } =require('electron');
} catch (e) {

}

Polymer({
    is: "rush-overview",

    created: function () {
    },
    attached: function () {
    },
    setList: function (boxes) {
        this.set("lightboxes", boxes);
        var sel = 0;
        for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].selected) {
                sel = sel + boxes[i].total_item_count;
            }
        }
        this.set("selectedImages", sel);

        function checkIfValid(element) {
            var expirationDate = element.expiration_time;
            var localDate = new Date();
            var timeStempLocal = Math.round(new Date(localDate).getTime() / 1000);
            var timeStemp = Math.round(new Date(expirationDate).getTime() / 1000);
            return timeStempLocal < timeStemp
        }
        //Fetch all Subscriptions Available
        ShutterServiceAPI.fetchUserSubs((err, data) => {
            if (err == null) {
                var Subscriptions = data.data;
                var runningSubscriptions = Subscriptions.filter(checkIfValid)
                if(runningSubscriptions.length>0){
                    this.set("subscription",runningSubscriptions[0])
                    var time = new Date(runningSubscriptions[0].expiration_time);
                    this.set("timeout",time.toLocaleString());
                }
                

            }

        });
    },
    openDialog:function(){
        //Open a Select Folder Dialog
        remote.dialog.showOpenDialog(remote.getCurrentWindow(),{properties: ['openDirectory']},
        (path)=>{
            if(path){this.set("path",path);}
        });
    },
    back:function(){
        this.fire("back");
    },
    continue:function(){
        //Fetch all the Stuff we did.
        var boxes = this.get("lightboxes");
        var subscription = this.get("subscription");
        var downloadPath = this.get("path");
        if(downloadPath.length>0 && subscription != null){
            this.fire("continue",{boxes:boxes,subscription:subscription,path:downloadPath});
        }else if(downloadPath.length<=0){
            this.$.toast.text="Kein Speicherort Angegeben";
            this.$.toast.open();
        }else if(subscription === null){
            this.$.toast.text="Keine valide Subscription für den Download gefunden";
            this.$.toast.open();
        }
    }

});

