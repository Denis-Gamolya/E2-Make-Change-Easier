export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;

type ShiftResults = {
  producers: number;
  productionValue: number;
  consumptionValue: number;
  balance: number;
};

type DisplayRecord = {
  label: string;
  value: number;
  color: string;
};

function calculateShift(producers: number): ShiftResults {
  const productionValue = producers * 3;
  const consumptionValue = 6;
  const balance = productionValue - consumptionValue;

  return {
    producers,
    productionValue,
    consumptionValue,
    balance,
  };
}

function updateDisplay() {
  const results = calculateShift(producers);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawProducers(results);
  drawProductionAndConsumption(results);
  updateText(results);
}

function drawProductionAndConsumption(results: ShiftResults) {
  const rows: DisplayRecord[] = [
    {
      label: "Production",
      value: results.productionValue,
      color: "#27766b",
    },
    {
      label: "Consumption",
      value: results.consumptionValue,
      color: "#a44d23",
    },
  ];

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.producers} / 6`, 18, 76);

  rows.forEach((row, index) => {
    const labelY = 102 + index * 52;

    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${row.value}`, 18, labelY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, labelY + 8, row.value * 14, 20);
  });
}

function drawProducers(results: ShiftResults) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < results.producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < results.producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function updateText(results: ShiftResults) {
  readout.textContent =
    `Assigned: ${results.producers}/6 · Production: ${results.productionValue} · Consumption: ${results.consumptionValue} · Balance: ${
      results.balance > 0 ? "+" : ""
    }${results.balance}`;
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
