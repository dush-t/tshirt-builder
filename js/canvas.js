let canvasWidth = document.querySelector("#fabric-container").clientWidth;
let canvasHeight = document.querySelector("#fabric-container").clientHeight;

let canvasStates = []
let stateIndex = -1; // Stores the index of the current canvas state.
let numModifications = 0;

// When true, updateCanvasState will do nothing.
let undo_redo = false; // This is to ensure that it does not interfere 
// with undo and redo operations.

let canvas = new fabric.Canvas("mainCanvas");
canvas.setWidth(canvasWidth);
canvas.setHeight(canvasHeight);


/*
    Calculating the scale factor of the canvas' background
    image dynamically to keep the code short. 1.7 is a magic
    number
*/

const backgroundImage = document.querySelector("#tshirt-grey");

const canvasAspect = canvasWidth / canvasHeight;
const imgAspect = backgroundImage.width / backgroundImage.height;

var scaleFactor;
if (canvasAspect >= imgAspect) {
    scaleFactor = (canvasWidth / backgroundImage.width) / 1.7;
} else {
    scaleFactor = (canvasHeight / backgroundImage.height) / 1.7;
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


const updateCanvasState = () => {
    if (!undo_redo) {
        if (stateIndex < canvasStates.length) {
            uselessStateCount = canvasStates.length - stateIndex + 1;
            canvasStates.splice(stateIndex + 1, uselessStateCount);
        }
        canvasStates.push(JSON.parse(JSON.stringify(canvas)));
        // console.log(canvasStates);
        stateIndex++;
        // console.log(stateIndex);
        numModifications++;
        console.log(stateIndex);
    }
    undo_redo = false;
}

const undo = () => {
    if (stateIndex > 0) {
        undo_redo = true;
        stateIndex--;
        const state = canvasStates[stateIndex];
        canvas.loadFromJSON(state, () => {
            canvas.renderAll();
        });
        console.log(stateIndex);
    }
}

const redo = () => {
    if (stateIndex < canvasStates.length) {
        undo_redo = true;
        stateIndex++;
        const state = canvasStates[stateIndex];
        canvas.loadFromJSON(state, () => canvas.renderAll());
        console.log(stateIndex);
    }
}

const deleteObjects = () => {
    const activeObject = canvas.getActiveObject();
    const activeGroup = canvas.getActiveObjects();
    if (activeObject) {
        canvas.remove(activeObject);
    } else if (activeGroup) {
        const objectsToDelete = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsToDelete.forEach((object) => canvas.remove(object));
    }
}

const mapKeysToActions = () => {
    let eventObject = window.event ? event : e;
    if (eventObject.keyCode == 90 && eventObject.ctrlKey) {
        undo();
        // console.log('lolz')
    } else if (eventObject.keyCode == 89 && eventObject.ctrlKey) {
        redo();
        // console.log('loly')
    } else if (eventObject.keyCode == 46) {
        console.log('lol')
        deleteObjects();
    } else {

    }
}
document.onkeydown = mapKeysToActions;

// For undo-redo functionality
canvas.on('object:added', () => updateCanvasState());
canvas.on('object:modified', () => updateCanvasState());
canvas.on('object:removed', () => updateCanvasState());



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



/*
    Functions to interact with the canvas
*/

// ADD RECTANGLE
// const addRectangle = (color) => {
//     const rect = new fabric.Rect({
//         left: 100,
//         top: 100,
//         fill: color,
//         width: 40,
//         height: 30,
//         angle: 0
//     });
//     canvas.add(rect);
//     canvasStates.push(JSON.stringify(canvas));
// }



// addRectangle("yellow");

// console.log(canvasStates);