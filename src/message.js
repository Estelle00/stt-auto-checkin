const bot = require("./dingtalk-bot")
module.exports = function (msg) {
	console.log(msg);
	bot.sendMessage(msg);
}