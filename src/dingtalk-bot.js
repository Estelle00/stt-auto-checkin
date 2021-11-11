const { DINGTALK_WEBHOOK, DINGTALK_SECRET }  = require("./config")
const dayjs = require("dayjs");
const crypto = require("crypto");
const axios = require("axios");
class DingtalkBot {
	timer = null;
	constructor(options = {}) {
		this.text= "";
		this.webhook = options.webhook;
		this.secret = options.secret;
		const timestamp = Date.now();
		const sign = this.signFn(this.secret, `${timestamp}\n${this.secret}`);
		this.allWebhookUrl = `${this.webhook}&timestamp=${timestamp}&sign=${sign}`;
	}
	signFn(secret, content) {
		const str = crypto.createHmac("sha256", secret)
			.update(content)
			.digest()
			.toString("base64")
		return encodeURIComponent(str)
	}
	send(data) {
		// 没有这两个参数则静默失败
		if (!this.webhook || !this.secret) {
			return  Promise.reject({
				msg: 'webhook和secret不能为空',
			})
		}
		return axios.post(this.allWebhookUrl, {
			data,
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		})
	}
	sendMessage(message) {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		const nowFormat = dayjs().format("HH:mm:ss")
		this.text += `- ${nowFormat} ${message}\n`;
		this.timer = setTimeout(() => {
			this.send({
				msgType: "markdown",
				markdown: {
					title: "stt签到日志",
					text: this.text
				}
			}).then(() => this.text = "").catch(e => {
				console.error(e);
			});
		}, 1000)
	}
}

module.exports = new DingtalkBot({
	webhook: DINGTALK_WEBHOOK,
	secret: DINGTALK_SECRET
})