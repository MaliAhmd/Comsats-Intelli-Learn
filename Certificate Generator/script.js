var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var nameInput = document.getElementById('name')
var downloadBtn = document.getElementById('download-btn')

var image = new Image()
image.crossOrigin="anonymous";
image.src = 'certificate.png'
image.onload = function () {
	drawImage()
}

function drawImage() {
	// ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
	ctx.font = '40px Vollkorn'
	ctx.fillStyle = 'black'
	var textWidth = ctx.measureText(nameInput.value).width;

    // Calculate the x-coordinate for centering the text form left marjin to right marjin
    var centerX = (canvas.width - textWidth) / 2;
    var centerYAbove = 320; // Adjust as needed name position center

    // Draw the text above the line
    ctx.fillText(nameInput.value, centerX, centerYAbove);

    // Draw the text below the line
    // ctx.fillText(nameInput.value, centerX, centerYBelow);

}

nameInput.addEventListener('input', function () {
	drawImage()
})

downloadBtn.addEventListener('click', function () {
    // Scale the canvas to desired size
    var scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = 2000;
    scaledCanvas.height = 1414;
    var scaledCtx = scaledCanvas.getContext('2d');
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

	downloadBtn.href = canvas.toDataURL('image/png')
	downloadBtn.download = 'Certificate - ' + nameInput.value
})