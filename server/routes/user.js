const { Router } = require("express");

const router = Router();

const userController = require("../controllers/userController");

const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('assets/usersPhoto'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

const load = multer({storage})

router.post("/register", load.single('file0'), userController.register);
router.post("/login", userController.login);
router.put("/edit/:id", load.single('file0'), userController.edit);

module.exports = router;