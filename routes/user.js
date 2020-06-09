
const router = require('express').Router();
const userRoutes = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/', userRoutes.signup); // user signup route & logic
router.post('/login', userRoutes.login); // user login route & logic
router.put('/:id', auth, userRoutes.updateUser); // user update route & logic
router.delete('/:id', auth, userRoutes.deleteUser); // delete user route & logic

module.exports = router;
