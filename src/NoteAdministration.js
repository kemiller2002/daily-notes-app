import { createRailReducerFunction, reducer } from "./Reducer";
import { getWeekNumber } from "./DateFunctions";

import { logToConsole } from "./Logging";
import { LoginTwoTone } from "@mui/icons-material";

const railSystem = createRailReducerFunction(logToConsole);

const railSystemLogStep = (s, i) => {
  logToConsole(s, i);
  return railSystem(s, i);
};

const separator = "$9@)9&";

export default function NoteAdministration(communicator) {
  this.createNote = function (note) {
    return note;
  };

  this.getNotes = function ({ categories, dateRangeStart, dateRangeEnd }) {
    return [];
  };

  this.reducer = railSystemLogStep;

  function formatNote(entryDate, note) {
    return [
      `entry date: ${entryDate}`,
      `title: ${note.title}`,
      `categories: ${note.categories}`,
      `${note.note}`,
    ].join("\r\n");
  }

  function calculateFileName(date) {
    return `${date.getFullYear()}-${getWeekNumber(date)}`;
  }

  function decode(file) {
    return btoa(file);
  }

  function appendData(document, data) {
    return [document, separator, data].join("\r\n");
  }

  this.createNote = function (note) {
    const entryDate = new Date();
    return [
      (x) => ({
        path: calculateFileName(entryDate),
        formattedNote: formatNote(entryDate, x),
      }),
      (x) => ({
        file: communicator.getFileOrDefault(x.path),
        ...x,
      }),
      logToConsole,
      (x) => ({ ...x, sha: x.file.sha, currentContent: x.file.content }),
      (x) => ({ ...x, decoded: decode(x.file) }),
      (x) => ({ ...x, content: appendData(x.decoded, x.formattedNote) }),
      communicator.sendData,
    ].reduce(reducer, note);
  };
}
