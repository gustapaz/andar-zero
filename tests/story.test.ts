import { describe, it, expect } from "vitest";
import {
  advance,
  available,
  back,
  collected,
  fresh,
  journalText,
  parseSave,
  restart,
  scenes,
} from "../src/story";
import { illustration } from "../src/art";
import type { Save } from "../src/story";
const voice = [
  "interfone",
  "escada",
  "bilhete",
  "patamar",
  "gravador",
  "sinal",
  "cobertura",
  "nome",
  "zero",
  "final-voz",
];
const walk = (ids: string[]) => ids.reduce((s, id) => advance(s, id), fresh());
describe("Narrativa e escolhas", () => {
  it("todos os caminhos são finitos e alcançam os três desfechos", () => {
    const reached = new Set<string>(),
      found = new Set<string>();
    function visit(s: Save) {
      expect(s.path.length).toBeLessThan(30);
      const id = s.path.at(-1)!;
      reached.add(id);
      const node = scenes[id];
      if (node.ending) {
        found.add(node.ending);
        return;
      }
      const choices = node.choices.filter((c) => available(s.path, c));
      expect(choices.length).toBeGreaterThan(0);
      for (const c of choices) {
        expect(s.path).not.toContain(c.to);
        visit(advance(s, c.to));
      }
    }
    visit(fresh());
    expect(reached.size).toBe(17);
    expect([...found].sort()).toEqual(["porta", "volta", "voz"]);
  });
  it("as três pistas essenciais abrem o desfecho de voz", () => {
    const s = walk(voice);
    expect(s.path.at(-1)).toBe("final-voz");
    expect(s.endings).toEqual(["voz"]);
    expect(collected(s.path)).toEqual(["chave", "bilhete", "fita", "nome"]);
  });
  it("uma escolha bloqueada não avança nem desbloqueia final", () => {
    const s = walk([
      "correio",
      "escada",
      "patamar",
      "fotografia",
      "sinal",
      "cobertura",
      "envelope",
      "zero",
    ]);
    expect(advance(s, "final-voz")).toBe(s);
    expect(advance(s, "inexistente")).toBe(s);
    expect(advance(s, "final-porta").endings).toEqual(["porta"]);
  });
  it("voltar refaz o inventário e preserva finais já encontrados", () => {
    const s = walk(voice),
      previous = back(s);
    expect(previous.path.at(-1)).toBe("zero");
    expect(previous.endings).toEqual(["voz"]);
    expect(collected(back(walk(["correio"])).path)).toEqual([]);
    expect(back(fresh()).path).toEqual(["chegada"]);
  });
  it("recomeçar conserva preferências e desfechos", () => {
    const s = { ...walk(voice), large: true, textOnly: true };
    expect(restart(s)).toEqual({ ...s, path: ["chegada"] });
  });
  it("pistas repetidas aparecem uma única vez", () => {
    const s = walk([
      "interfone",
      "escada",
      "bilhete",
      "patamar",
      "gravador",
      "fotografia",
      "fita-depois",
    ]);
    expect(collected(s.path).filter((id) => id === "fita")).toHaveLength(1);
  });
});
describe("Persistência e exportação", () => {
  it("restaura caminho e preferências válidos", () => {
    const s = { ...walk(voice), large: true };
    expect(parseSave(JSON.stringify(s))).toEqual(s);
  });
  it("rejeita dados corrompidos, versões e caminhos impossíveis", () => {
    for (const raw of [
      "{",
      "null",
      "[]",
      JSON.stringify({ ...fresh(), version: 2 }),
      JSON.stringify({ ...fresh(), path: ["zero"] }),
      JSON.stringify({ ...fresh(), path: ["chegada", "final-voz"] }),
      JSON.stringify({ ...fresh(), endings: ["???"] }),
      JSON.stringify({ ...fresh(), large: "true" }),
    ])
      expect(parseSave(raw)).toBeNull();
  });
  it("recusa final bloqueado forjado dentro do caminho", () => {
    const s = walk([
      "correio",
      "escada",
      "patamar",
      "fotografia",
      "sinal",
      "cobertura",
      "envelope",
      "zero",
    ]);
    expect(
      parseSave(
        JSON.stringify({
          ...s,
          path: [...s.path, "final-voz"],
          endings: ["voz"],
        }),
      ),
    ).toBeNull();
  });
  it("exporta somente pistas e finais efetivamente encontrados", () => {
    const text = journalText(walk(["correio"]));
    expect(text).toContain("Planta do edifício");
    expect(text).not.toContain("Fita de aniversário");
    expect(text).toContain("Nenhum ainda.");
    expect(text).toContain("Ficção interativa");
  });
  it("todas as cenas têm ilustração estática sem serviços remotos", () => {
    for (const node of Object.values(scenes)) {
      const svg = illustration(node.art);
      expect(svg).toContain('viewBox="0 0 1400 900"');
      expect(svg).toContain("aria-label=");
      expect(svg).not.toMatch(/<script|foreignObject|href=|NaN|undefined/);
    }
  });
});
