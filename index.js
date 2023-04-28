const { json } = require('express');
const express = require('express');
const app = express();
const port = 4500
const session = require('express-session')
const db = require('./database')
const userModelInstance = db.userModel;
const userModel = userModelInstance.model;
const FileModelInstance = db.FileModel;
const FileModel = FileModelInstance.model;
const UUID = require('uuid');
const userTypeEnums = userModelInstance.userRoleEnums;
var passwordValidator = require('password-validator');
// const { createSecureServer } = require('http2');
// const sendMail = require("./utils/sendMail.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer  = require('multer');
//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+'- '+file.originalname);
    }
  })

  const upload = multer({ storage: storage })
app.use(express.urlencoded());

app.use(express.static("uploads"))

//password validator schema
var passwordSchema = new passwordValidator();
passwordSchema.is().min(8)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(1)
.has().symbols(1)

//SESSION
app.use(session({
    secret: 'keyboard cat',
  }))

//CONNECTION BETWEEN DATABASE
db.init();
app.use(express.static("style"))
//to parse form data
app.use(express.urlencoded())
//to parse json data
app.use(express.json())

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(express.static("script"))
app.get("/",function(req,res){
    if(req.session.isLogged){
        if(req.session.user.isVerified){
            res.render('UserHome.ejs',{user:req.session.user});
        }else{
            res.render("Welcome.ejs");
        }
        
    }else{
        res.redirect("/login");
    }
    
})
app.route("/CreateFolder").post(function(req,res){
    var email = req.session.user.Email;
    var foldername = req.body.FolderName;
    if(req.body.folderdescription!=undefined){
        var folderdescription = req.body.FolderDescription;
        var obj = {
            FolderName: foldername,
            CreatedBy : email,
            FolderDescription: folderdescription,
            Files : []
        }
        FileModel.create(obj).then(function(e){
            console.log(e);
            res.redirect("/")
        }).catch(function(err){
            console.log(err);
        })
    }else{
        var folderdescription= "";
        var obj = {
            FolderName: foldername,
            CreatedBy : email,
            FolderDescription: folderdescription,
            Files : []
        }
        FileModel.create(obj).then(function(e){
            console.log(e);
            res.redirect("/")
        }).catch(function(err){
            console.log(err);
        })
    }
    
 
}).get(function(req,res){

    GetAllFiles(function(files){
        res.json(files);
    })
}).delete(function(req,res){
    var FolderId = req.body.folderId;
    deleteFolder(FolderId);
    res.status(200).end("deleted");
})
app.route("/files").post(upload.single("filepdf"),function(req,res){
        var email = req.session.user.Email;
        var filename = req.file.filename;
        var currentArray = JSON.parse(req.body.currentobj);
        
        var Fileobj ={
            CreatedBy : email,
            FileName :filename,
            LastModifiedBy :email,
            OriginalFileName : req.body.FileName,
            FileDescription : req.body.FileDescription,
            FileID: UUID.v4()
        }
        currentArray.push(Fileobj);
       
FileModel.updateOne({_id:req.body.folderid},{Files:currentArray}).then(function(e){
  FileModel.findOne({_id:req.body.folderid}).then(function(e){
      res.json(e)
  }).catch(function(err){
      console.log(err);
  })
}).catch(function(err){
    console.log(err);
})  
    }).delete(function(req,res){
       var FolderId = req.body.FolderId;
       var newFiles = req.body.Files;


       FileModel.updateOne({_id:FolderId},{Files:newFiles}).then(function(e){
        FileModel.findOne({_id:FolderId}).then(function(e){
            res.json(e)
        }).catch(function(err){
            console.log(err);
        })
      }).catch(function(err){
          console.log(err);
      })  

    }).put(upload.single("filepdf"),function(req,res){
        var email = req.session.user.Email;
        var newfilename = req.file.filename;
        var currentArray = JSON.parse(req.body.currentArray);
        
        for(var i =0 ; i<currentArray.length;i++){
            if(currentArray[i].FileID===req.body.FileId){
                currentArray[i].OriginalFileName = req.body.FileName;
                currentArray[i].FileDescription = req.body.FileDescription;
                currentArray[i].FileName= newfilename;                
                currentArray[i].LastModifiedBy = email;
            }
        }
        FileModel.updateOne({_id:req.body.FolderId},{Files:currentArray}).then(function(e){
            FileModel.findOne({_id:req.body.FolderId}).then(function(e){
                res.json(e);
            }).catch(function(err){
                console.log(err);
            })
        }).catch(function(err){
            console.log(err);
        })
        
        
    })


