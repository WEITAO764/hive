function registerType(){
    var val=document.getElementById("registertype").value;
    if(val==1){
    document.getElementById("clinicblock").style.display = "block";
    }
    else if(val==0){
        document.getElementById("clinicblock").style.display = "none";
    }
}

function loginType(){
    var val=document.getElementById("logintype").value;
    alert(val);
    localStorage.setItem("user",val);
}
function getUser(){
    alert(localStorage.getItem("user"));
    return "user";
}

function setID(dID,pID){   
   localStorage.setItem("d",dID);
   localStorage.setItem("p",pID);
}
function getID(){
    document.getElementById("patientID").value=localStorage.getItem("p");
    document.getElementById("doctorID").value=localStorage.getItem("d");
}
function setbookingID(bID){   
    localStorage.setItem("b",bID);
 }
 function getbookingID(){
    document.getElementById("bookingID").value=localStorage.getItem("b");
}

