const express = require('express');
const router = express.Router();
const User = require('../models/User');
const IterateUserProps = require('../iterator/UserPropIterator');

// GET all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.json({ message: err });
	}
});

// GET SPECIFIC User
router.get('/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		res.json(user);
	} catch (err) {
		res.json({ message: err });
	}
});

// SUBMIT A User
router.post('/', async (req, res) => {
	if (!mySession.isSessionValid(req.session)) {
		res.json({ message: 'invalid session' });
		return;
	}
	const user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		cnp: req.body.cnp,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		date_started: req.body.date_started,
		date_end: req.body.date_end,
		position: req.body.position,
		salary: req.body.salary,
		pc: req.body.pc,
		car: req.body.car,
		comments: req.body.comments,
	});

	try {
		const savedUser = await user.save();
		res.json(savedUser);
	} catch (err) {
		res.json({ message: err });
	}
});

// Update User
router.patch('/:userId', async (req, res) => {
	try {
		if (!mySession.isSessionValid(req.session)) {
			res.json({ message: 'invalid session' });
			return;
		}
		let iterator = new IterateUserProps();
		let oNewObj = {};
		let sProp = iterator.hasNext();
		while (sProp !== undefined) {
			oNewObj[sProp] = req.body[sProp];
			sProp = iterator.hasNext();
		}

		const updatedUser = await User.updateOne(
			{ _id: req.params.userId },
			{
				$set: oNewObj,
			}
		);
		res.json(updatedUser);
	} catch (err) {
		res.json({ message: err });
	}
});

// Delete User
router.delete('/:userId', async (req, res) => {
	try {
		if (!mySession.isSessionValid(req.session)) {
			res.json({ message: 'invalid session' });
			return;
		}
		const removedUser = await User.deleteOne({ _id: req.params.userId });
		res.json(removedUser);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
