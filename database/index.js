const mongoose = require('mongoose');
const userModel = require("./models/users.js")
const FileModel = require("./models/Files.js")
module.exports.init = function()
{
 
  mongoose.connect('mongodb+srv://todo:1234567890@todo.10khx.mongodb.net/DMS?retryWrites=true&w=majority')
  .then(function()
  {
    console.log("DB Is Live")
  })
  .catch(function()
  {
    console.log("error in db connection")
  })
}
module.exports.userModel = userModel;

module.exports.FileModel = FileModel;