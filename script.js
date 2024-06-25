const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const removeButton = document.getElementById("removeButton");
const namesInput = document.getElementById("namesInput");
const namesReadOnly = document.getElementById("namesReadOnly");

let names = [
  "Ben",
  "Caroline",
  "Daniel",
  "Darcson",
  "David",
  "Gavin",
  "Heena",
  "Irina",
  "Jacques",
  "Jitesh",
  "Kaiwei",
  "Karyll",
  "Lucas",
  "Mark",
  "Marlon",
  "Neetee",
  "Oleg",
  "Paul",
  "Sanjana",
  "Shengkai",
  "Susan",
  "Vikas",
];
let presentNames = [
  "Caroline",
  "Daniel",
  "Darcson",
  "David",
  "Gavin",
  "Heena",
  "Irina",
  "Jacques",
  "Jitesh",
  "Kaiwei",
  "Karyll",
  "Lucas",
  "Neetee",
  "Oleg",
  "Paul",
  "Shengkai",
  "Susan",
];

let wheelNames = [...presentNames];
let arc = (2 * Math.PI) / presentNames.length;
let startAngle = 0;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let spinTimeout;
let spinAngle = 0;
let lastSelectedName = null;

function initNames() {
  names.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    namesReadOnly.appendChild(option);
  });

  presentNames.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    namesInput.appendChild(option);
  });
}

function getHarmoniousColor(index, total) {
  const hue = (index / total) * 360;
  const saturation = 70; // percentage
  const lightness = 50; // percentage
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function drawWheel() {
  const outsideRadius = canvas.width / 2 - 20;
  const textRadius = outsideRadius - 20;
  const insideRadius = 20;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.font = "bold 18px Calibri";

  for (let i = 0; i < wheelNames.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = getHarmoniousColor(i, wheelNames.length);

    ctx.beginPath();
    ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
    ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
    ctx.stroke();
    ctx.fill();

    ctx.save();
    ctx.fillStyle = "white";
    ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 250 + Math.sin(angle + arc / 2) * textRadius);
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(wheelNames[i], -ctx.measureText(wheelNames[i]).width / 2, 0);
    ctx.restore();
  }
  drawArrow();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 10);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  spinTimeout = null;
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcd = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  ctx.save();
  ctx.font = "bold 32px Black, Calibri";
  const text = wheelNames[index];
  ctx.fillStyle = "black";
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
  lastSelectedName = text;
  // Remove the selected name from wheelNames
  wheelNames = wheelNames.filter(name => name !== lastSelectedName);
  arc = (2 * Math.PI) / wheelNames.length; // Update arc for the new number of names
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

spinButton.addEventListener("click", () => {
  if (!spinTimeout) {
    if (lastSelectedName) {
      wheelNames = wheelNames.filter(name => name !== lastSelectedName);
      arc = (2 * Math.PI) / wheelNames.length;
    }
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 6 * 1000;
    rotateWheel();
  }
});

removeButton.addEventListener("click", () => {
  const selectedOptions = Array.from(namesInput.selectedOptions);
  selectedOptions.forEach(option => {
    presentNames = presentNames.filter(name => name !== option.value);
    wheelNames = wheelNames.filter(name => name !== option.value);
    option.remove();
  });

  arc = (2 * Math.PI) / presentNames.length;
  drawWheel();
});

moveButton.addEventListener("click", () => {
  const selectedOptions = Array.from(namesReadOnly.selectedOptions);
  const selectedNames = selectedOptions.map(option => option.value);

  selectedNames.forEach(name => {
    if (!presentNames.includes(name)) {
      presentNames.push(name);
      wheelNames.push(name);
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      namesInput.appendChild(option);
    }
  });

  arc = (2 * Math.PI) / presentNames.length;
  drawWheel();
});

function drawArrow() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const arrowSize = 30;

  ctx.beginPath();
  ctx.moveTo(centerX - arrowSize, centerY - canvas.height / 2 - arrowSize);
  ctx.lineTo(centerX + arrowSize, centerY - canvas.height / 2 - arrowSize);
  ctx.lineTo(centerX, centerY - canvas.height / 2 + arrowSize);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}

drawWheel();
initNames();
