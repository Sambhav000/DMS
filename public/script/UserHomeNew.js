

var FolderScreen = document.getElementById("FolderScreen");
var mainDiv = document.getElementById("mainscreen");
onLoad();
function onLoad(){
    GetAllFolders(function(folders){
        
        folders.forEach(function(folder){
            addFolderToDisplay(folder);
          })
    })
}

function GetAllFolders(callback){
    var request = new XMLHttpRequest;
    request.open("get","/CreateFolder");
    request.send();
    request.addEventListener("load",function(){
   var files = JSON.parse(request.responseText);
       callback(files);
    })
}

function addFolderToDisplay(folder){
    var br = document.createElement("br");
    FolderScreen.appendChild(br);

    var div = document.createElement("div");
    div.setAttribute("id",folder._id);
    FolderScreen.appendChild(div);

    div.style.backgroundColor = "grey";
    div.style.padding = "3px";
    div.style.borderRadius ="10px";

    var fieldset = document.createElement("fieldset");
div.appendChild(fieldset);

var FolderName = document.createElement("h5");
FolderName.innerHTML = "File Name : "+folder.FolderName;
fieldset.appendChild(FolderName);

var FolderDescription = document.createElement("h5");
FolderDescription.innerHTML = "File Description : "+folder.FolderDescription;
fieldset.appendChild(FolderDescription);

var CreatedBy = document.createElement("h5");
CreatedBy.innerHTML = "Created By : "+folder.CreatedBy;
fieldset.appendChild(CreatedBy);

var OpenButton = document.createElement("button");
OpenButton.innerHTML = "Open Folder";
fieldset.appendChild(OpenButton);

var DeleteButton = document.createElement("button");
DeleteButton.innerHTML = "Delete";
fieldset.appendChild(DeleteButton);

DeleteButton.addEventListener("click",function(event){   
    var deleteFolderCon = confirm("Are you sure you want to delete this folder");
    if(deleteFolderCon){
        RemoveFromDataBase(folder);
        FolderScreen.removeChild(div);
    } 

})

OpenButton.addEventListener("click",function(event){
    DisplayFolderFiles(folder)
})

}

function DisplayFolderFiles(folder){    
    mainDiv.innerHTML = "";
    CreateUploadArea(folder);
    LoadFolderFiles(folder);
}
function LoadFolderFiles(folder){
    var FolderArray = folder.Files;
    var FileScreen = document.createElement("div");    
    mainDiv.appendChild(FileScreen);
    FolderArray.forEach(function(files){
        AddFilesToDisplay(FileScreen,files,folder);
    })
}

function AddFilesToDisplay(FileScreen,file,folder){
    var br = document.createElement("br");
    FileScreen.appendChild(br);
    var div = document.createElement("div");
    div.setAttribute("id",file.FileID);
    FileScreen.appendChild(div);

    div.style.backgroundColor = "grey";
    div.style.padding = "3px";
    div.style.borderRadius ="10px";

    var fieldset = document.createElement("fieldset");
div.appendChild(fieldset);

var FileName = document.createElement("h5");
FileName.innerHTML = "File Name : "+file.OriginalFileName;
fieldset.appendChild(FileName);

var FileDescription = document.createElement("h5");
FileDescription.innerHTML = "File Description : "+file.FileDescription;
fieldset.appendChild(FileDescription);

var Uploadedby = document.createElement("h5");
Uploadedby.innerHTML = "Original Owner : "+file.CreatedBy;
fieldset.appendChild(Uploadedby);

var LastModifiedBy = document.createElement("h5");
LastModifiedBy.innerHTML = "Last Modified By : "+ file.LastModifiedBy;
fieldset.appendChild(LastModifiedBy); 

var FileOpenButt = document.createElement("button");
FileOpenButt.innerHTML = "Open File";
fieldset.appendChild(FileOpenButt);

var FileUpdateButt = document.createElement("button");
FileUpdateButt.innerHTML = "Update File";
fieldset.appendChild(FileUpdateButt);

var FileDeleteButt = document.createElement("button");
FileDeleteButt.innerHTML = "Delete File";
fieldset.appendChild(FileDeleteButt);

FileOpenButt.addEventListener("click",function(event){
    window.location.href = file.FileName;
})
FileDeleteButt.addEventListener("click",function(e){
    var deletecon = confirm("Are you sure you want to delete the files ");
    if(deletecon){
        var FolderId = folder._id;
        var FileId = file.FileID;
        var currentArray = folder.Files;
        for(var i =0;i<currentArray.length;i++){
            if(currentArray[i].FileID===FileId){
               currentArray.splice(i,1);
            }
        }
        var obj = {
            FolderId :FolderId,
            Files: currentArray 
        }
        var request= new XMLHttpRequest();
        request.open("delete","/files");
        request.setRequestHeader("Content-type","application/json");
        request.send(JSON.stringify(obj));
        
        request.addEventListener("load",function(){
            var newFolder = JSON.parse(request.responseText);
        
              DisplayFolderFiles(newFolder);
        })
    }

})

FileUpdateButt.addEventListener("click",function(e){
    var display = event.target.parentNode;
    display.innerHTML= "";

    var FileNameLabel = document.createElement("label");
    FileNameLabel.innerHTML = "File Name : ";
    display.appendChild(FileNameLabel);

    var FileNameInput = document.createElement("input");
    FileNameInput.value = file.OriginalFileName;
    FileNameLabel.appendChild(FileNameInput);

    var FileDescriptionLabel = document.createElement("label");
    FileDescriptionLabel.innerHTML = "File Description : ";
    display.appendChild(FileDescriptionLabel);

    var FileDescriptionInput = document.createElement("input");
    FileDescriptionInput.value = file.FileDescription;
    FileDescriptionLabel.appendChild(FileDescriptionInput);

    var FileUploadLabel = document.createElement("label");
    FileUploadLabel.innerHTML = "Choose Updated File : "
    display.appendChild(FileUploadLabel);

    var FileUploadInput = document.createElement("input");
    FileUploadInput.setAttribute("type","file");
FileUploadLabel.appendChild(FileUploadInput);

var SubmitButton = document.createElement("button");
SubmitButton.innerHTML = "Submit";
display.appendChild(SubmitButton);

SubmitButton.addEventListener("click",function(e){
    if(FileNameInput.value!=""&&FileUploadInput.value!=""){
        var FolderId = folder._id;
    var currentArray = folder.Files;
    var formData = new FormData();
    var inputFile = FileUploadInput.files[0];
    formData.append("filepdf",inputFile);
    formData.append("FileName",FileNameInput.value);
    formData.append("FileDescription",FileDescriptionInput.value);
    formData.append("FileId",file.FileID);
    formData.append("FolderId",FolderId);
    formData.append("currentArray",JSON.stringify(currentArray));

    var request = new XMLHttpRequest();

    request.open("put","/files");
console.log(formData);
    request.send(formData);

    request.addEventListener("load",function(){
        var newFolder = JSON.parse(request.responseText);
        
        DisplayFolderFiles(newFolder);
        
        })
    }else{
        alert("Please update the required field");
    }
    

})

})

}



