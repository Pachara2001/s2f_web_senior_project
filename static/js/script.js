const image_input = document.querySelector("#image-input");
const save_button = document.querySelector("#saveImage");
const save_bw_button = document.querySelector("#saveBwImage");
const saveDB_button = document.querySelector("#saveDB");
const loading = document.querySelector("#loading");
save_button.disabled = true;
save_bw_button.disabled = true;
saveDB_button.disabled = true;
var imageObjectURL = null;

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});

AbortSignal.timeout ??= function timeout(ms) {
  const ctrl = new AbortController()
  setTimeout(() => ctrl.close(), ms)
  return ctrl.signal
}

formElem.onsubmit = async (e) => {
    loading.style.display = "";
    e.preventDefault();
    try{
      let response =  await fetch('/formHandling', {
      method: 'POST',
      body: new FormData(formElem),
      signal: AbortSignal.timeout(180000),}); // 3 minutes
      if(response.status==200){
        imageBlob = await response.blob();
        container = document.getElementById('receive-image');
        setImage(imageBlob,container);
        save_button.disabled = false;
        saveDB_button.disabled = false;
        save_button.onclick = download("a",URL.createObjectURL(imageBlob),"face.png");
      }
      else{
        throw response.text();
      }
      response = await fetch('/getBwImg', {
        method: 'GET',
      });
      if(response.status==200){
        imageBlob = await response.blob();
        container = document.getElementById('bw-image');
        setImage(imageBlob,container);
        save_bw_button.disabled = false;
        save_bw_button.onclick = download("b",URL.createObjectURL(imageBlob),"BWface.png");
      }
      else{
        throw response.text();
      }
  }
  catch (err){
    if (err.name == 'AbortError'){
      alert("Timeout exceeded.");
    }
    else{
      alert("Something wrong with request.");
      console.log(err);
    }
  }
  finally{
    loading.style.display = "none";
  }
  };



  function download(anchorId,url,filename) {
    var a = document.getElementById(anchorId);
    a.href=url;
    a.download = filename;
  }

  async function saveDB(){
    let response = await fetch('/save_img_to_db', {
      method: 'GET',
    });
    if(response.status==200){
      alert("Saved data to DB successfully.");}
    else{
      alert("saveDB went wrong");
    }
  }

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
