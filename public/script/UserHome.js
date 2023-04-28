var FileScreen = document.getElementById("FileScreen");

onLoad();

function onLoad(){
    GetAllFiles(function(files){
        
        files.forEach(function(file){
            addFileToDisPlay(file);
          })
    })
}
function GetAllFiles(callback){
    var request = new XMLHttpRequest;
    request.open("get","/files");
    request.send();
    request.addEventListener("load",function(){
   var files = JSON.parse(request.responseText);
       callback(files);
    })
}

function addFileToDisPlay(file){
    var br = document.createElement("br");
    FileScreen.appendChild(br);

    var div = document.createElement("div");
    div.setAttribute("id",file._id);
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

FileDeleteButt.addEventListener("click",function(event){

    RemoveFromDataBase(file);
    FileScreen.removeChild(div);
    
  })

  FileOpenButt.addEventListener("click",function(event){
    window.location.href = file.FileName;
  })
  FileUpdateButt.addEventListener("click",function(event){
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

var id_file = file._id;

SubmitButton.addEventListener("click",function(event){
    var formData = new FormData();
    var inputFile = FileUploadInput.files[0];
    formData.append("filepdf",inputFile);
    formData.append("FileName",FileNameInput.value);
    formData.append("FileDescription",FileDescriptionInput.value);
    formData.append("FileId",id_file);

    var request = new XMLHttpRequest();
    request.open("put","/files");
    // request.setRequestHeader("Content-type","multipart/form-data");
    request.send(formData);
    console.log(formData);
    request.addEventListener("load",function(){
      
    console.log("updated");
    })
    window.location.reload();
})

  })

}

function RemoveFromDataBase(file){
    var fileID = {fileId:file._id}
    var request = new XMLHttpRequest();
  request.open("delete","/files");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(fileID));
  request.addEventListener("load",function(){
    console.log("deleted");
  })
}