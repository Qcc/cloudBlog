var redis = require("redis");
var options = require("../config/default").redis; 

var client = redis.createClient(options);

client.on("error", function (err) {
    console.log("redis错误： " + err);
});
client.on("ready", function () {
    console.log("redis准备好了... ");
});
client.on("connect", function () {
    console.log("redis链接上来了... ");
});
client.on("end", function (err) {
    console.log("redis结束链接... ");
});

module.exports = client;
