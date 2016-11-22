
Polymer({
    is: "rush-header",

    resize:function()
    {

    },
    closeWind:function(){
        console.log("close me");
        window.close();

    },
    fullWind:function()
    {
        var doc = window.document;
        var docEl = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        }
        else {
            cancelFullScreen.call(doc);
        }


    },
    minimize:function()
    {
        var currentWind=remote.getCurrentWindow();
        currentWind.minimize();
    }




});