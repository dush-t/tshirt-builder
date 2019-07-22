let canvasWidth = document.querySelector("#fabric-container").clientWidth;
let canvasHeight = document.querySelector("#fabric-container").clientHeight;

let canvas = new fabric.Canvas("mainCanvas");
canvas.setWidth(canvasWidth);
canvas.setHeight(canvasHeight);


/*
    Calculating the scale factor of the canvas' background
    image dynamically to keep the code short.
*/

const backgroundImage = document.querySelector("#tshirt-grey");

const canvasAspect = canvasWidth / canvasHeight;
const imgAspect = backgroundImage.width / backgroundImage.height;

var scaleFactor;
if (canvasAspect >= imgAspect) {
    scaleFactor = 1.1 / (canvasWidth / backgroundImage.width);
} else {
    scaleFactor = 1.1 / (canvasHeight / backgroundImage.height);
}

var center = canvas.getCenter();
canvas.setBackgroundImage('https://www.stickpng.com/assets/images/580b57fbd9996e24bc43bf78.png',
    canvas.renderAll.bind(canvas), {
        top: center.top,
        left: center.left,
        originX: 'center',
        originY: 'center',
        scaleX: scaleFactor,
        scaleY: scaleFactor
    });





var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: "red",
    width: 20,
    height: 20,
    angle: 45
});

canvas.centerObject(rect);

canvas.add(rect);