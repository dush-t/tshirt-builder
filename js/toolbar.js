// import * as actions from "./canvas";

const mountContent = i => {
  console.log("works");
  switch (i) {
    case 1:
      parentDiv.innerHTML = "";
      let title = addHeading(i - 1);
      parentDiv.appendChild(title);
      parentDiv.appendChild(page1);
      break;
    default:
      break;
  }
};

const headers = [
  "Add Text",
  "Artwork Categories",
  "Upload",
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

// --------------------------

const parentDiv = document.getElementsByClassName("content")[0]; // parent div in which all content has to be appended

const tools = []; // array of all tools
for (let i = 1; i < 7; i++) {
  let tool = document.getElementById(`${i}`);
  // console.log(tool);
  tools.push(tool);
  tool.addEventListener("click", () => mountContent(i));
}
