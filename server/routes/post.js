const router = require('express').Router()
const PostController = require('../controllers/PostController')
const middleware = require("../middlewares/auth");
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('assets/postMedias'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

const load = multer({storage})

// router.post('/create',  middleware.auth, paymentController.createPayment)
router.post('/create', load.array('media', 5), PostController.create)
router.put('/comments/:postId', PostController.comments)
router.put('/likes/:postId', PostController.likes)
router.get('/getPosts', PostController.getPosts)
router.get('/getUserPosts/:userId', PostController.getUserPosts)
router.get('/getPlacePosts/:placeId', PostController.getPlacePosts)
router.put('/editPost/:postId', load.array('media', 5), PostController.editPost)
router.delete('/deletePost/:postId', PostController.deletePost)

module.exports = router