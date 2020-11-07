AOS.init();
var currentTab=0;
showTab(currentTab);

function showTab(n){


var x= $(".tab");
 x[n].style.display = "block";
 if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
    $("#nextBtn").click(function(){
    $("#nextBtn").attr("type","submit");
  });
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
}

function change_profile(){
$(".basic").removeAttr('readonly');
$(".basic-save").css("visibility","visible");
$(".upload_image").css("display","block");
$(".basic").removeClass("inputstuff");
$(".displaystuff").addClass("hidedisplaystuff");

}

function displayon(button){
  $(".basic-save").css("visibility","visible");
$(".displaystuff").addClass("hidedisplaystuff");
 if ( button==="universityBTN" ) {
  $(".education").css("display","inline");
  }
}

function upload() {
$("input[type='image']").click(function() {
    $("input[id='my_file']").click();
});
console.log("hello");
}

function edit(){
  $("#content").removeAttr('readonly');
  $("#intro_save").html("Save");
  $("#intro_save").click(function(){
    $("#intro_save").attr("type","submit");
  });
}

function Navigate(n){
	var x= $(".tab");
if(n<0){

}
   else if ( !validation()){
    return false;
   }
	  x[currentTab].style.display = "none";
	   currentTab=currentTab+n;
    if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }

	  showTab(currentTab);

}


$(".signUpPage").ready(function(){
  $("form").bind("keypress",function(e){
    if(e.keyCode==13){
      return false;
    }
  });
});



function validation(){
 var x,y,i, valid=true;
 x=$(".tab");
 y=x[currentTab].getElementsByClassName("required");
for(i=0;i<y.length;i++){
  if(y[i].value===""){
    y[i].className+="invalid";
    valid=false;
  }
}
if(valid){
 valid=true;
}
return valid;
}
