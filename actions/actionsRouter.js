const express = require("express")
const actionsDb = require("../data/helpers/actionModel")
const router = express.Router()

router.get('/actions', (req, res) => {
    actionsDb.get()
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        res.status(500).json({
            error: "The actions information couldn't be retrieved "
        })
    })
})

router.post('/actions',(req, res) => {
   actionsDb.get()
   .then(action => {
    if(!req.body.description || !req.body.project_id || !req.body.notes){
        res.status(400).json({
            message: "Please enter all information"
        })
    } else {
        actionsDb.insert(req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(err => {
            res.status(500).json({
                message: "Something went wrong, please try again later"
            })
        })
    }
   })
})


router.delete("/actions/:id", validatePostId(), (req,res) => {
    actionsDb.remove(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "The post has been nuked"
      })
    })
    .catch(err => {
        res.status(500).json({
            message: "Something went wrong, please try again later"
        })
    })
})


router.put("/actions/:id", validatePostId(),(req,res) => {
    if(!req.body.description || !req.body.notes){
        res.status(404).json({
            message: "Please enter description or/and notes"
        })
    } else {
        actionsDb.update(req.params.id, {description: req.body.description, notes: req.body.notes, completed: req.body.completed})
        .then(action => {
            res.status(200).json("The action has been updated")
        })
        .catch(err => {
            res.status(500).json({
                message: "Something went wrong, please try again later"
            })
        })
    }
})

function validatePostId() {
    return (req, res, next) => {
      actionsDb.get(req.params.id)
      .then(post => {
        if(post){
          req.action = post
          next()
        } else {
          res.status(404).json({
            message: "invalid action ID"
          })
        }  
      })
    }
  }
module.exports = router;