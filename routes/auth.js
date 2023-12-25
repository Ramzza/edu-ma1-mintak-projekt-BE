const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mySession = require('../session/mysession');

router.post('/register', async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		cnp: req.body.cnp,
		email: req.body.email,
		username: req.body.username,
		password: hashPassword,
	});

	try {
		console.log(user);
		const savedUser = await user.save();
		console.log(savedUser);
		res.json(savedUser);
	} catch (err) {
		console.log(err);
		res.json({ message: err });
	}
});

router.post('/login', async (req, res) => {
	let oUser = await User.findOne({ username: req.body.username });
	if (!oUser)
		return res
			.status(400)
			.send(JSON.stringify({ message: 'Wrong credentials' }));

	console.log(oUser);

	const validPass = await bcrypt.compare(req.body.password, oUser.password);
	if (!validPass)
		return res
			.status(400)
			.send(JSON.stringify({ message: 'Wrong credentials' }));

	oUser.password = null;
	mySession.setSession(req.session);
	mySession.setSessionUser(oUser.username);
	res.send(JSON.stringify(oUser));
});

router.post('/logout', async (req, res) => {
	mySession.setUser(null);
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;
