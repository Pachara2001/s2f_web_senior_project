function show() {
    var rowId = window.event.target.parentNode.parentNode.id;
    var data = document.getElementById(rowId).querySelectorAll(".row-data"); 
    var id = data[0].innerHTML;
    let newWindow = open('/detail', 'details','width=600,height=300');
    newWindow.focus();
    newWindow.onload = async function() {
        let response = await fetch(`/getImage/ori/${id}`, {method: 'GET',});
          if(response.status==200){
            var imageBlob = await response.blob();
            rImage = setImage(imageBlob);
            const container = newWindow.document.getElementById('display-image');
            container.appendChild(rImage);
          };    
        response = await fetch(`/getImage/gen/${id}`, {method: 'GET',});
          if(response.status==200){
           var imageBlob = await response.blob();
           rImage = setImage(imageBlob);
           const container = newWindow.document.getElementById('receive-image');
           container.appendChild(rImage);
      };    
}
function setImage(imageBlob){
  imageObjectURL = URL.createObjectURL(imageBlob);
  const rImage = newWindow.document.createElement('img');
  rImage.src = imageObjectURL;
  rImage.style.width = "256px";
  rImage.style.height = "256px";
  return rImage;
}

}