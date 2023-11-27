import express from 'express';
import webUser from '../controllers/userConrtollers.js';
import{ myLogger,verifyToken} from '../middlewares/route.js';
const router = express.Router()

// protected route
router.get('/datadashboard',myLogger)
router.get('/datadashboard',verifyToken)

router.get('/',webUser.homePage)
router.get('/login',webUser.loginPage)
router.post('/login',webUser.userLogin)
router.get('/ragistration',webUser.rsPage)
router.post('/ragistration',webUser.submitData)
router.get('/dashboard',webUser.dsPage)
router.get('/datadashboard',webUser.dataDsPage)
router.get('/edit/:id',webUser.editUsers)
router.post('/update/:id',webUser.updateUser)
router.post('/delete/:id',webUser.deleteUser)
router.get('/logout/:id',webUser.logoutUser)

export default router;