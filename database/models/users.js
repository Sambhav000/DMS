const mongoose = require("mongoose");
module.exports.userRoleEnums = {
    admin: 1,
    employee: 2
  }

  const userSchema = new mongoose.Schema({
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
        type: String
      },
      Gender: {
        type: String,
        required: true,
      },
      
      Email:{
      type: String,
      required:true,
      unique:true
    },
    Password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isVerified:{
      type: Boolean,
      required: true,
      default: false
    },
    userType:
    {
      type:Number,
      required:true
    }
  },
  { timestamps: true }
  );

  const userModel = mongoose.model('user', userSchema);

module.exports.model = userModel;