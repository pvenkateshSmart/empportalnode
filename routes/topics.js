const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
const topicsdatas = require('../models/topicsdatas')
const fs = require('fs'); 
const { resolveNaptr} = require('dns');

const { route} = require('.');
 

//Get Paper Templates list
router.get('/:subjectid', async (req, res) => {
  console.log(req.params.subjectid);
});
 
 
  module.exports = router