const axios = require("axios");
const {DOMAIN} = require("./config");
const instance = axios.create({
	timeout: 10000,
	withCredentials: true
});
class Api {
	cookie = null;
	constructor(userName, password) {
		this.email = userName;
		this.passwd = password;
	}
	async login() {
		const { data, headers } = await instance.post(DOMAIN + "/auth/login", {
			email: this.email,
			passwd: this.passwd
		});
		if (data.ret === 1) {
			this.cookie = headers["set-cookie"];
		} else {
			return Promise.reject(data);
		}
	}
	checkin() {
		if(!this.cookie) {
			return Promise.reject({msg: "用户cookie获取失败！"});
		}
		return instance.post(DOMAIN + "/user/checkin", {}, {
			headers: {cookie: this.cookie}
		}).then(res => res.data)
	}
}
module.exports = Api;