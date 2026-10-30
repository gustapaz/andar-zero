export type Art =
  "building" | "hall" | "stairs" | "room" | "roof" | "zero" | "dawn";
export type ClueId = "bilhete" | "planta" | "chave" | "fita" | "foto" | "nome";
export type EndingId = "voz" | "porta" | "volta";
export type Choice = { label: string; to: string; requires?: ClueId[] };
export type Scene = {
  chapter: 1 | 2 | 3;
  title: string;
  kicker: string;
  art: Art;
  lines: string[];
  choices: Choice[];
  clue?: ClueId;
  ending?: EndingId;
};
export const clues: Record<
  ClueId,
  { name: string; description: string; fragment: boolean }
> = {
  bilhete: {
    name: "Bilhete sem destinatário",
    description:
      "“Se o elevador parar entre o térreo e o primeiro, não é defeito. É um convite.” No verso: uma pequena espiral.",
    fragment: true,
  },
  planta: {
    name: "Planta do edifício",
    description:
      "Sete pavimentos, uma cobertura. Entre o térreo e o primeiro há uma linha vermelha que não aparece na legenda.",
    fragment: false,
  },
  chave: {
    name: "Chave de latão",
    description:
      "A chave traz um zero gravado. Não abre nenhuma porta do corredor, mas encaixa no painel antigo do elevador.",
    fragment: false,
  },
  fita: {
    name: "Fita de aniversário",
    description:
      "Uma gravação de moradores cantando juntos. No final alguém diz: “Uma casa é o lugar onde seu nome encontra resposta.”",
    fragment: true,
  },
  foto: {
    name: "Fotografia da cobertura",
    description:
      "Um grupo diante de uma antena. Ninguém olha para a câmera: todos parecem estar escutando alguma coisa.",
    fragment: false,
  },
  nome: {
    name: "O nome do prédio",
    description:
      "Antes de ser Edifício 11, o lugar se chamava Aurora. As letras ainda estão sob a pintura da caixa d’água.",
    fragment: true,
  },
};
export const endings: Record<
  EndingId,
  { title: string; subtitle: string; mark: string }
