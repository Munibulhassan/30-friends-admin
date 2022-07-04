const express = require('express')
const Router = express.Router()
const category = require('../controller/category.js')
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/category/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  var upload = multer({ storage: storage });
const router = ()=>{ 

    Router.post('/',upload.single("file"),category.createcategory)    
    Router.get('/', category.getcategory)        
    Router.patch('/:id', upload.single("file"),category.updatecategory)
    Router.delete('/:id', category.deletecategory)
    
    Router.post('/subcategory',upload.single("file"), category.createsubcategory)    
    Router.get('/subcategory', category.getsubcategory)        
    Router.patch('/subcategory/:id',upload.single("file"), category.updatesubcategory)
    Router.delete('/subcategory/:id', category.deletesubcategory)
    
    Router.post('/brand', upload.single("file"),category.createbrand)    
    Router.get('/brand', category.getbrand)        
    Router.patch('/brand/:id',upload.single("file"), category.updatebrand)
    Router.delete('/brand/:id', category.deletebrand)
    
    
    return Router;
}
module.exports =  router()