// app.route("/files").post(upload.single("filepdf"),function(req,res){
//     var email = req.session.user.Email;
//     var filename = req.file.filename;
//     var obj ={
//         FirstName : req.session.user.FirstName,
//         CreatedBy : email,
//         FileName :filename,
//         LastModifiedBy :email,
//         OriginalFileName : req.body.Filename,
//         FileDescription : req.body.Filedescription
//     }
//     FileModel.create(obj).then(function(e){
//         console.log(e);
//         res.redirect("/")
//     }).catch(function(err){
//         console.log(err);
//     })

// }).get(function(req,res){
// GetAllFiles(function(files){
//     res.json(files);
// })
// }).delete(function(req,res){
//     var FileId = req.body.fileId;
//     deleteFile(FileId);
//     res.status(200).end("deleted");
// }).put(upload.single("filepdf"),function(req,res){
//     var filename = req.file.filename;
//     var fileID = req.body.FileId;
//     console.log(filename);
//     console.log(req.body);
//     var obj = {
        
// OriginalFileName: req.body.FileName,
       
// LastModifiedBy: req.session.user.Email, 
// FileDescription : req.body.FileDescription,
// FileName : filename

//     };
//     FileModel.updateOne({_id:fileID},obj).then(function(e){
//         res.end("updated");
//     }).catch(function(err){
//         console.log(err);
//     })

// })
app.route("/login").get(function(req,res){
    res.render("login.ejs",{error:""});
}).post(function(req,res){
     var email = req.body.email;
     var password = req.body.password;
     readuser(email,password,function(user){

        if(user){
            
               req.session.isLogged = true;
               req.session.user = user;
            //    req.session.userId = user.id;
            //    req.session.username=user.username;
            //    req.session.profile = user.filename;
           
               res.redirect("/");
            
           }
           else if(user==null) {
               res.render("login.ejs",{error:"USER NOT FOUND"});
           }
     })
})


app.route("/admin/home").get(function(req,res){
    if(req.session.isLogged){
        if(req.session.user.userType==userTypeEnums.admin){
            console.log("1");
            res.render("adminHome.ejs");
        }else{
            console.log("2");
            req.session.destroy();
            res.redirect("/adminlogin")
        }
    }else{
        console.log("3");
        req.session.destroy();
        res.redirect("/adminlogin")
    }
   
})

app.route("/admin/requests").get(function(req,res){

    if(req.session.isLogged){
        if(req.session.user.userType==userTypeEnums.admin){
            res.render("AdminRequest.ejs");
        }else{
            res.redirect("/adminlogin")
        }
    }else{
        res.redirect("/adminlogin")
    }
    
    
})

app.route("/admin/getAllRequests").get(function(req,res){
    GetAllRequests(function(users){
        console.log(users);
        res.json(users);
          })
    
}).delete(function(req,res){
    var UserId = req.body.userId;
    deleteUser(UserId);
    res.status(200).end("deleted");
}).put(function(req,res){
    var UserId = req.body.userId;
   UpdateVerification(UserId);
})




app.route("/adminlogin").get(function(req,res){
    res.render("adminlogin.ejs",{error:""});
}).post(function(req,res){
     var email = req.body.email;
     var password = req.body.password;
     readuser(email,password,function(user){

        if(user){
            if(user.userType==userTypeEnums.admin){

                req.session.isLogged = true;
               req.session.user = user;
            //    req.session.userId = user.id;
            //    req.session.username=user.username;
            //    req.session.profile = user.filename;
           
               res.redirect("/admin/requests");

            }else{
                res.render("login.ejs",{error:"You do not have access to login as admin"});
            }
               
            
           }
           else if(user==null) {
               res.render("login.ejs",{error:"USER NOT FOUND"});
           }
     })
})

