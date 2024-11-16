import { reducer } from "./Reducer";

function createNoteStructure(id, date, title, categories, note) {
  console.log();
  return {
    id,
    date,
    title,
    categoriesJSON: JSON.stringify(categories),
    note,
  };
}

function deserializeNote(note) {
  return [
    (x) => x.split("/r/n"),
    (note) =>
      Object.keys(createNoteStructure()).reduce((s, f) => ({
        ...s,
        [f]: (note.find((y) => y.trim().indexOf(f) === 0) || "").replace(
          new RegExp(`${f}:`),
          ""
        ),
      })),
  ].reduce(reducer, note);
}

function serializeNote(note) {
  return Object.keys(note)
    .map((k) => `${k}:${note[k]}`)
    .join("\r\n");
}

export { createNoteStructure, deserializeNote, serializeNote };
