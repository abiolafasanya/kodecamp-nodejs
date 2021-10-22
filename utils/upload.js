const multer = require('multer')
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = uuid()
      cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
  })
  
exports.upload = multer({ storage: storage })