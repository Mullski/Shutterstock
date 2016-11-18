try {
    const ShutterServiceAPI = require('electron').remote.require('./ShutterService.js');
} catch (e) {

}

Polymer({
    is: "rush-login",

    propertys: {
        title: String,
        description: String,
    },

    created: function () {

    },

    attached: function () {
        this.title = "Rush";
        this.description = "Hello world";
    },

    auth: function () {
        ShutterServiceAPI.openAuth(function (err, data) {
            if(err === null){
                this.fire("authDone");
            }else{
                this.$.toast.text="Es ist ein Fehler beim Login Aufgetreten";
                console.log("Login Error: "+ err);
                this.$.toast.open();
            }
        }.bind(this));
    }




});

