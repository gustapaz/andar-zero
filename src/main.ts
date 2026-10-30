import m from "mithril";
import {
  advance,
  available,
  back,
  clues,
  collected,
  endings,
  fresh,
  journalText,
  parseSave,
  restart,
  scenes,
} from "./story";
import type { EndingId } from "./story";
import { illustration } from "./art";
import "./style.css";

const storage = "andar-zero:reading:1";
let save = fresh(),
  warning = "";
try {
  const raw = localStorage.getItem(storage),
    loaded = parseSave(raw);
  if (loaded) save = loaded;
  else if (raw)
    warning =
      "Não foi possível ler o caminho salvo. Uma nova leitura foi aberta.";
} catch {
  warning =
    "Armazenamento indisponível. Seu caminho ficará apenas nesta sessão.";
}
let page: "read" | "journal" | "endings" | "ending" = "read",
  selected: EndingId = "voz",
  modal: "restart" | "help" | null = null,
  previousPath: string[] | null = null,
  focusReturn: HTMLElement | null = null;
function persist() {
  try {
    localStorage.setItem(storage, JSON.stringify(save));
  } catch {
    warning =
      "Não foi possível salvar neste navegador. Baixe seu caderno para guardar o caminho.";
  }
}
function focusMain() {
  requestAnimationFrame(() => {
    document
      .querySelector<HTMLElement>("#scene-heading, #page-heading")
      ?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}
function go(next: typeof page) {
  page = next;
  focusMain();
}
function choose(to: string) {
  const next = advance(save, to);
  if (next === save) return;
  save = next;
  persist();
  focusMain();
}
function openModal(kind: typeof modal) {
  focusReturn = document.activeElement as HTMLElement;
  modal = kind;
}
function closeModal() {
  modal = null;
  requestAnimationFrame(() => focusReturn?.focus());
}
function download() {
  const url = URL.createObjectURL(
      new Blob([journalText(save)], { type: "text/plain;charset=utf-8" }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = "andar-zero-caderno.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const button = (
  label: string,
  onclick: () => void,
  attrs: Record<string, unknown> = {},
) => m("button", { type: "button", onclick, ...attrs }, label);
const sceneId = () =>
  page === "ending"
    ? `final-${selected === "porta" ? "porta" : selected === "volta" ? "volta" : "voz"}`
    : save.path.at(-1)!;
const App: m.Component = {
  view() {
    const id = sceneId(),
      scene = scenes[id],
      found = collected(save.path),
      isReading = page === "read" || page === "ending";
    return m.fragment({}, [
      m("a.skip", { href: "#content" }, "Pular para a história"),
      m(
        "div.app-shell",
        {
          class: `${save.large ? "large" : ""} ${save.textOnly ? "text-only" : ""}`,
        },
        [
          m("aside.spine", { "aria-label": "Identidade da história" }, [
            m("div.issue", "UMA FICÇÃO INTERATIVA"),
            button("ANDAR ZERO", () => go("read"), {
              class: "title-mark",
              "aria-label": "Andar Zero, voltar à história",
            }),
            m("div.spine-bottom", [
              m("span", "EDIÇÃO ÚNICA"),
              m("span", "17 CENAS / 3 DESFECHOS"),
            ]),
          ]),
          m("main#content", [
            m("nav.corner-tools", { "aria-label": "Ferramentas de leitura" }, [
              button(
                page === "read" ? "Caderno ↗" : "História ↗",
                () => go(page === "read" ? "journal" : "read"),
                {
                  "aria-label":
                    page === "read"
                      ? "Abrir caderno de pistas"
                      : "Voltar à história",
                },
              ),
              button("Desfechos", () => go("endings")),
              button("?", () => openModal("help"), {
                "aria-label": "Opções de leitura e como jogar",
              }),
            ]),
            isReading
              ? m("article.comic", { class: `art-${scene.art}` }, [
                  m(
                    "div.scene-art",
                    { "aria-hidden": save.textOnly ? "true" : undefined },
                    m.trust(illustration(scene.art)),
                  ),
                  m("div.folio", [
                    m(
                      "span",
                      page === "ending"
                        ? "ARQUIVO DE DESFECHOS"
                        : `CAPÍTULO 0${scene.chapter}`,
                    ),
                    m(
                      "span",
                      page === "ending"
                        ? "LEITURA ENCONTRADA"
                        : `${String(save.path.length).padStart(2, "0")} / SEU CAMINHO`,
                    ),
                  ]),
                  m("section.caption", [
                    m("p.scene-kicker", scene.kicker),
                    m("h1#scene-heading", { tabindex: -1 }, scene.title),
                  ]),
                  m("div.scene-body", [
                    m(
                      "div.narration",
                      scene.lines.map((line) => m("p", line)),
                    ),
                    scene.clue && page === "read"
                      ? m("div.clue-found", { role: "status" }, [
                          m("span.symbol", "✳"),
                          m("span", [
                            m("strong", "PISTA NO CADERNO"),
                            m("span", clues[scene.clue].name),
                          ]),
                        ])
                      : null,
                    page === "ending"
                      ? button("Voltar aos desfechos ↗", () => go("endings"), {
                          class: "ending-return",
                        })
                      : scene.ending
                        ? m("div.end-actions", [
                            m("p.end-note", [
                              m(
                                "strong",
                                `DESFECHO ${endings[scene.ending].mark} ENCONTRADO`,
                              ),
                              m("span", endings[scene.ending].subtitle),
                            ]),
                            button(
                              "Ler meus desfechos ↗",
                              () => go("endings"),
                              { class: "solid" },
                            ),
                            button("Tentar outro caminho", () =>
                              openModal("restart"),
                            ),
                          ])
                        : m(
                            "div.choices",
                            { "aria-label": "Escolha como continuar" },
                            scene.choices.map((c, i) => {
                              const enabled = available(save.path, c);
                              return m("div.choice-wrap", [
                                button(c.label, () => choose(c.to), {
                                  disabled: !enabled,
                                  class: "choice",
                                  "aria-describedby": !enabled
                                    ? "locked-choice"
                                    : undefined,
                                }),
                                m("span.choice-number", `0${i + 1}`),
                                !enabled
                                  ? m(
                                      "p#locked-choice.locked-choice",
                                      "Requer três fragmentos: bilhete, fita e nome do prédio. Você pode voltar às cenas pelo caderno.",
                                    )
                                  : null,
                              ]);
                            }),
                          ),
                    page === "read"
                      ? m("div.reading-footer", [
                          button(
                            "← Voltar uma escolha",
                            () => {
                              save = back(save);
                              persist();
                              focusMain();
                            },
                            { disabled: save.path.length < 2 },
                          ),
                          m(
                            "span",
                            `${found.length} ${found.length === 1 ? "pista" : "pistas"} neste caminho`,
                          ),
                          button("Recomeçar", () => openModal("restart")),
                        ])
                      : null,
                  ]),
                ])
              : page === "journal"
                ? m("section.journal", [
                    m("p.section-label", "REGISTROS DO SEU CAMINHO"),
                    m("h1#page-heading", { tabindex: -1 }, [
                      "Nem tudo cabe",
                      m("br"),
                      "no envelope.",
                    ]),
                    m(
                      "p.intro",
                      "Estas são as pistas da leitura atual. Voltar a uma cena refaz o caminho dali em diante; os desfechos encontrados continuam guardados.",
                    ),
                    m("div.journal-actions", [
                      button("Baixar caderno .txt ↓", download),
                      button("Continuar história ↗", () => go("read")),
                    ]),
                    m(
                      "section.clue-list",
                      { "aria-labelledby": "clues-title" },
                      [
                        m(
                          "h2#clues-title",
                          `PISTAS / ${String(found.length).padStart(2, "0")}`,
                        ),
                        found.length
                          ? found.map((key, i) =>
                              m("article", [
                                m(
                                  "span.clue-index",
                                  String(i + 1).padStart(2, "0"),
                                ),
                                m("div", [
                                  m("h3", clues[key].name),
                                  m("p", clues[key].description),
                                  clues[key].fragment
                                    ? m("span.fragment", "FRAGMENTO ESSENCIAL")
                                    : null,
                                ]),
                              ]),
                            )
                          : m("div.empty", [
                              m("span", "◌"),
                              m("h3", "O envelope ainda guarda o silêncio."),
                              m(
                                "p",
                                "Explore as escolhas da história para recolher suas primeiras pistas.",
                              ),
                            ]),
                      ],
                    ),
                    m(
                      "section.timeline",
                      { "aria-labelledby": "timeline-title" },
                      [
                        m("h2#timeline-title", "CENAS VISITADAS"),
                        m(
                          "ol",
                          save.path.map((sid, i) =>
                            m("li", [
                              m("span", String(i + 1).padStart(2, "0")),
                              button(
                                scenes[sid].title,
                                () => {
                                  save = {
                                    ...save,
                                    path: save.path.slice(0, i + 1),
                                  };
                                  persist();
                                  go("read");
                                },
                                {
                                  "aria-label": `Voltar à cena ${i + 1}: ${scenes[sid].title}`,
                                },
                              ),
                              i === save.path.length - 1
                                ? m("small", "VOCÊ ESTÁ AQUI")
                                : null,
                            ]),
                          ),
                        ),
                      ],
                    ),
                  ])
                : m("section.endings", [
                    m("p.section-label", "OS JEITOS DE CHEGAR"),
                    m("h1#page-heading", { tabindex: -1 }, [
                      "Uma história.",
                      m("br"),
                      "Outras saídas.",
                    ]),
                    m(
                      "p.intro",
                      `${save.endings.length} de 3 desfechos encontrados. As escolhas da leitura atual podem abrir caminhos diferentes.`,
                    ),
                    ...(Object.keys(endings) as EndingId[]).map((e) => {
                      const unlocked = save.endings.includes(e);
                      return m(
                        "article.ending-row",
                        { class: unlocked ? "unlocked" : "locked" },
                        [
                          m("span.roman", endings[e].mark),
                          m("div", [
                            m(
                              "span.section-label",
                              unlocked ? "ENCONTRADO" : "AINDA FECHADO",
                            ),
                            m(
                              "h2",
                              unlocked
                                ? endings[e].title
                                : "Uma porta por descobrir.",
                            ),
                            m(
                              "p",
                              unlocked
                                ? endings[e].subtitle
                                : "Continue explorando. O título aparece quando você chegar a este fim.",
                            ),
                          ]),
                          unlocked
                            ? button(
                                "Reler ↗",
                                () => {
                                  selected = e;
                                  go("ending");
                                },
                                { "aria-label": `Reler ${endings[e].title}` },
                              )
                            : m(
                                "span.lock-symbol",
                                { "aria-hidden": "true" },
                                "×",
                              ),
                        ],
                      );
                    }),
                    m("div.archive-actions", [
                      button("Continuar meu caminho ↗", () => go("read"), {
                        class: "solid",
                      }),
                      button("Começar outra leitura", () =>
                        openModal("restart"),
                      ),
                    ]),
                  ]),
            m("footer.colophon", [
              m(
                "span",
                "UMA HISTÓRIA ORIGINAL. TODOS OS LUGARES E PERSONAGENS SÃO FICTÍCIOS.",
              ),
              m(
                "a",
                {
                  href: "https://github.com/gustapaz/andar-zero",
                  target: "_blank",
                  rel: "noreferrer",
                },
                "Gustavo Paz · código ↗",
              ),
            ]),
          ]),
        ],
      ),
      warning
        ? m("div.notice", [
            m("span", { role: "status" }, warning),
            previousPath
              ? button("Restaurar caminho", () => {
                  save = { ...save, path: previousPath! };
                  previousPath = null;
                  persist();
                  warning = "Caminho restaurado.";
                  go("read");
                })
              : null,
            button(
              "×",
              () => {
                warning = "";
              },
              { "aria-label": "Fechar aviso" },
            ),
          ])
        : null,
      modal
        ? m(
            "dialog.reader-dialog",
            {
              "aria-labelledby": "dialog-title",
              oncreate(v) {
                (v.dom as HTMLDialogElement).showModal();
              },
              oncancel(e: Event) {
                e.preventDefault();
                closeModal();
              },
              onclose() {
                if (modal) {
                  closeModal();
                  m.redraw();
                }
              },
            },
            [
              button("×", closeModal, {
                class: "close-dialog",
                "aria-label": "Fechar janela",
              }),
              modal === "restart"
                ? [
                    m("p.section-label", "OUTRA PORTA, OUTRO CAMINHO"),
                    m("h2#dialog-title", "Voltar à primeira página?"),
                    m(
                      "p",
                      "O caminho atual recomeça. Seus desfechos e opções de leitura continuam guardados. Você pode restaurar este caminho no aviso seguinte.",
                    ),
                    m("div.dialog-actions", [
                      button(
                        "Recomeçar a história",
                        () => {
                          previousPath = [...save.path];
                          save = restart(save);
                          persist();
                          warning = "Uma nova leitura foi aberta.";
                          closeModal();
                          go("read");
                        },
                        { class: "solid" },
                      ),
                      button("Continuar de onde parei", closeModal),
                    ]),
                  ]
                : [
                    m("p.section-label", "LEIA DO SEU JEITO"),
                    m("h2#dialog-title", "O prédio pode esperar."),
                    m(
                      "p",
                      "Andar Zero é uma ficção interativa curta. Explore, recolha pistas e escolha um dos três desfechos. Não há cronômetro, sustos repentinos ou som automático.",
                    ),
                    m("label.option", [
                      m("input", {
                        type: "checkbox",
                        checked: save.large,
                        onchange(e: Event) {
                          save = {
                            ...save,
                            large: (e.target as HTMLInputElement).checked,
                          };
                          persist();
                        },
                      }),
                      " Texto maior",
                    ]),
                    m("label.option", [
                      m("input", {
                        type: "checkbox",
                        checked: save.textOnly,
                        onchange(e: Event) {
                          save = {
                            ...save,
                            textOnly: (e.target as HTMLInputElement).checked,
                          };
                          persist();
                        },
                      }),
                      " Leitura sem ilustrações",
                    ]),
                    m(
                      "p.small",
                      "As escolhas funcionam com Tab e Enter. Escape fecha esta janela. O movimento respeita a preferência do dispositivo.",
                    ),
                    m(
                      "p.small",
                      "Salvo só neste navegador. Sem conta ou sincronização. O caderno em texto é uma cópia de leitura, não um arquivo para importar.",
                    ),
                    button("Continuar leitura ↗", closeModal, {
                      class: "solid",
                    }),
                  ],
            ],
          )
        : null,
    ]);
  },
};
m.mount(document.getElementById("app")!, App);
