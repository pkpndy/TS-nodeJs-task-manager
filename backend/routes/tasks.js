const express = require('express')
const router = express.Router()
const {getAllTasks,createTask,deleteTask,updateTask, getTask} = require('../controllers/tasks')

router.route('/').get(getAllTasks).post(createTask)
router.route('/:id').delete(deleteTask).patch(updateTask).get(getTask)

module.exports = router

// getAll,post,get(particular),patch,delete