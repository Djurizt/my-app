const express = require('express')
const router = express.Router()
const {createNewUser, Login} = require('../controllers/users')

router.post('/user/create', createNewUser)
router.post('/user/login', Login)

module.exports= router
