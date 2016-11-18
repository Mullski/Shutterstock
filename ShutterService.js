/**
 * Created by antonimuller on 13.11.16.
 */

const {app, BrowserWindow} = require('electron');

let express = require("express");
var request = require('request');


var Webapp = express();
var server = Webapp.listen(8080);
var token;
var win;
var lastEvent;

var authCallbacks = [];
exports.openAuth = (callback) => {
    //Start a new oauth Request.
    win = new BrowserWindow({ width: 350, height: 600 })
    win.loadURL("https://accounts.shutterstock.com/oauth/authorize?client_id=ac19a12dc1d0053ab476&scope=user.email collections.view purchases.view licenses.create&redirect_uri=http://127.0.0.1:8080/auth&type=web_server&state=afnqfyw0mh4jhdnzxx1r8p8pvi&response_type=code&display=popup");
    win.show();


    authCallbacks.push(callback);
};

exports.fetchBoxes = (callback) => {
    //Fetches a Boxes, callback<func(err,data)>
    var uri = "https://api.shutterstock.com/v2/images/collections?page=1&per_page=150";

    request({ url: uri, headers: { "user-agent": "request", "authorization": "Bearer " + token } }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            callback(null,JSON.parse(body));
        }
        else if (err) {
            callback(err,null);
        }
    });
};
exports.fetchThumb = (imageId, callback) => {
  var uri="https://api.shutterstock.com/v2/images/"+imageId+"?view=full";

    request({ url: uri, headers: { "user-agent": "request", "authorization": "Bearer " + token } }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            callback(null,JSON.parse(body));

        }
        else if (err) {
            callback(err,null);
        }

    });
};
exports.fetchUserSubs = (callback) => {
    var uri="https://api.shutterstock.com/v2/user/subscriptions";

    request({ url: uri, headers: { "user-agent": "request", "authorization": "Bearer " + token } }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log("user subs "+body);

            callback(null,JSON.parse(body));
        }
        else if (err) {
            callback(err,null);
            console.log("Fetch User Sub error:" +err);
        }
    });
};

exports.getDownloadByID = (callback) => {
    //Accuires a License for a Given Picture, returns (url:string,error:error) on callback


    var endpoint = "https://api.shutterstock.com/v2/images/licenses?subscription_id=s27028342";
    var query = {
        subscription_id:"s27028342"
    };

    var body= {
        "images": [
            {
                "image_id": "410445427"
            }
        ]
    };
    var headers = { "user-agent": "request", "authorization": "Bearer " + token,"Content-Type": "application/json" };


    request.post({ url: endpoint, headers: headers,body:JSON.stringify(body)}, function (err, httpResponse, body) {
        console.log(body);
        if (!err && httpResponse.statusCode == 200) {

            callback(null,JSON.parse(body));
            console.log("Post Request works")

        }
        else{
            callback(err,JSON.parse(body));
            console.log("Post Request does not work")
        }
    });
};

exports.logout = ()=>{
     win = new BrowserWindow({ width: 350, height: 600 })
     win.loadURL("https://developers.shutterstock.com/logout?next=http://google.com");
     win.close();
}



Webapp.get("/auth", (req, res) => {
    win.close();
    console.log("Got some Auth going on bruuh");

    console.log(req.query);

    var url = "https://api.shutterstock.com/v2/oauth/access_token";
    var body = {
        "client_id": "ac19a12dc1d0053ab476",
        "client_secret": "34e9009f851018768fb28ad5dd1d146330cec0d8",
        "code": req.query.code,
        'grant_type': "authorization_code"
    };
    var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": 'request'
    };

    request.post({ url: url, headers: headers, form: body }, function (err, httpResponse, body) {
        if (!err && httpResponse.statusCode == 200) {
            token = JSON.parse(body).access_token;

            authCallbacks.forEach((callback)=>{callback(null,body);});
            authCallbacks = [];
        }
        else if (err) {
            authCallbacks.forEach((callback)=>{callback(err,null);});
            authCallbacks = [];
        }
    });
});












