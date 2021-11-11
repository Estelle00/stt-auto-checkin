const { USER_NAME, PASSWORD} = require("./config");
const message =  require("./message");
const Api = require("./api")
if (!USER_NAME || !PASSWORD) {
	message("找不到用户名或密码")
} else {
	const api = new Api(USER_NAME, PASSWORD);
	try {
		await api.login();
		const data = await api.checkin();
		message(data.msg);
	} catch (e) {
		message(e.msg || e.message);
	}
	api.login().then(() => {
		api.checkin();
	})
}