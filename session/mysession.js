const util = require('util');
const oneDay = 1000 * 60 * 60 * 24;
const sessionConfig = {
	secret: process.env.SESSION_SECRET,
	saveUninitialized: true,
	cookie: { maxAge: oneDay },
	resave: false,
};

class MySession {
	static instance = MySession.instance || new MySession();

	static getInstance() {
		if (!MySession.instance) {
			MySession.instance = new MySession();
		}
		return MySession.instance;
	}

	setSession(oSession) {
		this.oSession = oSession;
	}

	isSessionValid(oSession) {
		console.log(oSession);
		return oSession && oSession.userName === this.getSessionUser();
	}

	setSessionUser(sUsername) {
		if (this.oSession) {
			this.oSession.userName = sUsername;
		}
	}

	getSessionUser() {
		return this.oSession ? this.oSession.userName : null;
	}

	getConfig() {
		return sessionConfig;
	}
}

module.exports = MySession.getInstance();
