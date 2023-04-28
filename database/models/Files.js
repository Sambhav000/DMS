const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    CreatedBy:{
      type: String,
      required:true
    },

    FolderName:{
        type: String,
        required:true
      },
      FolderDescription:{
        type: String        
      },
      Files:{
        type: Array
      }

  },
  { timestamps: true }
  );

  const FileModel = mongoose.model('file', FileSchema);

module.exports.model = FileModel;