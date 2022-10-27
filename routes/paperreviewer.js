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

router.post('/', async (req, res) => {
  try {
    var qids=req.body.Qids.map(item => item['Qid']);
    qids=qids.toString();
    //console.log( ); return false;
    var Getques = "select question_master_id,question_master_desc,question_master_type,question_type_name,question_master_subject_id,question_master_level_id,question_level_name, subject_master_id,subject_master_name,topic_master_id,topic_master_name,subtopic_master_name from question_master,subject_master,question_topic, topic_master,subtopic_master,question_subtopic,question_type,question_level where  question_master_id in ("+qids+") and question_level.question_level_id=question_master.question_master_level_id and question_type.question_type_id=question_master.question_master_type  and subject_master.subject_master_id=question_master.question_master_subject_id and question_topic.topic_id=topic_master.topic_master_id and question_topic.question_id=question_master.question_master_id  and question_subtopic.question_id=question_master.question_master_id  and question_subtopic.subtopic_id=subtopic_master.subtopic_master_id  order by subject_master.subject_master_id,topic_id,question_master_type";
      //console.log(Getques); return false;
    connection.query(Getques, function (err, result) {
        if (result == '') {
            console.log('No Questions found');
            res.send({
                "Message":'No Questions Found',                
                "data":0
            })
            return false;
        }
        if (err) {
            console.log('qerrr',err);
            // res.send("Unbale to get the students details ");
        } else {
            var qidobj = [];
            //console.log(result);
            for (var a = 0; a < result.length; a++) {
                //result[a]['selected']=false;
                result[a]['question_master_desc'] = escapeHtml(result[a]['question_master_desc']);
                qidobj.push(result[a]['question_master_id']);                 
            }

            Qids = qidobj.toString();
            //console.log(Qids);
            var Getansw = "select * from answer_master where answer_master_question_id in  (" + Qids + ") order by answer_master_id";
            // console.log(Getansw); return false;
            var d = connection.query(Getansw, function (err, result2) {
            
                var qobj = [];
                for (var b = 0; b < result.length; b++) {
                  result[b]['Comment'] = "";
                  result[b]['qstatus']= 0;

                    var Answer = result2.filter(e => e.answer_master_question_id == result[b]['question_master_id'])

                    for (var s = 0; s < Answer.length; s++) {
                        // console.log(Answer[s].answer_master_question_id);
                        // console.log(Answer[s].answer_master_desc);
                        
                        Answer[s]['answer_master_desc'] = escapeHtml(Answer[s]['answer_master_desc']);

                    }
                    result[b].ans = Answer;
                    //console.log(result[b]);
                }
                //console.log(result);
                resp = JSON.parse(JSON.stringify(result))
      

              
                    if (err) {
                        res.send(err)
                    } else {
                        res.send({
                            "Message":'ok',
                            "typeresult":"All Questions",
                            "data":resp
                        })
                    }
                 
            });


         
          

        }
    })



} catch (err) {
    console.error(err)
    res.render('error/500')
}
 });
 function escapeHtml(text) {
  return text
      .replace(/&amp;/g, "g")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
}
router.get('/:paycode', async (req, res) => {    
    try {
        let Papertemplateres = await Papertemplate.find(
            {                
                "Reviewer_paycode" : req.params.paycode,
                         
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
          //console.log(req.body.Qids);
          //console.log('test');
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
  module.exports = router