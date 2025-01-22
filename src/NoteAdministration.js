import { createRailReducerFunction, reducer } from "./Reducer";

import { logToConsole } from "./Logging";
import { Http, LoginTwoTone, ThreeSixty } from "@mui/icons-material";

import { createTimeStampId, getDateFromTimeStampId } from "./Generators";

import { createNoteStructure, deserializeNote, serializeNote } from "./Note";

const railSystem = createRailReducerFunction(logToConsole);

const railSystemLogStep = (s, i) => {
  logToConsole(s, i);
  return railSystem(s, i);
};

const separator = "!!=======ENTRY SEPARATOR=======!!";

function formatNote(entryDate, note) {
  return [
    (x) => createNoteStructure(x.id, entryDate, x.title, x.categories, x.note),
    serializeNote,
  ].reduce(reducer, note);
}

function calculateFileName(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}.txt`;
}

function appendData(document, data) {
  return [document, separator, data].filter(Boolean).join("\r\n");
}

function processNotesFile(path) {
  return [
    this.communicator.getFileOrDefault,
    (x) => x.decodedContent || "",
    (x) => x.split(separator),
    (x) => x.map((y) => y.trim()),
    (x) => x.filter(Boolean),
    (x) => x.map((y) => deserializeNote(y)),
  ].reduce(this.reducer, path);
}

export default function NoteAdministration(communicator) {
  const self = this;

  this.reducer = railSystem;

  const bProcessNotesFile = processNotesFile.bind({
    communicator,
    reducer: this.reducer,
  });

  this.getNotes = function ({ categories, yearsAndMonths }) {
    const monthFiles = (yearsAndMonths || []).map((x) => calculateFileName(x));

    return Promise.all(monthFiles.map(bProcessNotesFile)).then((x) => x.flat());
  };

  this.getNote = function ({ id }) {
    const entryDate = getDateFromTimeStampId(id);

    return this.getNotes({ yearsAndMonths: [entryDate] }).then((x) =>
      x.find((y) => y.id === id)
    );
  };

  this.createNote = function (note) {
    const entryDate = new Date();

    return [
      (x) => ({ ...x, id: createTimeStampId(entryDate) }),
      (x) => ({
        path: calculateFileName(entryDate),
        formattedNote: formatNote(entryDate, x),
      }),
      async (x) => ({
        file: await communicator.getFileOrDefault(x.path),
        ...x,
      }),
      (x) => ({ ...x, sha: x.file.sha, currentContent: x.file.content }),
      (x) => ({ ...x, decodedContent: x.file.decodedContent }),
      (x) => ({
        ...x,
        updatedContent: appendData(x.decodedContent, x.formattedNote),
      }),
      communicator.sendData,
    ].reduce(this.reducer || self.reducer, note);
  };
}
