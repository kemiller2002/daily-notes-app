import { logToConsole } from "./Logging";
import { reducer } from "./Reducer";

function createNoteStructure(id, date, title, categories, note) {
  return {
    id,
    date,
    title,
    categoriesJSON: JSON.stringify(categories || []),
    note,
  };
}

function parser(s, i) {
  if (!s.data) {
    return parser({ ...s, data: { note: [] } }, i);
  }

  if (s.noteSection) {
    return { ...s, data: { ...s.data, note: [...(s.data.note || []), i] } };
  }

  const regex = /^([a-zA-Z]*):/;
  const entry = (i.match(regex) || [null, null])[1];
  return entry
    ? {
        ...s,
        data: {
          ...s.data,
          [entry]: [...(s[entry] || []), i.replace(regex, "")],
        },
        noteSection: s.noteSection || entry === "note",
      }
    : s;
}

function converter(noteData) {
  return Object.keys(noteData).reduce((s, k) => {
    const keyName = k.replace("JSON", "");
    const convertFromJSON = k.match("JSON") !== null;

    const propertyData = noteData[k];

    return {
      ...s,
      [keyName]:
        convertFromJSON && propertyData
          ? JSON.parse(propertyData[0] === "undefined" ? "[]" : propertyData)
          : propertyData.join("\n"),
    };
  }, {});
}

function deserializeNote(note) {
  return [
    (x) => x.split("\n"),

    (x) => x.map((x) => x.replace("\r", "")),
    (x) => x.filter(Boolean),
    (note) => note.reduce(parser, {}),
    (x) => x.data,
    converter,
  ].reduce(reducer, note);
}

function serializeNote(note) {
  return Object.keys(note)
    .map((k) => `${k}:${note[k]}`)
    .join("\n");
}

export { createNoteStructure, deserializeNote, serializeNote };
