
var express = require('express');
var users = require('../../controller/user');
var router = express.Router();

router.get('/',users.findByName);
router.get('/create',users.createUser);

module.exports = router;