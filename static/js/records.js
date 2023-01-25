var saveOri_button; 
var saveGen_button;
var saveReal_button;
var newWindow;
function show() {
    var rowId = window.event.target.parentNode.parentNode.id;
    var data = document.getElementById(rowId).querySelectorAll(".row-data"); 
    var id = data[0].innerHTML;
    newWindow = open('/detail', 'details','width=600,height=300');
    newWindow.focus();
    newWindow.onload = async function() {
        saveOri_button = newWindow.document.querySelector("#saveOriImage");
        saveGen_button = newWindow.document.querySelector("#saveGenImage");
        saveReal_button = newWindow.document.querySelector("#saveRealImage");
        saveGen_button.disabled = true;
        saveOri_button.disabled = true;
        saveReal_button.disabled = true;
        let image_input = newWindow.document.querySelector("#real-image-input");
        newWindow.formElem.onsubmit = async (e) => {
          e.preventDefault();
          response = await fetch(`/updateRealImg/${id}`, {
            method: 'POST',
            body: new FormData(newWindow.formElem)
          });
          if (response=200){
            newWindow.alert("Save successfull.");
          }
        }

        image_input.addEventListener("change", function() {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            const uploaded_image = reader.result;
            newWindow.document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
          });
          reader.readAsDataURL(this.files[0]);
          submitReal_button.disabled = false;
        });

        let response = await fetch(`/getImage/ori/${id}`, {method: 'GET'});
          if(response.status==200){
            var imageBlob = await response.blob();
            const container = newWindow.document.getElementById('ori-image');
            setImage(imageBlob,container);
            saveOri_button.onclick = download(container.firstChild.src,"a","OriginalFace.png");
            saveOri_button.disabled = false;
          }    
        response = await fetch(`/getImage/gen/${id}`, {method: 'GET'});
          if(response.status==200){
           var imageBlob = await response.blob();
           const container = newWindow.document.getElementById('gen-image');
           setImage(imageBlob,container);
           saveGen_button.onclick = download(container.firstChild.src,"b","GenerateFace.png");
           saveGen_button.disabled = false;
          }
        response = await fetch(`/getImage/real/${id}`, {method: 'GET'});
          if(response.status==200){
            image_input.style.display = "none";
            newWindow.document.getElementById("submit-real-img").style.display = "none";
            var imageBlob = await response.blob();
            const container = newWindow.document.getElementById('display-image');
            setImage(imageBlob,container);
            saveReal_button.onclick = download(container.firstChild.src,"c","RealFace.png");
            saveReal_button.disabled = false;
          }
          else{
            saveReal_button.style.display = "none";
          }  
      };  
    var timer = setInterval(function() {   
      if(newWindow.closed) {  
          clearInterval(timer);  
          location.reload();  
      }  
    }, 1000); 
    
}
function setImage(imageBlob,container){
  imageObjectURL = URL.createObjectURL(imageBlob);
  const rImage = newWindow.document.createElement('img');
  rImage.src = imageObjectURL;
  rImage.style.width = "256px";
  rImage.style.height = "256px";
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(rImage);
  return null;
}

function download(url,idhref,name) {
  var a = newWindow.document.getElementById(idhref);
  a.href=url;
  a.download = name;
}

function goToHome(){
  window.location.replace("\\");
}
function reload(e)
{
  var source = e.src;
  e.src = source;
}

