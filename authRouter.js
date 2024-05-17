const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/register', [
  check('username', "Username is required").not().isEmpty(),
  check('password', "The password must be more than 4 and less than 10 characters").isLength({min: 4, max: 10}),
], controller.register)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['USER', 'ADMIN']), controller.getUsers)

module.exports = router