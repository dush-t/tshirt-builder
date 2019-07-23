/*
    This file will be used to interact with the canvas. 
    This file SHOULD NOT contain code that makes the UI
    work. Only define functions that directly modify
    the canvas here.
*/

let canvasWidth = document.querySelector("#fabric-container").clientWidth;
let canvasHeight = document.querySelector("#fabric-container").clientHeight;

let canvasStates = []
let stateIndex = -1; // Stores the index of the current canvas state.
let numModifications = 0;

// When true, updateCanvasState will do nothing.
// This is to ensure that it does not interfere 
// with undo and redo operations.
let undo_redo = false;

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


/*
    Add the latest state to canvasStates array, so that
    the information can be used in the future in case the
    user decides to undo/redo. Function will run only
    if the state change is not because of an undo/redo 
    operation. 

    If a user has done an undo operation and then modifies 
    the canvas, all state after that undo is lost (It's not
    a bug. That's how undo/redo works in VS code too.)
*/
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


// Undo a change to canvas
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


// Redo a change to canvas
const redo = () => {
    if (stateIndex < canvasStates.length) {
        undo_redo = true;
        stateIndex++;
        const state = canvasStates[stateIndex];
        canvas.loadFromJSON(state, () => canvas.renderAll());
        console.log(stateIndex);
    }
}


// Delete a selected object or a selected group of objects
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


/*
    Bind which of the above functions are triggered by
    which key stroked
*/
const mapKeysToActions = () => {
    let eventObject = window.event ? event : e;
    if (eventObject.keyCode == 90 && eventObject.ctrlKey) {  // ctrl + z
        undo();
        // console.log('lolz')
    } else if (eventObject.keyCode == 89 && eventObject.ctrlKey) {  // ctrl + y
        redo();
        // console.log('loly')
    } else if (eventObject.keyCode == 46) {  // del
        console.log('lol')
        deleteObjects();
    } else {
        // do nothing if there is no match.
    }
}
document.onkeydown = mapKeysToActions;

/* 
    Make sure updateCanvasState runs WHENEVER the
    canvas is modified. However, updateCanvasState
    will do nothing if undo_redo is true (except
    setting it to false)
*/
canvas.on('object:added', () => updateCanvasState());
canvas.on('object:modified', () => updateCanvasState());
canvas.on('object:removed', () => updateCanvasState());


// Adding a small rectangle for testing
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