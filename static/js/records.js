var saveOri_button; 
var saveGen_button;
var saveReal_button;
var newWindow;

// getPagination('#table-id');

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
    // var timer = setInterval(function() {   
    //   if(newWindow.closed) {  
    //       clearInterval(timer);  
    //       location.reload();  
    //   }  
    // }, 1000); 
    
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

// function getPagination(table) {
//   var lastPage = 1;

//   $('#maxRows')
//     .on('change', function(evt) {
//       //$('.paginationprev').html('');						// reset pagination

//      lastPage = 1;
//       $('.pagination')
//         .find('li')
//         .slice(1, -1)
//         .remove();
//       var trnum = 0; // reset tr counter
//       var maxRows = parseInt($(this).val()); // get Max Rows from select option

//       if (maxRows == 5000) {
//         $('.pagination').hide();
//       } else {
//         $('.pagination').show();
//       }

//       var totalRows = $(table + ' tbody tr').length; // numbers of rows
//       $(table + ' tr:gt(0)').each(function() {
//         // each TR in  table and not the header
//         trnum++; // Start Counter
//         if (trnum > maxRows) {
//           // if tr number gt maxRows

//           $(this).hide(); // fade it out
//         }
//         if (trnum <= maxRows) {
//           $(this).show();
//         } // else fade in Important in case if it ..
//       }); //  was fade out to fade it in
//       if (totalRows > maxRows) {
//         // if tr total rows gt max rows option
//         var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
//         //	numbers of pages
//         for (var i = 1; i <= pagenum; ) {
//           // for each page append pagination li
//           $('.pagination #prev')
//             .before(
//               '<li data-page="' +
//                 i +
//                 '" class="list-group-item">\
// 								  <span>' +
//                 i++ +
//                 '<span class="sr-only"></span></span>\
// 								</li>'
//             )
//             .show();
//         } // end for i
//       } // end if row count > max rows
//       $('.pagination [data-page="1"]').addClass('active'); // add active class to the first li
//       $('.pagination li').on('click', function(evt) {
//         // on click each page
//         evt.stopImmediatePropagation();
//         evt.preventDefault();
//         var pageNum = $(this).attr('data-page'); // get it's number

//         var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

//         if (pageNum == 'prev') {
//           if (lastPage == 1) {
//             return;
//           }
//           pageNum = --lastPage;
//         }
//         if (pageNum == 'next') {
//           if (lastPage == $('.pagination li').length - 2) {
//             return;
//           }
//           pageNum = ++lastPage;
//         }

//         lastPage = pageNum;
//         var trIndex = 0; // reset tr counter
//         $('.pagination li').removeClass('active'); // remove active class from all li
//         $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
//         // $(this).addClass('active');					// add active class to the clicked
// 	  	limitPagging();
//         $(table + ' tr:gt(0)').each(function() {
//           // each tr in table not the header
//           trIndex++; // tr index counter
//           // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
//           if (
//             trIndex > maxRows * pageNum ||
//             trIndex <= maxRows * pageNum - maxRows
//           ) {
//             $(this).hide();
//           } else {
//             $(this).show();
//           } //else fade in
//         }); // end of for each tr in table
//       }); // end of on click pagination list
// 	  limitPagging();
//     })
//     .val(5)
//     .change();

//   // end of on select change

//   // END OF PAGINATION
// }

// function limitPagging(){
// 	// alert($('.pagination li').length)

// 	if($('.pagination li').length > 7 ){
// 			if( $('.pagination li.active').attr('data-page') <= 3 ){
// 			$('.pagination li:gt(5)').hide();
// 			$('.pagination li:lt(5)').show();
// 			$('.pagination [data-page="next"]').show();
// 		}if ($('.pagination li.active').attr('data-page') > 3){
// 			$('.pagination li:gt(0)').hide();
// 			$('.pagination [data-page="next"]').show();
// 			for( let i = ( parseInt($('.pagination li.active').attr('data-page'))  -2 )  ; i <= ( parseInt($('.pagination li.active').attr('data-page'))  + 2 ) ; i++ ){
// 				$('.pagination [data-page="'+i+'"]').show();

// 			}

// 		}
// 	}
// }
