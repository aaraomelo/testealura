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
const mongoURI = `mongodb+srv://${config.user}:${config.pass}@gettingstarted-nd9xn.mongodb.net/alura?retryWrites=true&w=majority`
const conn = mongoose.createConnection(mongoURI)
let gfs
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
})

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
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

router.get('/bin/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err,file) => {
        if(!file|| file.length === 0){
            return res.status(404).json({
              err: 'No files exists'
            })
        }
        if(true){
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
        } else {
          res.status(404).json({
            err: 'Not an bin'
          })
        }
    })
})

router.delete('/bin/delete/:filename', (req, res) => {
   gfs.remove({ filename: req.params.filename, root: 'uploads' },(err, gridStore)=>{
     if(err){
       return res.status(404).json({err: err })
     }
     res.status(200).send()
   })
})

router.get('/obj', async(req, res)=>{
  const models = await loadModelsCollection()
  res.send(await models.find({}).toArray())
})

router.post('/obj/upload', async(req,res)=>{
  const models = await loadModelsCollection()
  await models.insertOne({
      binName:    req.body.model.binName,
      fileObject: req.body.model.fileObject,
      createdAt:  new Date()
  })
  res.status(201).send()
})

router.delete('/obj/:id', async (req, res) => {
  const posts = await loadPostsCollection()
  await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)})
  res.status(200).send()
})


async function loadModelsCollection(){
  const client = await mongodb.MongoClient.connect
  (`mongodb+srv://${config.user}:${config.pass}@gettingstarted-nd9xn.mongodb.net/alura?retryWrites=true&w=majority`,{
      useNewUrlParser: true
  })
  return client.db('alura').collection('models')
}

module.exports = router