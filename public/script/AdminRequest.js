var RequestScreen = document.getElementById("requestscreen");

function onLoad(){
    GetAllPreviousRequest(function(users){
        users.forEach(function(user){
            addRequestToDisPlay(user);
          })
    })
}

onLoad()


//function that gets the product from the database
function GetAllPreviousRequest(callback){
    var request = new XMLHttpRequest;
    request.open("get","/admin/getAllRequests");
    request.send();
    request.addEventListener("load",function(){
   var user = JSON.parse(request.responseText);
   callback(user);
    })
  }

  function addRequestToDisPlay(emprequest){
    var br = document.createElement("br");
    RequestScreen.appendChild(br);

    var div = document.createElement("div");
    div.setAttribute("id",emprequest._id);
    RequestScreen.appendChild(div);

var fieldset = document.createElement("fieldset");
div.appendChild(fieldset);

  var nameLabel = document.createElement("h4");
  nameLabel.innerHTML = "First Name : " +emprequest.FirstName;
  fieldset.appendChild(nameLabel);

  var LastNameLabel = document.createElement("h4");
  LastNameLabel.innerHTML = "Last Name : "+emprequest.LastName;
  fieldset.appendChild(LastNameLabel);

  var Email = document.createElement("h4");
  Email.innerHTML= "Email : "+emprequest.Email
  fieldset.appendChild(Email);

  var AcceptButton = document.createElement("button");
  AcceptButton.innerHTML = "Accept";
  fieldset.appendChild(AcceptButton);

  var rejectButton = document.createElement("button");
  rejectButton.innerHTML="Reject";
  fieldset.appendChild(rejectButton);

  //Event Listener on Buttons

  rejectButton.addEventListener("click",function(event){

    RemoveFromDataBase(emprequest);
RequestScreen.removeChild(div);
    
  })
  AcceptButton.addEventListener("click",function(e){
     VerifyUser(emprequest); 
    RequestScreen.removeChild(div);

  })

}

function VerifyUser(emprequest){
    var userID = {userId:emprequest._id}
    var request = new XMLHttpRequest();
  request.open("put","/admin/getAllRequests");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(userID));
  request.addEventListener("load",function(){
    console.log("updated");
  })
}

function RemoveFromDataBase(user){
    var userID = {userId:user._id}
    var request = new XMLHttpRequest();
  request.open("delete","/admin/getAllRequests");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(userID));
  request.addEventListener("load",function(){
    console.log("deleted");
  })

}