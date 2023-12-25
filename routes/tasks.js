const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mySession = require('../session/mysession');

const currentUser = 'jkiss';

// GET all tasks
router.get('/', async (req, res) => {
	try {
		if (!mySession.isSessionValid(req.session)) {
			res.json({ message: 'invalid session' });
			return;
		}
		const tasks = await Task.find({ owner: currentUser });
		res.json(tasks);
	} catch (err) {
		res.json({ message: err });
	}
});

// // GET SPECIFIC Task
// router.get('/:taskId', async (req, res) => {
// 	try {
// 		const tasks = await Task.findById(req.params.taskId);
// 		res.json(tasks);
// 	} catch (err) {
// 		res.json({ message: err });
// 	}
// });

// GET Task for User
router.get('/:userName', async (req, res) => {
	try {
		if (!mySession.isSessionValid(req.session)) {
			res.json({ message: 'invalid session' });
			return;
		}
		// const user = await Task.findById(req.params.taskId);
		const tasks = await Task.find({ owner: req.params.userName });
		res.json(tasks);
	} catch (err) {
		res.json({ message: err });
	}
});

// SUBMIT A Task
router.post('/', async (req, res) => {
	if (!mySession.isSessionValid(req.session)) {
		res.json({ message: 'invalid session' });
		return;
	}
	const user = new Task({
		title: req.body.title,
		description: req.body.description,
		owner: req.body.owner,
		date_starts: req.body.date_starts,
		date_ends: req.body.date_ends,
		date_reminder: req.body.date_reminder,
		is_done: false,
		created_at: Date.now(),
		created_by: req.body.created_by,
	});

	try {
		const savedTask = await user.save();
		res.json(savedTask);
	} catch (err) {
		res.json({ message: err });
	}
});

// Update Task
router.patch('/:taskId', async (req, res) => {
	try {
		if (!mySession.isSessionValid(req.session)) {
			res.json({ message: 'invalid session' });
			return;
		}
		const updatedTask = await Task.updateOne(
			{ _id: req.params.taskId },
			{
				$set: {
					title: req.body.title,
					description: req.body.description,
					owner: req.body.owner,
					date_starts: req.body.date_starts,
					date_ends: req.body.date_ends,
					date_reminder: req.body.date_reminder,
					is_done: req.body.is_done,
				},
			}
		);
		res.json(updatedTask);
	} catch (err) {
		res.json({ message: err });
	}
});

// Delete Task
router.delete('/:taskId', async (req, res) => {
	try {
		if (!mySession.isSessionValid(req.session)) {
			res.json({ message: 'invalid session' });
			return;
		}
		const removedTask = await Task.deleteOne({ _id: req.params.taskId });
		res.json(removedTask);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
