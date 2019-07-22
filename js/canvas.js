let width = document.querySelector('#fabric-container').clientWidth;
let height = document.querySelector('#fabric-container').clientHeight;
console.log(width);

let canvas = new fabric.Canvas('mainCanvas');
canvas.setWidth(width)
canvas.setHeight(height)



// canvas.setBackgroundImage('https://png2.kisspng.com/sh/fc4ff5ab32a474f66cd6bd7062c1f70d/L0KzQYm3UsA0N5Z6j5H0aYP2gLBuTgBzcZ95fdY2dD32eLr5lL10dJZqjtc2Y3zyhLnwjvcuap1mht02d3jshLa0lL10cJp3jJ99ZX3zfLL7hb1xdpgyTdMCNUTlRYrrVsQ0a2YzSagBNUO8QIG4VcE4PmQ7TKY6OEe6RnB3jvc=/kisspng-printed-t-shirt-sleeve-clothing-blank-white-t-shirt-template-png-5a754b59d643c5.1665390015176364418776.png',
//     canvas.renderAll.bind(canvas), {
//         scaleX: 1,
//         scaleY: 1,
//     })

var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20,
    angle: 45
  });

canvas.add(rect); // add object