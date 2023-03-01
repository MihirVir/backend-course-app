const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "templates/")
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `${file.originalname.replace(/\s/g,"").substring(0, 4)}-${Date.now()}-${req.user.id}.${ext}`);
    }
}) 
    
const uploadImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png"){
            cb(null, true)
        } else {
            console.log("only jpeg/jpg/png allowed");
            cb(null, false)
        }
    }, 
    limits: {
        fileSize: 1024 * 1024 * 1024 * 1024 * 4
    }
})

module.exports = uploadImage;