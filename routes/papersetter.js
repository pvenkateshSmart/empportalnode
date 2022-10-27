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

router.get('/', async (req, res) => {
 console.log("papersetted get method"); 
});

router.get('/:paycode', async (req, res) => {    
    try {
        let Papertemplateres = await Papertemplate.find(
            {                
                "Papersetter_paycode" : req.params.paycode                  
            }
        ).populate('user').lean()
        //console.log(Papertemplateres);
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


router.put('/', async (req, res) => {
    try {
        let Papertemplateres = await Papertemplate.find({"Subject":req.body.Subject,"Tag":req.body.tag,"Task":req.body.Task})
        //console.log(Papertemplateres);
        if (!Papertemplateres) {
          return res.send('error/404')
        }
    
        if (Papertemplateres[0].Tag != req.body.tag ||  Papertemplateres[0].Subject != req.body.Subject ) {
          res.send('Not equal')
        } else {
           // console.log(req.body.Qids);
            Papertemplateres = await Papertemplate.findOneAndUpdate(
                {
                  "Subject": req.body.Subject,                 
                  "Tag": req.body.tag,
                  "Task":req.body.Task
                },
                    {$set : {"Status":req.body.Status,"Statuscode":req.body.Statuscode,"Qids":req.body.Qids}}
            )
            res.send(Papertemplateres)
        }
      } catch (err) {
        console.error(err)
        //return res.render('error/500')
      }
});
  module.exports = router