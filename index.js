console.clear();
let http = require("http");
let express = require("express");
let socketIo = require("socket.io");
let easyrtc = require("easyrtc"); 

process.title = "node-easyrtc";

let port = process.env.PORT || 8081;

let app = express();

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname));

let webServer = http.createServer(app);

let socketServer = socketIo.listen(webServer, {"log level": 1});

var myIceServers = [
    {"url": "stun:stun.l.google.com:19302"},
    {"url": "stun:stun1.l.google.com:19302"},
    {"url": "stun:stun2.l.google.com:19302"},
    {"url": "stun:stun3.l.google.com:19302"}
];

easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);
  

easyrtc.events.on("easyrtcAuth", (socket, easyrtcid, msg, socketCallback, callback) => {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});
  

easyrtc.events.on("roomJoin", (connectionObj, roomName, roomParameter, callback) => {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));

    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});
  

easyrtc.listen(app, socketServer, null, (err, rtcRef) => {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", (appObj, creatorConnectionObj, roomName, roomOptions, callback) => {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});


webServer.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