app.route("/signup").get(function(req,res){
    res.render("signup.ejs",{error:""})
}).post(function(req,res){
    var password = req.body.password;
    var reenterpass =  req.body.reenterpass;
    
    //checks if the pasword entered matches or not
    if(password===reenterpass)
    {
        if(passwordSchema.validate(password))
        {
            bcrypt.hash(req.body.password,saltRounds).then(function(hash){
                var obj ={
                    FirstName : req.body.firstname,
                    LastName : req.body.lastname,
                    Gender:req.body.gender,
                    Email: req.body.email,
                    Password: hash,
                    userType : userTypeEnums.employee
                }
                
                createUser(obj,function(user,err){
                if(err){
                    res.render("signup.ejs",{error:err});
                }
                else{
                    if(user){
                        res.render("signup.ejs",{error:"User Already Exist"});
                         
                    }
                    else{
                   res.redirect("/")
                    // verifyEmail(obj);
                                        }
                }
                    
                })
            })
           
        }
        else{
            res.render("signup.ejs",{error:"Password should contain atleast 1 upperCase,1 lowercase, 1 special symbol"});  
        }
    }
    else
    {
        res.render("signup.ejs",{error:"Password Does Not Match"});
    }
 
})

// app.get("/verifyuser/:id",function(req,res){
// 	const userId = req.params.id;
// userModel.updateOne({id:userId}, {isVerified: true }).then(function(){
// 	res.end("verified");
// }).catch(function(){
// 	res.end("error");
// })

// })

//logout
app.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/");
    })


app.listen(port, () => {
	console.log(`Document Management System app listening at http://localhost:${port}`)
})


//fucntions here

function createUser(userDetails,callback){
    
    userModel.findOne({Email:userDetails.Email}).then(function(user){
        if(user){
         callback(user,null);
        }else{
userModel.create(userDetails).then(function(user){
    var objectID = user._id
    callback(null,null);
}).catch(function(err){
    callback(null,err);
})
        }
    })
}

//function that reads the user
function readuser(email,password,callback){

	userModel.findOne({Email:email}).then(function(user){
		if(user)
		{
		bcrypt.compare(password,user.Password).then(function(result) {
    if(result==true)
		{
			callback(user);
		}
		else{
			callback(null);
		}
})}
else{
	callback(null);
}
		//callback(user);
	})
}

//function that gets the product from database
function GetAllRequests(callback){
    userModel.find({
        isVerified: false}).then(function(user){
            
            callback(user);
        })
}
function GetAllFiles(callback){
    FileModel.find({}).then(function(Files){
        callback(Files);
    })
}



// function verifyEmail(obj){
//     console.log(obj);
//     bcrypt.hash(obj.Email,saltRounds).then(function(hash){
//         var html = `<h1> Welcome To Document Management System </h1> <br><h3>Please Verify Your Email Address By Clicking On the Link Below</h3>`+
//         `<a href="http://localhost:${port}/verifyuser/`+hash+`">Verify Now </a>`;
//         sendMail(obj.Email,
//             "Welcome To Document Management System",
//             "Get Started with Document Management System",
//             html,function(error){
//                 if(error){
//                     console.log("Error : "+error);
//                 }
//             })

//     })


// }


function deleteUser(UserId){
    userModel.deleteOne({_id:UserId},function(err){
  if(err){
    console.log(err);
  }
    })
  }

  function deleteFolder(FolderID){
    FileModel.deleteOne({_id:FolderID},function(err){
        if(err){
          console.log(err);
        }
          }) 
  }

  function UpdateVerification(UserId){
      userModel.updateOne({_id:UserId},{isVerified:true}).then(function(err){
          if(err){
              console.log(err);
          }
      })
  }