> = {
  voz: {
    title: "O prédio que respondeu",
    subtitle: "Você devolveu um nome ao silêncio.",
    mark: "I",
  },
  porta: {
    title: "Uma porta para o próximo",
    subtitle: "Nem todo mistério precisa terminar em você.",
    mark: "II",
  },
  volta: {
    title: "O caminho de casa",
    subtitle: "Você soube a hora de voltar.",
    mark: "III",
  },
};
export const scenes: Record<string, Scene> = {
  chegada: {
    chapter: 1,
    kicker: "23:11 / RUA SEM NOME",
    title: "O prédio não tinha esse andar.",
    art: "building",
    lines: [
      "O endereço no envelope era o seu. A letra, também. Mas você não se lembrava de ter escrito: “Edifício 11. Andar zero. Entregar antes da primeira luz.”",
      "Na fachada, sete janelas acesas. Na portaria, ninguém. O interfone tocou antes de você apertar qualquer botão.",
    ],
    choices: [
      { label: "Atender o interfone", to: "interfone" },
      { label: "Examinar as caixas de correio", to: "correio" },
    ],
  },
  interfone: {
    chapter: 1,
    kicker: "UMA VOZ ATRÁS DA PAREDE",
    title: "“Você demorou.”",
    art: "hall",
    clue: "chave",
    lines: [
      "A voz não parece impaciente. Parece aliviada. “Deixei a chave no lugar de sempre.”",
      "Você levanta o capacho por instinto. Uma chave pequena, com um zero gravado, está esperando. O portão se abre.",
    ],
    choices: [{ label: "Entrar com a chave", to: "escada" }],
  },
  correio: {
    chapter: 1,
    kicker: "CAIXA 00 / SEM MORADOR",
    title: "Um espaço entre os números.",
    art: "hall",
    clue: "planta",
    lines: [
      "As caixas vão de 01 a 07. Entre elas há uma oitava, sem fechadura. Dentro, uma planta dobrada do prédio.",
      "Uma linha vermelha separa o térreo do primeiro andar. A legenda não explica o que existe ali. O portão cede ao seu toque.",
    ],
    choices: [{ label: "Guardar a planta e entrar", to: "escada" }],
  },
  escada: {
    chapter: 1,
    kicker: "O PRIMEIRO LANCE",
    title: "O elevador já está aqui.",
    art: "stairs",
    lines: [
      "O painel tem sete botões e uma marca redonda abaixo do primeiro. O elevador está vazio. No chão, um bilhete dobrado em quatro.",
      "Do alto da escada vem o som distante de uma festa. Não há música — só pessoas cantando a mesma nota.",
    ],
    choices: [
      { label: "Ler o bilhete no chão", to: "bilhete" },
      { label: "Seguir o som pela escada", to: "patamar" },
    ],
  },
  bilhete: {
    chapter: 1,
    kicker: "UM CONVITE DOBRADO",
    title: "Não é defeito.",
    art: "hall",
    clue: "bilhete",
    lines: [
      "“Se o elevador parar entre o térreo e o primeiro, não é defeito. É um convite.”",
      "No verso do papel, uma espiral igual à marca no painel. Você guarda o bilhete. O som da festa parece um pouco mais perto.",
    ],
    choices: [{ label: "Subir até o patamar", to: "patamar" }],
  },
  patamar: {
    chapter: 2,
    kicker: "CAPÍTULO 02 / O QUE FICOU",
    title: "Uma festa que acabou há anos.",
    art: "room",
    lines: [
      "O corredor termina em uma sala de portas abertas. Há copos vazios, cadeiras empilhadas e uma mesa posta para uma pessoa a mais.",
      "Sobre a mesa, um gravador. Na parede, uma fotografia da cobertura do prédio. O som vem de algum lugar entre os dois.",
    ],
    choices: [
      { label: "Ligar o gravador", to: "gravador" },
      { label: "Examinar a fotografia", to: "fotografia" },
    ],
  },
  gravador: {
    chapter: 2,
    kicker: "FITA 11 / LADO A",
    title: "Alguém diz o seu nome.",
    art: "room",
    clue: "fita",
    lines: [
      "A fita começa com uma festa de aniversário. Uma criança pede para guardar a última fatia para “quem ainda está chegando”.",
      "Depois da cantoria, uma voz diz: “Uma casa é o lugar onde seu nome encontra resposta.” Você reconhece a voz. É a mesma do interfone.",
    ],
    choices: [
      { label: "Ver também a fotografia", to: "fotografia" },
      { label: "Procurar a origem do sinal", to: "sinal" },
    ],
  },
  fotografia: {
    chapter: 2,
    kicker: "UMA IMAGEM SEM DATA",
    title: "Todos estão escutando.",
    art: "room",
    clue: "foto",
    lines: [
      "Na fotografia, moradores se reúnem sob uma antena. Uma mulher segura o mesmo envelope que você trouxe.",
      "No canto da imagem, uma anotação: “Quando a cidade esquece, a casa lembra.” Atrás da parede, alguma coisa estala.",
    ],
    choices: [
      { label: "Ouvir a fita antes de seguir", to: "fita-depois" },
      { label: "Seguir o estalo até a cobertura", to: "sinal" },
    ],
  },
  "fita-depois": {
    chapter: 2,
    kicker: "FITA 11 / ÚLTIMO TRECHO",
    title: "A casa lembra.",
    art: "room",
    clue: "fita",
    lines: [
      "Você aperta o botão vermelho do gravador. Há uma festa dentro da caixa de metal. Pessoas que você nunca conheceu cantam como se estivessem esperando por você.",
      "Uma voz encerra a gravação: “Uma casa é o lugar onde seu nome encontra resposta.” O gravador para sozinho.",
    ],
    choices: [{ label: "Subir à cobertura", to: "sinal" }],
  },
  sinal: {
    chapter: 2,
    kicker: "A ESCADA DE SERVIÇO",
    title: "O céu cabe numa porta.",
    art: "stairs",
    lines: [
      "A escada é mais curta do que deveria. Você conta sete degraus, depois sete outra vez. A luz por baixo da porta muda do branco para o vermelho.",
      "Uma placa diz COBERTURA. Abaixo, alguém escreveu à mão: “Não confunda silêncio com vazio.”",
    ],
    choices: [{ label: "Abrir a porta da cobertura", to: "cobertura" }],
  },
  cobertura: {
    chapter: 3,
    kicker: "CAPÍTULO 03 / A PRIMEIRA LUZ",
    title: "A cidade prendeu a respiração.",
    art: "roof",
    lines: [
      "Lá embaixo, a cidade inteira parece um desenho ainda sem legenda. A antena está desligada. A caixa d’água tem letras escondidas sob a tinta.",
      "O envelope na sua mão está quente. Você tem a impressão de que sempre soube o que havia dentro.",
    ],
    choices: [
      { label: "Ler as letras sob a tinta", to: "nome" },
      { label: "Abrir o envelope agora", to: "envelope" },
    ],
  },
  nome: {
    chapter: 3,
    kicker: "ANTES DO NÚMERO",
    title: "Aurora.",
    art: "roof",
    clue: "nome",
    lines: [
      "Você passa a mão pela tinta descascada. A palavra aparece devagar: AURORA. Antes de ser um endereço, o prédio tinha um nome.",
      "A antena emite um único estalo. O elevador abre as portas atrás de você. O painel exibe um zero vermelho.",
    ],
    choices: [{ label: "Entrar no elevador", to: "zero" }],
  },
  envelope: {
    chapter: 3,
    kicker: "DESTINATÁRIO: QUEM CHEGAR",
    title: "Uma folha em branco.",
    art: "roof",
    lines: [
      "O envelope contém uma única folha. Em branco. Você vira o papel contra a luz e enxerga marcas de palavras que alguém apagou.",
      "Talvez falte um nome. Talvez a folha tenha sido deixada assim de propósito. O elevador abre as portas e o painel mostra um zero.",
    ],
    choices: [
      { label: "Procurar o nome antes de descer", to: "nome" },
      { label: "Entrar com a folha em branco", to: "zero" },
    ],
  },
  zero: {
    chapter: 3,
    kicker: "ENTRE O TÉRREO E O PRIMEIRO",
    title: "O andar que guarda os outros.",
    art: "zero",
    lines: [
      "O elevador para sem ruído. Não há corredor, só uma sala circular cheia de portas. Cada porta tem o nome de alguém que já morou aqui.",
      "No centro, um microfone desligado. Você entende: o prédio não está assombrado. Está tentando não esquecer. O que você vai deixar para ele?",
    ],
    choices: [
      {
        label: "Devolver as vozes ao prédio",
        to: "final-voz",
        requires: ["bilhete", "fita", "nome"],
      },
      { label: "Deixar uma porta aberta", to: "final-porta" },
      { label: "Voltar antes de amanhecer", to: "final-volta" },
    ],
  },
  "final-voz": {
    chapter: 3,
    kicker: "DESFECHO I",
    title: "O prédio que respondeu.",
    art: "dawn",
    ending: "voz",
    lines: [
      "Você coloca o bilhete ao lado do microfone, aciona o gravador e diz: “Aurora.”",
      "Uma janela se acende. Depois outra. Os nomes nas portas viram vozes, as vozes viram uma cantoria sem pressa. Quando a primeira luz chega, a cidade parece reconhecer o prédio.",
      "Você sai com o envelope vazio. Pela primeira vez, isso parece a coisa certa.",
    ],
    choices: [],
  },
  "final-porta": {
    chapter: 3,
    kicker: "DESFECHO II",
    title: "Uma porta para o próximo.",
    art: "zero",
    ending: "porta",
    lines: [
      "Você dobra a folha em branco e a apoia sob a porta mais próxima. Não escreve nada. Há perguntas que precisam continuar esperando por outras mãos.",
      "O microfone faz um pequeno ruído, quase um agradecimento. No elevador, o zero desaparece antes que você consiga olhar de novo.",
      "Na rua, alguém vem na sua direção segurando um envelope. Você deixa o portão aberto.",
    ],
    choices: [],
  },
  "final-volta": {
    chapter: 3,
    kicker: "DESFECHO III",
    title: "O caminho de casa.",
    art: "building",
    ending: "volta",
    lines: [
      "Você guarda o envelope e aperta o botão do térreo. O prédio não tenta impedir. Algumas portas só precisam saber que poderiam ter sido abertas.",
      "Lá fora, a chuva parou. Na fachada, sete janelas acesas. Você reconhece a sua entre elas.",
      "No verso do envelope, há uma frase que não estava lá antes: “Obrigado por chegar até aqui.”",
    ],
    choices: [],
  },
};
export type Save = {
  version: 1;
  path: string[];
  endings: EndingId[];
  large: boolean;
  textOnly: boolean;
};
export const fresh = (): Save => ({
  version: 1,
  path: ["chegada"],
  endings: [],
  large: false,
  textOnly: false,
});
export const collected = (path: string[]): ClueId[] => [
  ...new Set(
    path.flatMap((id) => (scenes[id]?.clue ? [scenes[id].clue!] : [])),
  ),
];
export const available = (path: string[], choice: Choice) =>
  !choice.requires ||
  choice.requires.every((id) => collected(path).includes(id));
