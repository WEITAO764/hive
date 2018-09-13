function registerType(){
    var val=document.getElementById("registertype").value;
    if(val==1){
    document.getElementById("clinicblock").style.display = "block";
    }
    else if(val==0){
        document.getElementById("clinicblock").style.display = "none";
    }
}

function book(){
    this.form.elements['doctorID'].value="001";
}

function getID(dID){
alert(dID);
var x=dID;
return x;
}

function setID(){
    alert("i am set ID");
    var y=getID();
    document.getElementById("doctorID").value=y;
}