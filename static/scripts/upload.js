const images = [];

function imgUpload() {
    const input = document.getElementById('userImage');

    if (input.files.length > 0) {

        const file = input.files[0];

        const reader = new FileReader();
        ReadableStream.onload = function (e) {
            images.push(e.target.result);

            displayImages();
        };
        reader.readAsDataURL(file);

    } else {
        alert('please select an image');
    }

}

function displayImages() {

    const imageContainer = document.getElementById('imageContainer')

    imageContainer.innerHTML = '';

    imageArray.forEach(dataURL => {
        const imgElement = document.createElement('img');
        imgElement.src = dataURL;
        imageContainer.appendChild(imgElement);
    });
console.log('made it here');
}