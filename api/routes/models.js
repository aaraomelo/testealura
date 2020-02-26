const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()
const crypto = require('crypto')
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const Grid = require('gridfs-stream')
const GridFsStorage = require('multer-gridfs-storage');
const config = require('./config');
const mongoURI = `mongodb+srv://${config.user}:${config.pass}`.concat(
  '@gettingstarted-nd9xn.mongodb.net/alura?retryWrites=true&w=majority')

let models
(async function(){ 
  const client = await mongodb.MongoClient.connect(mongoURI)
  models = client.db('alura').collection('models')
})()

router.post('/obj/upload', async(req,res)=>{
  await models.insertOne({
      fileObject: req.body.fileObject,
      binName:    req.body.binName,
  })
  res.status(201).send()
})

router.get('/obj', async(req, res)=>{
  res.send(await models.find({}).toArray())
})

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') 
            + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
});
const upload = multer({ storage });

router.post('/bin/upload', upload.single("file"), (req,res)=>{
    res.json({ file: req.file})
})

let gfs
const conn = mongoose.createConnection(mongoURI)
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
})

router.get('/bin/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err,file) => {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    })
})

module.exports = router