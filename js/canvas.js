/*
    This file will be used to interact with the canvas. 
    This file SHOULD NOT contain code that makes the UI
    work. Only define functions that directly modify
    the canvas here.
*/

let canvasWidth = document.querySelector("#fabric-container").clientWidth;
let canvasHeight = document.querySelector("#fabric-container").clientHeight;

let canvasStates = []
let stateIndex = -2; // Stores the index of the current canvas state.
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
        stateIndex++;
        numModifications++;
        console.log(stateIndex);
    }
}


// Undo a change to canvas
const undo = () => {
    if (stateIndex > 0) {
        undo_redo = true;
        stateIndex--;
        const state = canvasStates[stateIndex];
        canvas.clear();
        canvas.loadFromJSON(state, () => {
            canvas.renderAll();
            undo_redo = false;
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
        canvas.clear();
        canvas.loadFromJSON(state, () => {
            canvas.renderAll();
            undo_redo = false;
        })
        console.log(stateIndex);
    }
}


// Delete a selected object or a selected group of objects
const deleteObjects = () => {
    const activeObject = canvas.getActiveObject();
    const activeGroup = canvas.getActiveObjects();
    console.log(activeGroup)
    if (activeObject && !activeGroup) { // activeObject is truthy even when activeGroup exists.
        canvas.remove(activeObject);
        console.log('activeObject')
    } else if (activeGroup) {
        activeGroup.forEach((object) => {
            console.log('lol')
            canvas.remove(object);
        });
    }
}


/*
    Bind which of the above functions are triggered by
    which key stroked
*/
const mapKeysToActions = () => {
    let eventObject = window.event ? event : e;
    if (eventObject.keyCode == 90 && eventObject.ctrlKey) { // ctrl + z
        undo();
    } else if (eventObject.keyCode == 89 && eventObject.ctrlKey) { // ctrl + y
        redo();
    } else if (eventObject.keyCode == 46) { // del
        deleteObjects();
    } else if (eventObject.keyCode == 32 && eventObject.ctrlKey) { // ctrl + space
        ungroupSVG();
    } else if (eventObject.keyCode == 66 && eventObject.ctrlKey) { // ctrl + b
        groupSVG();
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



const updateObject = (objectToUpdate, updateBody, selectedObject = false) => {
    var targetObject = selectedObject ? canvas.getActiveObject() : objectToUpdate;
    console.log(targetObject);
    targetObject.set({
        ...updateBody
    });
    targetObject.dirty = true;
    canvas.renderAll();
}


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

// canvas.add(rect);

// updateObject(rect, {
//     'width': 100
// });

/*
    Add image to canvas from given url.
    The url can be a local path or a web
    address. Opacity can be specified.
*/
const addImage = (url, opacity) => {
    let img = document.createElement('img');
    img.setAttribute('src', url);
    img.style.display = 'none';
    let imgInstance = new fabric.Image(img, {
        left: 100,
        top: 100,
        opacity: opacity,
    });
    canvas.add(imgInstance);
}


const addSVG = (url) => {
    fabric.loadSVGFromURL(url, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).renderAll();
    })
}

// addSVG('https://upload.wikimedia.org/wikipedia/commons/a/aa/FIFA_logo_without_slogan.svg');

const passFinalStateOnly = (callback) => {
    undo_redo = true;
    canvas.off('object:added');
    canvas.off('object:modified');
    canvas.off('object:removed');
    callback();
    canvasStates.push(canvas.toJSON());
    stateIndex++;
    console.log(stateIndex);
    canvas.on('object:added', () => updateCanvasState());
    canvas.on('object:modified', () => updateCanvasState());
    canvas.on('object:removed', () => updateCanvasState());
    undo_redo = false;
}

/*
    I am disabling the event listeners because toActiveSelection()
    does it's job in a loop and will push multiple states to the 
    canvasStates array if the event listeners are enabled. So what
    I'm doing instead is disabling them for a while and managing
    the state manually. A little risky but meh.
*/
const ungroupSVG = () => {
    passFinalStateOnly(() => {
        const selectedGroup = canvas.getActiveObject();
        if (!selectedGroup || selectedGroup.type !== 'group') {
            console.log('Selected object is not a group');
            return;
        }
        selectedGroup.toActiveSelection();
        canvas.requestRenderAll();
    })
}

// The reverse of ungroupSVG, will also work with a collection
// of fabricjs objects
const groupSVG = () => {
    passFinalStateOnly(() => {
        const selectedGroup = canvas.getActiveObject();
        if (!selectedGroup || selectedGroup.type !== 'activeSelection') {
            console.log('Invalid selection')
            return;
        }
        selectedGroup.toGroup();
        canvas.requestRenderAll();
    })   
}

const setSVGColor = (colorCode) => {
    const selectedObject = canvas.getActiveObject();
    selectedObject.setFill()

}


/*  Just adding this to have some homogeneity
    in the code. IText is just a special kind
    of object that lets the user edit the text
    on canvas.
*/
const addText = (textContent, properties) => {
    let text = new fabric.IText(textContent, {
        ...properties
    });
    canvas.add(text);
}


// addText('Mr_Dush__T', {left: 100, top: 100});
// addImage('https://www.stickpng.com/assets/images/580b57fbd9996e24bc43bf78.png', 1);