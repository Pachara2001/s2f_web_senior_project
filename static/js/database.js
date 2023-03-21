var saveOri_button; 
var saveGen_button;
var saveReal_button;
var newWindow;

function show(id) {
    newWindow = open('/detail/'+id, 'details','width=1150,height=550');
    newWindow.focus();
    var timer = setInterval(function() {   
      if(newWindow.closed) {  
          clearInterval(timer);  
          location.reload();  
      }  
    }, 1000); 
}

function goToHome(){
  window.location.replace("\\");
}
function reload(e)
{
  var source = e.src;
  e.src = source;
}
