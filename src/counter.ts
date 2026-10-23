export {};

type ShieldSnapshot = {
  charge: number;
  capacity: number;
  missingCharge: number;
};

const shieldEvents = new EventTarget();
shieldEvents.addEventListener("shield-change", (event) => {
  drawMeter((event as CustomEvent<ShieldSnapshot>).detail);
});

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

function getShieldSnapshot(charge: number): ShieldSnapshot {
  return {
    charge,
    capacity: 10,
    missingCharge: 10 - charge,
  };
}

function drawMeter(shield: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shield.capacity; i++) {
    ctx.fillStyle = i < shield.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.charge} / ${shield.capacity} shield`, 12, 100);
  readout.textContent = `Shield charge: ${shield.charge} / ${shield.capacity}`;
}

function updateStats(event: Event) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats((event as CustomEvent<ShieldSnapshot>).detail);
}

function renderStats(shield: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shield.charge} · Missing charge: ${shield.missingCharge}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  const shield = getShieldSnapshot(count);
  shieldEvents.dispatchEvent(
    new CustomEvent<ShieldSnapshot>("shield-change", { detail: shield }),
  );
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(getShieldSnapshot(count));
  shieldEvents.addEventListener("shield-change", updateStats);
};

document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  shieldEvents.removeEventListener("shield-change", updateStats);
  panel.remove();
  panel = null;
};
drawMeter(getShieldSnapshot(count));
