const SIZE = 256;
let inputImg,
  inputCanvas,
  output,
  statusMsg,
  pix2pix,
  randomBtn,
  clearBtn,
  transferBtn,
  currentStroke;

let presets = [];

function preload() {
  for (let i = 1; i <= 10; i++) {
    presets.push(loadImage(`images/input_${i}.png`));
  }
}

function setup() {
  // Create a canvas for drawing
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class("border-box").parent("input");

  // Load default preset image
  inputImg = presets[4]; // index 4 is input_5.png
  drawImage();

  output = select("#output");
  statusMsg = select("#status");

  currentStroke = 1;
  select("#size").mouseReleased(() => {
    currentStroke = Number(select("#size").value());
  });

  transferBtn = select("#transferBtn");
  transferBtn.attribute("disabled", ""); // Disabled initially

  clearBtn = select("#clearBtn");
  clearBtn.mousePressed(() => {
    clearCanvas();
    background(255);
    statusMsg.html("Draw your own sketch or select a preset one!");
    output.elt.src = "images/blank.png";
  });

  randomBtn = select("#randomBtn");
  randomBtn.mousePressed(() => {
    let index = int(random(presets.length));
    inputImg = presets[index];
    drawImage();
    output.elt.src = "images/blank.png";
    statusMsg.html("Random sketch selected.");
  });

  stroke(0);
  pixelDensity(1);

  // Load the pix2pix model and enable Generate button when ready
  pix2pix = ml5.pix2pix("model/enhanced_v.pict", modelLoaded);
}

function draw() {
  if (mouseIsPressed) {
    stroke(0); // Fixed black color
    strokeWeight(currentStroke);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function modelLoaded() {
  statusMsg.html("Model loaded. You can now generate motifs.");
  transferBtn.removeAttribute("disabled");
  transferBtn.mousePressed(() => {
    transfer();
  });
}

function drawImage() {
  image(inputImg, 0, 0, SIZE, SIZE);
}

function clearCanvas() {
  background(255);
}

function transfer() {
  statusMsg.html(
    "Generating the Jamdani motif. This may take a few seconds..."
  );
  select("#spinner").show();
  transferBtn.attribute("disabled", "");

  const canvasElement = select("canvas").elt;

  pix2pix.transfer(canvasElement, (err, result) => {
    select("#spinner").hide();
    transferBtn.removeAttribute("disabled");

    if (err) {
      console.error(err);
      statusMsg.html("An error occurred during generation.");
      return;
    }
    if (result && result.src) {
      statusMsg.html("Motif generation completed.");
      output.elt.src = result.src;
    }
  });
}
