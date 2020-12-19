// =====================
// Global state
// =====================
const state = {};

// ==================
// Utility functions
// ==================

/**
 * Create a "pen" (short for "pencil") to maintain state between drawing operations (mainly position)
 */
function createPen (x, y) {
  return { x, y };
}

/**
 * Draw a line from the current "pen" position to the new coords
 * @param {object} pen: the pen we're drawing with
 * @param {int} x: x coord to draw to
 * @param {int} y: y coord to draw to
 * @return {object} the updated pen
 */
function lineTo (pen, x, y) {
  const xTo = pen.x + x;
  const yTo = pen.y + y;
  line(pen.x, pen.y, xTo, yTo);
  // update pen position
  return { x: xTo, y: yTo };
}


// =======================
// Setup
// =======================
function setup () {
  state.size = 400;
  state.center = { x: (int)(state.size / 2), y: (int)(state.size / 2) };
  state.background = color(255, 69, 0);
  state.logo = {
    color: color(255, 255, 255),
    x: state.center.x,
    y: state.center.y + 35,
    w: 200,
    h: 140
  };
  state.animation = {
    // antenna-related stuff
    antennaAngle: 0,
    antennaSpeed: 5
  };
  createCanvas(state.size, state.size);
}

// ======================
// Main loop
// ======================

function drawLogo (state) {
  const { logo, animation, background } = state;
  const newState = Object.assign({}, state);

  // ========================
  // face outline
  // ========================
  noStroke();

  // main face shape
  fill(logo.color);
  ellipse(logo.x, logo.y, logo.w, logo.h);

  // ears
  fill(logo.color);
  ellipse(logo.x - (int)(logo.w / 2.2), logo.y - 30, 55);
  ellipse(logo.x + (int)(logo.w / 2.2), logo.y - 30, 55);

  // antenna
  stroke(logo.color);
  strokeWeight(12);
  let pen = createPen(logo.x, logo.y - 70);
  pen = lineTo(pen, 15, -60);
  // to simulate the illusion of 3D perspective on the antenna dot,
  // we use sin and then lerp+norm to reduce the sin interval from -1/+1 into 0-1 and then into -55/+55,
  // that we apply as offset to the x position of the antenna dot.
  const xPos = sin(radians(animation.antennaAngle));
  pen = lineTo(pen, lerp(-55, 55, norm(xPos, -1, 1)), 10);
  // calculate the sin of the rotation angle to get a -1/+1 transitional value.
  // since sin(0) = 0 and sin(90) = 1, we "stretch" these value on the range 0-180. As such, we divide the angle by 2 to get this result
  const rotationValue = sin(radians(animation.antennaAngle/2));
  // use the normalized value to get a smooth transition between the scaling values we'll use to resize the antennna top (0.8 - 1.2)
  const scaleFactor = lerp(0.8, 1.2, rotationValue);

  // drop the antenna top "dot"
  ellipse(pen.x, pen.y, 27 * scaleFactor, 27 * scaleFactor);

  // prepare new state with updated antenna animation data
  newState.animation.antennaAngle += animation.antennaSpeed;
  if (newState.animation.antennaAngle > degrees(TWO_PI)) {
    newState.animation.antennaAngle = 0;
  }


  // ========================
  // face internals
  // ========================
  noStroke();

  // eyes
  fill(background);
  const eyeShift = 40;
  const eyeSize = 37;
  ellipse(logo.x - eyeShift, logo.y - 12, eyeSize);
  ellipse(logo.x + eyeShift, logo.y - 12, eyeSize);

  // mouth
  stroke(background);
  strokeWeight(10);
  noFill();
  arc(logo.x, logo.y, 120, 85, radians(40), radians(140));

  // return updated state
  return newState;
}


function draw () {
  background(0);

  // container
  fill(state.background);
  ellipse(state.center.x, state.center.y, 350);

  // draw logo and return new updated state without side effects
  Object.assign(state, drawLogo(state));
}
