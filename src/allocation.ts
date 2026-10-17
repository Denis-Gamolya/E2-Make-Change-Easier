export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;

function updateDisplay(
  productionValue = producers * 3,
  consumptionValue = 6,
  balance = productionValue - consumptionValue,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawProducers();
  drawProductionAndConsumption(productionValue, consumptionValue);
  updateText(productionValue, consumptionValue, balance);
}

function drawProductionAndConsumption(
  productionValue = producers * 3,
  consumptionValue = 6,
) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producers} / 6`, 18, 76);
  ctx.fillText(`Production: ${productionValue}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, productionValue * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumptionValue}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumptionValue * 14, 20);
}

function drawProducers() {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function updateText(
  productionValue = producers * 3,
  consumptionValue = 6,
  balance = productionValue - consumptionValue,
) {
  readout.textContent =
    `Assigned: ${producers}/6 · Production: ${productionValue} · Consumption: ${consumptionValue} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    updateDisplay();
  };
updateDisplay();
