import type { Art } from "./story";
const ink = "#101114",
  paper = "#f4f3ec",
  red = "#ef3446",
  gray = "#a0a5aa";
const line = (x: number, y: number, a: number, b: number, w = 3) =>
  `<path d="M${x} ${y}L${a} ${b}" stroke="${ink}" stroke-width="${w}" fill="none"/>`;
function city() {
  return Array.from({ length: 13 }, (_, i) => {
    const x = i * 110,
      y = 340 + ((i * 73) % 160);
    return (
      `<path d="M${x} 900V${y}H${x + 85}V900" fill="${i % 2 ? gray : "#d5d7d7"}" stroke="${ink}" stroke-width="3"/>` +
      Array.from(
        { length: 7 },
        (_, j) =>
          `<rect x="${x + 15 + (j % 2) * 35}" y="${y + 25 + Math.floor(j / 2) * 50}" width="15" height="24" fill="${paper}"/>`,
      ).join("")
    );
  }).join("");
}
const person = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="5" rx="43" ry="10" fill="${ink}" opacity=".2"/><path d="M-20-110L-32-27H31L20-110Z" fill="${red}" stroke="${ink}" stroke-width="4"/><path d="M-18-27L-24 0M19-27L23 0" stroke="${ink}" stroke-width="13"/><circle cy="-132" r="22" fill="${ink}"/><path d="M-20-99L-41-52M19-100L43-65" stroke="${ink}" stroke-width="9"/><path d="M31-78L59-75L56-44L27-47Z" fill="${paper}" stroke="${ink}" stroke-width="3"/></g>`;
const label = (x: number, y: number, t: string) =>
  `<text x="${x}" y="${y}" font-family="sans-serif" font-size="22" font-weight="bold" fill="${ink}">${t}</text>`;
export const descriptions: Record<Art, string> = {
  building:
    "Uma pessoa de casaco vermelho diante de um prédio alto, sob chuva. Um zero vermelho brilha na entrada.",
  hall: "Uma portaria vazia, caixas de correio e um elevador com indicação zero.",
  stairs:
    "Lances de escada impossíveis atravessam o prédio; uma pessoa segue o corredor vermelho.",
  room: "Uma sala de festa vazia com gravador, cadeiras e uma fotografia na parede.",
  roof: "A cobertura de um prédio, uma antena e a cidade sob um céu que começa a clarear.",
  zero: "Uma sala impossível com três portas e um microfone no centro.",
  dawn: "O prédio de janelas acesas sob um grande sol vermelho.",
};
export function illustration(art: Art) {
  let body = "";
  if (art === "building" || art === "dawn") {
    body =
      `${city()}<path d="M680 900L735 60L1080 10L1160 900Z" fill="${paper}" stroke="${ink}" stroke-width="9"/><path d="M1080 10L1240 110L1290 900H1160Z" fill="${ink}"/>` +
      Array.from({ length: 7 }, (_, i) => {
        const y = 95 + i * 87;
        return `<g transform="translate(${760 + i * 7} ${y})"><path d="M0 0L100-8L106 53L5 60Z" fill="${i % 2 ? ink : gray}" stroke="${ink}" stroke-width="4"/><path d="M155-14L255-21L263 41L162 48Z" fill="${i % 2 ? paper : red}" stroke="${ink}" stroke-width="4"/>${line(49, -3, 54, 55)}${line(204, -18, 211, 44)}</g>`;
      }).join("") +
      `<path d="M880 900L885 735L1040 725L1055 900" fill="${ink}" stroke="${ink}" stroke-width="5"/><text x="947" y="792" font-family="sans-serif" font-size="46" font-weight="bold" fill="${red}">0</text><path d="M0 832L1400 807V900H0Z" fill="${ink}"/>${person(744, 855, 1.35)}`;
    if (art === "building")
      body += Array.from(
        { length: 25 },
        (_, i) =>
          `<path d="M${(i * 127) % 1400} ${(i * 139) % 770}l-35 83" stroke="${ink}" opacity=".3" stroke-width="2"/>`,
      ).join("");
    else body = `<circle cx="1080" cy="165" r="290" fill="${red}"/>` + body;
  }
  if (art === "hall")
    body =
      `<path d="M0 65L1400 10V850L0 900Z" fill="#dbdddd"/><path d="M650 0L535 900M1280 0L1380 900" stroke="${ink}" stroke-width="7"/><path d="M790 185H1150V850H790Z" fill="${ink}"/><path d="M815 230H1125V850H815Z" fill="${gray}" stroke="${paper}" stroke-width="4"/>${line(970, 230, 970, 850, 5)}<rect x="908" y="130" width="120" height="60" fill="${ink}"/><text x="952" y="174" font-family="sans-serif" font-size="45" fill="${red}">0</text><rect x="1215" y="420" width="50" height="130" fill="${paper}" stroke="${ink}" stroke-width="5"/>` +
      Array.from(
        { length: 8 },
        (_, i) =>
          `<rect x="${500 + (i % 2) * 100}" y="${300 + Math.floor(i / 2) * 84}" width="80" height="65" fill="${paper}" stroke="${ink}" stroke-width="4"/>`,
      ).join("") +
      person(740, 850, 1.6);
  if (art === "stairs")
    body =
      `<rect x="300" width="1100" height="900" fill="#d0d3d5"/>` +
      Array.from({ length: 4 }, (_, i) => {
        const y = 120 + i * 205;
        return `<path d="M550 ${y}H1240V${y + 55}H880L680 ${y + 205}H430V${y + 150}H620L820 ${y}Z" fill="${paper}" stroke="${ink}" stroke-width="7"/><path d="M880 ${y + 55}L680 ${y + 205}" stroke="${red}" stroke-width="12"/>${line(555, y - 70, 1240, y - 70, 4)}${Array.from({ length: 9 }, (_, j) => line(560 + j * 75, y - 70, 560 + j * 75, y, 3)).join("")}`;
      }).join("") +
      person(1120, 790, 1.2);
  if (art === "room")
    body = `<path d="M300 80H1370V720L300 900Z" fill="#cfd2d3" stroke="${ink}" stroke-width="5"/><path d="M300 720L1400 680V900H300Z" fill="${paper}"/>${line(300, 720, 1400, 680, 6)}<rect x="970" y="140" width="250" height="190" fill="${paper}" stroke="${ink}" stroke-width="12"/><path d="M990 300L1040 220L1100 265L1180 185V308Z" fill="${ink}"/><path d="M640 570L1240 530L1320 680L620 730Z" fill="${paper}" stroke="${ink}" stroke-width="7"/>${line(650, 725, 660, 875, 10)}${line(1270, 675, 1290, 840, 10)}<path d="M860 580L1050 570L1090 638L880 657Z" fill="${red}" stroke="${ink}" stroke-width="5"/><circle cx="920" cy="611" r="20" fill="${paper}" stroke="${ink}" stroke-width="4"/><circle cx="1010" cy="603" r="20" fill="${paper}" stroke="${ink}" stroke-width="4"/><path d="M1260 395L1340 390V620H1260Z" fill="${ink}"/>${person(715, 850, 1.4)}`;
  if (art === "roof")
    body = `<circle cx="1130" cy="190" r="210" fill="${red}"/>${city()}<path d="M380 765L1400 675V900H380Z" fill="${paper}" stroke="${ink}" stroke-width="8"/><path d="M690 720V220L750 720M705 410H1010M705 325H1080M705 260H970M800 260V450M900 260V450M1000 280V430" fill="none" stroke="${ink}" stroke-width="9"/><path d="M1030 690V460Q1160 390 1290 460V660" fill="#a0a5aa" stroke="${ink}" stroke-width="7"/>${label(1065, 560, "AURORA")}${person(900, 805, 1.4)}`;
  if (art === "zero")
    body =
      `<ellipse cx="970" cy="570" rx="540" ry="320" fill="#cdd1d3" stroke="${ink}" stroke-width="7"/><path d="M400 600Q950 100 1400 540V0H400Z" fill="${ink}"/>` +
      [
        [550, 350],
        [850, 225],
        [1180, 300],
      ]
        .map(
          ([x, y], i) =>
            `<path d="M${x} ${y + 300}V${y + 50}Q${x + 75} ${y - 40} ${x + 150} ${y + 50}V${y + 300}Z" fill="${i === 1 ? red : paper}" stroke="${ink}" stroke-width="9"/><circle cx="${x + 125}" cy="${y + 200}" r="7" fill="${ink}"/>`,
        )
        .join("") +
      `<path d="M980 590V760M925 760H1035" stroke="${ink}" stroke-width="10"/><rect x="963" y="530" width="35" height="80" rx="16" fill="${red}" stroke="${ink}" stroke-width="5"/>${person(755, 850, 1.4)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" role="img" aria-label="${descriptions[art]}"><defs><pattern id="dots" width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.8" fill="${ink}" opacity=".14"/></pattern></defs><rect width="1400" height="900" fill="${paper}"/><rect width="1400" height="900" fill="url(#dots)"/>${body}<path d="M0 860L1400 820V900H0Z" fill="${ink}" opacity=".07"/></svg>`;
}
