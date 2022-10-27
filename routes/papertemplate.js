const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
const Papertemplate = require('../models/papertemplate')
const fs = require('fs');
const connection = require('../config/touchstone_config');
const { resolveNaptr} = require('dns');

const { route} = require('.');
var ObjectId = require('mongodb').ObjectID;

//Get Paper Templates list
router.get('/', async (req, res) => {
    try {
        const templates = await Papertemplate.aggregate([
            {
                 $group:
                     {
                     _id: "$Tag",
                     Subjects: {$push: "$$ROOT"} 
                     }
             }
              
           
         ])          
        .sort({_id:1})
          
         
        res.send({
            "data":templates
        })
      } catch (err) {
        console.error(err)
       // res.render('error/500')
      }   
});

//Get papertemplates with mongo id
router.get('/:id', async (req, res) => {    
    try {
        let Papertemplateres = await Papertemplate.findById(req.params.id).populate('user').lean()
        console.log(Papertemplateres);
        if (!Papertemplateres) {
          return res.send('error/404')
        }
    
        if (Papertemplateres._id != req.params.id) {
         // res.send('error/404')
        } else {
          //res.send('stories/show', {
            res.send(Papertemplateres)
          //})
        }
      } catch (err) {
        console.error(err)
        //res.send('error/404')
      }
});

//Add new paper template record
router.post('/', async (req, res) => {
   //console.log(req.body); return false;
  try {    
    const c=await Papertemplate.create(req.body)
    //res.redirect('/dashboard')
    res.send({"Message":"Ok",res: c});
  } catch (err) {
    console.error(err)
    //res.render('error/500')
  }
});


router.put('/:id', async (req, res) => {
    try {
        let Papertemplateres = await Papertemplate.findById(req.params.id).lean()
    
        if (!Papertemplateres) {
          return res.send('error/404')
        }
    
        if (Papertemplateres.id != req.body.id) {
          res.send('Not equal')
        } else {
            //Papertemplateres = await Papertemplate.findOneAndUpdate({ _id: req.params.id }, req.body, {
            //new: true,
            //runValidators: true,
             //})    
          //res.send(Papertemplateres)
            Papertemplateres = await Papertemplate.findOneAndUpdate(
                {_id:req.params.id},
                {$set : {"Status":req.body.Status}}
            )
            res.send(Papertemplateres)
        }
      } catch (err) {
        console.error(err)
        //return res.render('error/500')
      }
});


// @desc    Delete template
// @route   DELETE /template/:id
router.delete('/:tagname',  async (req, res) => {
    try {
       
     
        await Papertemplate.remove({ "Tag": req.params.tagname })
       // res.send('/dashboard')
       res.send({"Message":"Deleted Records"});
       
    } catch (err) {
      console.error(err)
      //return res.render('error/500')
    }
  })
  module.exports = router