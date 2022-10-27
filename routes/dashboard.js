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

//Get records based on type and  paycode
router.get('/:type/:paycode', async (req, res) => {
    if(req.params.type=='setter'){
        try {
            const templates = await Papertemplate.aggregate([
               
             {
                $match: {  "Papersetter_paycode":req.params.paycode }
            }, 
             {
                $group : {
                           
                        _id: {"Status":"$Status","Statuscode":"$Statuscode"},
                          count:{$sum:1}
                        },
            },
            {
                 $project: {
                            _id: 0,
                            Status:"$_id.Status",
                            Statuscode:"$_id.Statuscode",
                            count:"$count"
                        }
                }
               
             ]) .sort({Statuscode:1})         
             
              
             
            res.send({
                "data":templates
            })
          } catch (err) {
            console.error(err)
           // res.render('error/500')
          }   
    }else if(req.params.type=='reviewer'){
        try {
            const templates = await Papertemplate.aggregate([
               
             {
                $match: {  "Reviewer_paycode":req.params.paycode }
            }, 
             {
                $group : {
                           
                        _id: {"Status":"$Status","Statuscode":"$Statuscode"},
                          count:{$sum:1}
                        },
            },
            {
                 $project: {
                            _id: 0,
                            Status:"$_id.Status",
                            Statuscode:"$_id.Statuscode",
                            count:"$count"
                        }
                }
               
             ]) .sort({Statuscode:1})         
             
              
             
            res.send({
                "data":templates
            })
          } catch (err) {
            console.error(err)
           // res.render('error/500')
          }   
    }
   
});



//Get the question from the selection
router.post('/', async (req, res) => {
try {
    if(req.body.subtopic!='All'){
    var part=" and question_subtopic.subtopic_id="+req.body.subtopic;  
    }else{
        var part='';
    }
    var Getques = "select question_master_id,question_master_desc,question_master_type,question_type_name,question_master_subject_id,question_master_level_id,question_level_name, subject_master_id,subject_master_name,topic_master_id,topic_master_name,tag_name,subtopic_master_name from question_master,subject_master,question_tag,question_topic, topic_master,subtopic_master,question_subtopic,question_type,question_level where subject_master.subject_master_id="+req.body.subjectid+"  and question_topic.topic_id="+req.body.topicid+"   "+part+" and question_master_type="+req.body.type+"   and question_level.question_level_id=question_master.question_master_level_id and question_type.question_type_id=question_master.question_master_type and question_tag .question_id=question_master.question_master_id  and subject_master.subject_master_id=question_master.question_master_subject_id and question_topic.topic_id=topic_master.topic_master_id and question_topic.question_id=question_master.question_master_id  and question_subtopic.question_id=question_master.question_master_id  and question_subtopic.subtopic_id=subtopic_master.subtopic_master_id  order by subject_master.subject_master_id,topic_id,question_master_type LIMIT 10 OFFSET "+req.body.page;
    // console.log(Getques); return false;
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
            console.log('test',err);
            // res.send("Unbale to get the students details ");
        } else {
            var qidobj = [];
            for (var a = 0; a < result.length; a++) {
                result[a]['selected']=false;
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
//Count Question no
router.post('/:type', async (req, res) => {
    try {
        if(req.body.subtopic!='All'){
        var part=" and question_subtopic.subtopic_id="+req.body.subtopic;  
        }else{
            var part='';
        }
        var Getques = "select count(*) as qcount from question_master,subject_master,question_tag,question_topic, topic_master,subtopic_master,question_subtopic,question_type,question_level where subject_master.subject_master_id="+req.body.subjectid+"  and question_topic.topic_id="+req.body.topicid+"   "+part+" and question_master_type="+req.body.type+"   and question_level.question_level_id=question_master.question_master_level_id and question_type.question_type_id=question_master.question_master_type and question_tag .question_id=question_master.question_master_id  and subject_master.subject_master_id=question_master.question_master_subject_id and question_topic.topic_id=topic_master.topic_master_id and question_topic.question_id=question_master.question_master_id  and question_subtopic.question_id=question_master.question_master_id  and question_subtopic.subtopic_id=subtopic_master.subtopic_master_id  order by subject_master.subject_master_id,topic_id,question_master_type";
        // console.log(Getques); return false;
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
                console.log(err);
                // res.send("Unbale to get the students details ");
            }else{
                res.send({
                    "Message":'Questions Found',                
                    "data":result
                })
            }
        })
    
    
    
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});
module.exports = router