function CreateUploadArea(folder)
{

var backButt = document.createElement("button");
backButt.innerHTML = "Go Back"
mainDiv.appendChild(backButt);

backButt.addEventListener("click",function(e){
    window.location.reload();
})

var fileFieldsetDiv = document.createElement("div");
mainDiv.appendChild(fileFieldsetDiv);

var fileFieldSet = document.createElement("fieldset");
fileFieldsetDiv.appendChild(fileFieldSet);

var fileHead = document.createElement("h3");
fileHead.innerHTML = "Upload New Files"
fileFieldSet.appendChild(fileHead);

var fileNamelabel = document.createElement("label");
fileNamelabel.innerHTML = " File Name : ";
fileFieldSet.appendChild(fileNamelabel);

var fileNameInput = document.createElement("input");
fileNamelabel.appendChild(fileNameInput);

var fileDesLabel = document.createElement("label");
fileDesLabel.innerHTML = " File Description : ";
fileFieldSet.appendChild(fileDesLabel);

var fileDesInput = document.createElement("input");
fileDesLabel.appendChild(fileDesInput);

var addFileLabel = document.createElement("label");
addFileLabel.innerHTML = " Upload File : "
fileFieldSet.appendChild(addFileLabel);

var uploadFileInput = document.createElement("input");
uploadFileInput.setAttribute("type","file");
addFileLabel.appendChild(uploadFileInput);

var UploadFileButton = document.createElement("button");
UploadFileButton.innerHTML = "Upload";
fileFieldSet.appendChild(UploadFileButton);

UploadFileButton.addEventListener("click",function(event){
if(fileNameInput.value!=""&&uploadFileInput.value!=""){
   var folderId = folder._id;
  var formData = new FormData();
  var inputFile = uploadFileInput.files[0];
  formData.append("filepdf",inputFile);
  console.log(folder.Files);
  formData.append("currentobj",JSON.stringify(folder.Files));
  formData.append("folderid",folderId);
  formData.append("FileName",fileNameInput.value);
  formData.append("FileDescription",fileDesInput.value);
 
  var request = new XMLHttpRequest();
  request.open("post","/files");

  request.send(formData);

  request.addEventListener("load",function(){
      var newFolder = JSON.parse(request.responseText);

      DisplayFolderFiles(newFolder);
      
  })
}else{
    alert("Please Fill The Required Fields");
}
})

}

function RemoveFromDataBase(folder){
    var folderID = {folderId:folder._id}
    var request = new XMLHttpRequest();
  request.open("delete","/CreateFolder");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(folderID));
  request.addEventListener("load",function(){
    console.log("deleted");
  })
}