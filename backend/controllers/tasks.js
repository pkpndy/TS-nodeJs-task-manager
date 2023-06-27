const Task = require('../models/Task')

const getAllTasks = async (req,res) => {
    try {
        const task = await Task.find({})
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

const createTask = async (req,res) => {
    try {
        const task = await Task.create(req.body)
        res.status(201).json({task}) 
    } catch (error) {
        res.status(500).json({msg:error}) // set msg property with what comes in error
    }
    //this is post so what ever we post is sent through body
    // res.json(req.body)
}

const getTask = async (req,res) => {
    try {
        //here we extracting the property id from the object returned and then assign to taskID variable
        const {id:taskID} = req.params 
        const task = await Task.findOne({_id: taskID})
        if(!task){ //if the task of particular id is not found then findOne() returns NULL object
            return res.status(404).json({msg: `No task found with ID: ${taskID} `})
        } 
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg:error})
    }

    // we use req.params for getting specific id from URL
    // res.json({id:req.params.id})
}

const updateTask = async (req,res) => {
    try {
        const {id:taskID} = req.params
        const task = await Task.findByIdAndUpdate(taskID, req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

const deleteTask = async (req,res) => {
    try {
        const {id:taskID} = req.params 
        const task = await Task.findByIdAndDelete(taskID)
        if(!task){
            return res.stauts(404).json({msg: `No task found with ID: ${taskID} `})
        }
        res.status(200).json({msg: 'Task deleted successfully'})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

module.exports = {
    getAllTasks, createTask,updateTask,getTask,deleteTask
}