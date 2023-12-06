let queuedImagesArray =[],
savedForm = document.querySelector("#saved-form"),
queuedForm = document.querySelector("#queued-form"),
savedDiv = document.querySelector(".saved-div"),
queuedDiv = document.querySelector(".queued-div"),
inputDiv = document.querySelector(".input-div"),
input = document.querySelector(".input-div input"),
serverMessage = document.querySelector(".server-message"),
deleteImages = []

// saved in server images
//queued in frontend images
input.addEventListerner("change", () => {
    const files = input.files
    console.log(files)
})

inputDiv.addEventListener('drop',(e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    console.log(files)
})

function displayQueuedImages(){
    let images =""
    queuedImagesArray.forEach((image, uploadimage) => {
        images += <div class="image">
                  <img src="${URL.createObjectURL(image)}" alt="image">
                   <span onclick="deleteQueuedImage(${index})">&times;</span>
                   </div>
    })
queuedDiv.innerHTML = images
}