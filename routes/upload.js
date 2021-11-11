var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_ID,
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  region: process.env.S3region
});

// file upload middleware using multer
const uploadS3 = multer({

  storage: multerS3({
    s3: new aws.S3(),
    bucket: 'images',
    acl: 'public-read', // public read access
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  }),

  // filtering files (only images will be allowed)
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);

    if (['.png', '.jpg', '.jpeg'].includes(ext))
      return callback(null, true);

    callback(new Error('Only images are allowed'))
  }

});

// locally upload middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const uploadLocally = multer({ storage: storage })


// only for images (with limit of 10 images)

router.post('', uploadLocally.array('files', 10), function (req, res) {
  urls = req.files.map(a => '/uploads/' + a.filename);
  res.json({ message: 'Images uploaded successfully!', urls });
});


module.exports = router;
