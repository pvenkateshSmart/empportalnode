const express = require('express')
const router = express.Router()
 

// @desc    Login/Landing page
// @route   GET /
router.get('/status',  (req, res) => {
  res.send('Server is running');
})
 



module.exports = router
