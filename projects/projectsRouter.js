const express = require("express")
const projectsDb = require("../data/helpers/projectModel")
const router = express.Router()

router.get("/projects", (req,res) => {
    projectsDb.get()
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        res.status(500).json({
            message: "The projects information couldn't be retrieved"
        })
    })
})


router.post("/projects", (req,res) => {
    projectsDb.get()
    .then(project => {
        if(!req.body.name || !req.body.description){
            res.status(400).json({
                message: "Please enter all information"
            })
        } else {
            projectsDb.insert(req.body)
            .then(project => {
                res.status(201).json(project)
            })
            .catch(err => {
                res.status(500).json({
                    message: "Couldn't create a project, please try again"
                })
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "Something went wrong, please try again"
        })
    })

})


router.delete("/projects/:id", validateProjectId(),(req, res) => {
    projectsDb.remove(req.params.id)
    .then(() => {
        res.status(200).json({
            message: "The project has been deleted"
        })
    })
    .catch(err => {
        res.status(500).json({
            message: "Something went wrong, please try again later"
        })
    })
})

router.put("/projects/:id", validateProjectId(),(req,res) => {
    if(!req.body.name || !req.body.description || !req.body.completed){
        res.status(404).json({
            message: "Please enter description or/and notes"
        })
    } else {
        projectsDb.update(req.params.id, {name: req.body.name, description: req.body.description, completed: req.body.completed})
        .then(project => {
            res.status(200).json("The action has been updated")
        })
        .catch(err => {
            res.status(500).json({
                message: "Something went wrong, please try again later"
            })
        })
    }
})

function validateProjectId() {
    return (req, res,next) => {
        projectsDb.get(req.params.id)
        .then(post => {
            if(post){
                req.project = post
                next()
            } else {
                res.status(404).json({
                    message: "invalid project ID"
                })
            }
        })
    }
}
module.exports = router
