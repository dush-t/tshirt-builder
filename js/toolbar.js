// import * as actions from "./canvas";

const mountContent = i => {
  parentDiv.innerHTML = "";
  // console.log("works");
  switch (i) {
    case 1:
      let title1 = addHeading(i - 1);
      parentDiv.appendChild(title1);
      parentDiv.appendChild(page1);
      break;

    case 2:
      let title2 = addHeading(i - 1);
      parentDiv.appendChild(title2);
      parentDiv.appendChild(page2);
      break;

    case 3:
      let title3 = addHeading(i - 1);
      parentDiv.appendChild(title3);
      parentDiv.appendChild(page3);
      break;

    default:
      break;
  }
};

const headers = [
  "Add Text",
  "Add Image",
  "Add SVG",
  "Choose your product colors",
  "Name and numbers",
  "Notes"
];

const addHeading = i => {
  let header = document.createElement("div");
  header.classList.add("header");
  header.innerHTML = headers[i];

  return header;
};

//  --------- add text ------
const page1 = document.createElement("div");
page1.classList.add("page1");
page1.innerHTML = `
<div class="page1">
    <input type="text" placeholder="Enter text here" class="page1-input">
    <button onclick="addText(document.getElementsByClassName('page1-input')[0].value, {})">Add to Design</button>
</div>
`;

// --------- add image --------
const page2 = document.createElement("div");
page2.classList.add("page1");
page2.innerHTML = `
<div class="page1">
    <input type="text" placeholder="Enter url here" class="page2-input">
    <button onclick="addImage(document.getElementsByClassName('page2-input')[0].value,1)">Add to Design</button>
</div>
`;

// ------------ add svg ---------
const page3 = document.createElement("div");
page3.classList.add("page1");
page3.innerHTML = `
<div class="page1">
    <input type="text" placeholder="Enter url here" class="page2-input">
    <button onclick="addSVG(document.getElementsByClassName('page2-input')[0].value)">Add to Design</button>
</div>
`;

// --------------------------

const parentDiv = document.getElementsByClassName("content")[0]; // parent div in which all content has to be appended

const tools = []; // array of all tools
for (let i = 1; i < 7; i++) {
  let tool = document.getElementById(`${i}`);
  // console.log(tool);
  tools.push(tool);
  tool.addEventListener("click", () => mountContent(i));
}

// ------------------- Undo/Redo functionality

const undoButton = document.getElementsByClassName("undo-button")[0];
const redoButton = document.getElementsByClassName("redo-button")[0];

undoButton.setAttribute("onclick", "undo()");
redoButton.setAttribute("onclick", "redo()");