export function advance(save: Save, to: string): Save {
  const scene = scenes[save.path.at(-1)!],
    choice = scene?.choices.find((c) => c.to === to);
  if (!choice || !available(save.path, choice)) return save;
  const ending = scenes[to].ending;
  return {
    ...save,
    path: [...save.path, to],
    endings: ending ? [...new Set([...save.endings, ending])] : save.endings,
  };
}
export const back = (s: Save): Save =>
  s.path.length < 2 ? s : { ...s, path: s.path.slice(0, -1) };
export const restart = (s: Save): Save => ({ ...s, path: ["chegada"] });
export function parseSave(raw: string | null): Save | null {
  try {
    if (!raw || raw.length > 20000) return null;
    const s = JSON.parse(raw) as Save;
    if (
      s.version !== 1 ||
      typeof s.large !== "boolean" ||
      typeof s.textOnly !== "boolean" ||
      !Array.isArray(s.path) ||
      s.path.some((id) => typeof id !== "string") ||
      s.path.length < 1 ||
      s.path.length > 30 ||
      s.path[0] !== "chegada" ||
      !Array.isArray(s.endings) ||
      s.endings.some((id) => typeof id !== "string") ||
      s.endings.length > 3 ||
      s.endings.some((id) => !Object.hasOwn(endings, id)) ||
      new Set(s.endings).size !== s.endings.length
    )
      return null;
    for (let i = 0; i < s.path.length; i++) {
      if (
        !Object.hasOwn(scenes, s.path[i]) ||
        new Set(s.path).size !== s.path.length
      )
        return null;
      if (i) {
        const c = scenes[s.path[i - 1]].choices.find((c) => c.to === s.path[i]);
        if (!c || !available(s.path.slice(0, i), c)) return null;
      }
    }
    const end = scenes[s.path.at(-1)!].ending;
    if (end && !s.endings.includes(end)) return null;
    return s;
  } catch {
    return null;
  }
}
export function journalText(s: Save) {
  return `ANDAR ZERO · Ficção interativa\n\nCAMINHO\n${s.path.map((id, i) => `${i + 1}. ${scenes[id].title}`).join("\n")}\n\nPISTAS\n${
    collected(s.path)
      .map((id) => `${clues[id].name}: ${clues[id].description}`)
      .join("\n\n") || "Nenhuma pista recolhida."
  }\n\nDESFECHOS ENCONTRADOS\n${s.endings.map((id) => endings[id].title).join("\n") || "Nenhum ainda."}\n\nhttps://gustapaz.github.io/andar-zero/`;
}
