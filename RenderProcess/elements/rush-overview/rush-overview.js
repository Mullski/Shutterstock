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



    }

});

