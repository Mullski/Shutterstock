/**
 * Created by antonimuller on 13.11.16.
 */

const{app, BrowserWindow}=require('electron');
const {ipcMain} = require('electron');
let express = require("express");
var request = require('request');


var Webapp = express();
var server = Webapp.listen(8080);
var token;
var win;
var lastEvent;

ipcMain.on('shutterservice', (event, arg) => {
    console.log("IPC Task: "+ arg.task);
    switch (arg.task){
        case "auth":
            //Start the Auth Thingy.
            win = new BrowserWindow({width:400,height:300})
            win.loadURL("https://accounts.shutterstock.com/oauth/authorize?client_id=ac19a12dc1d0053ab476&scope=user.email collections.view&redirect_uri=http://127.0.0.1:8080/auth&type=web_server&state=afnqfyw0mh4jhdnzxx1r8p8pvi&response_type=code&display=popup");
            win.show();

            lastEvent= event;

            break;
        case "fetchBoxes":
            var uri ="https://api.shutterstock.com/v2/images/collections?page=1&per_page=150";

            request({url: uri,headers:{"user-agent":"request","authorization":"Bearer "+token}}, function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    console.log("WE GOT SOMETHING COACH!");
                    console.log(body); // Show the HTML for the Google homepage.
                    event.sender.send("shutterservice", {task:"fetchBoxes",res:(JSON.parse(body))});
                }
                else if(err){
                    console.log("OH NOES "+err);

                    event.sender.send("shutterservice", {task:"fetchBoxes",res:err});
                }
                else{
                    console.log("MEH  :c "+ response.statusCode);
                    console.log(body);
                }

            });
            break;
    }

});






Webapp.get("/auth",(req,res)=>{
    win.close();
    console.log("Got some Auth going on bruuh");

    console.log(req.query);

    var url = "https://api.shutterstock.com/v2/oauth/access_token";
    var body = {
        "client_id"     :"ac19a12dc1d0053ab476",
        "client_secret" :"34e9009f851018768fb28ad5dd1d146330cec0d8",
        "code"          :req.query.code,
        'grant_type'    :"authorization_code"
    };
    var headers= {
        "Content-Type":"application/x-www-form-urlencoded",
        "User-Agent":'request'
    };

    // grant_type:"(string, enum: authorization_code, client_credentials): Grant type"
    request.post({url:url,headers:headers,form:body}, function(err,httpResponse,body){
        if (!err && httpResponse.statusCode == 200) {
            console.log("WE GOT SOMETHING COACH!");
            console.log(body); // Show the HTML for the Google homepage.
            token = JSON.parse(body).access_token;


            //ipcMain.send("shutterService",{sucsess:true})
            lastEvent.sender.send("shutterservice", 'pong');

        }
        else if(err){
            console.log("OH NOES "+err);
        }
        else{
            console.log("MEH  :c "+ httpResponse.statusCode);
            console.log(body);
        }
    });
});









