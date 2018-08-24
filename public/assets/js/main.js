function registerType(){
    var val=document.getElementById("registertype").value;
    if(val==1){
    document.getElementById("clinicblock").style.display = "block";
    }
    else if(val==0){
        document.getElementById("clinicblock").style.display = "none";
    }
}