const saveOri_button = document.querySelector("#saveOriImage");
const saveGen_button = document.querySelector("#saveGenImage");
const saveReal_button = document.querySelector("#saveRealImage");
let image_input = document.querySelector("#real-image-input");
const id= document.title;
document.addEventListener("DOMContentLoaded", async function() {
    saveGen_button.disabled = true;
    saveOri_button.disabled = true;
    saveReal_button.disabled = true;
    
    formElem.onsubmit = async (e) => {
        e.preventDefault();
        response = await fetch(`/updateRealImg/${id}`, {
        method: 'POST',
        body: new FormData(formElem)
        });
        if (response=200){
        alert("Save successfull.");
        }
    }

    image_input.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
        const uploaded_image = reader.result;
        document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
        });
        reader.readAsDataURL(this.files[0]);
        submitReal_button.disabled = false;
    });

    let response = await fetch(`/getImage/ori/${id}`, {method: 'GET'});
        if(response.status==200){
        var imageBlob = await response.blob();
        const container = document.getElementById('ori-image');
        setImage(imageBlob,container);
        saveOri_button.onclick = download(container.firstChild.src,"a","SketchImage"+id+".png");
        saveOri_button.disabled = false;
        }    
    response = await fetch(`/getImage/gen/${id}`, {method: 'GET'});
        if(response.status==200){
        var imageBlob = await response.blob();
        const container = document.getElementById('gen-image');
        setImage(imageBlob,container);
        saveGen_button.onclick = download(container.firstChild.src,"b","GenerateImage_"+id+".png");
        saveGen_button.disabled = false;
        }
    response = await fetch(`/getImage/real/${id}`, {method: 'GET'});
        if(response.status==200){
        image_input.style.display = "none";
        document.getElementById("submit-real-img").style.display = "none";
        var imageBlob = await response.blob();
        const container = document.getElementById('display-image');
        setImage(imageBlob,container);
        saveReal_button.onclick = download(container.firstChild.src,"c","RealImage_"+id+".png");
        saveReal_button.disabled = false;
        }
        else{
        saveReal_button.style.display = "none";
        }  
    const saveAll=document.getElementById("saveAll");
    saveAll.onclick = function(){
        console.log(typeof saveGen_button.onclick);
        if(typeof saveGen_button.onclick == "object") {
        
        saveGen_button.click();
        }
        if(typeof saveOri_button == "object"){
        saveOri_button.click();
        }
        if(typeof saveReal_button == "object"){
        saveReal_button.click();
        }
    }
  });


function setImage(imageBlob,container){
    imageObjectURL = URL.createObjectURL(imageBlob);
    const rImage = document.createElement('img');
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
    var a = document.getElementById(idhref);
    a.href=url;
    a.download = name;
}
