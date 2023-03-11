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

formElem.onsubmit = async (e) => {
    loading.style.display = "";
    e.preventDefault();
    let timeLimit = 180000; //3 mins
    let failureValue = null
    let response = await fulfillWithTimeLimit(timeLimit, fetch('/formHandling', {
      method: 'POST',
      body: new FormData(formElem)
    }), failureValue);
    // let response = await fetch('/formHandling', {
    //   method: 'POST',
    //   body: new FormData(formElem)
    // });
    if(response == null){
      alert("Timeout exceeded.")
      loading.style.display = "none";
      return;
    }
    if(response.status==200){
      imageBlob = await response.blob();
      container = document.getElementById('receive-image');
     setImage(imageBlob,container);
     save_button.disabled = false;
     saveDB_button.disabled = false;
     save_button.onclick = download("a",URL.createObjectURL(imageBlob),"face.png");
    }
    else{
      alert("Something wrong with request.");
      console.log(response.text())
      loading.style.display = "none";
      return;
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
      alert("Something wrong with request.");
      console.log(response.text())
      loading.style.display = "none";
      return;
    }
    loading.style.display = "none";
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

    async function fulfillWithTimeLimit(timeLimit, task, failureValue){
      let timeout;
      const timeoutPromise = new Promise((resolve, reject) => {
          timeout = setTimeout(() => {
              resolve(failureValue);
          }, timeLimit);
      });
      const response = await Promise.race([task, timeoutPromise]);
      if(timeout){ 
          clearTimeout(timeout);
      }
      return response;
  }

  // function goToRecords(){
  //   window.location.replace("\\records");
  // }
