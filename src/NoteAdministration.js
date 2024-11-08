import { createRailReducerFunction, reducer } from "./Reducer";
import { getWeekNumber } from "./DateFunctions";

import { logToConsole } from "./Logging";
import { LoginTwoTone } from "@mui/icons-material";

const railSystem = createRailReducerFunction(logToConsole);

//adding async here.

const railSystemLogStep = (s, i) => {
  logToConsole(s, i);
  return railSystem(s, i);
};

const separator = "$9@)9&";

export default function NoteAdministration(communicator) {
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
    return `${date.getFullYear()}-${getWeekNumber(date)}.txt`;
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
    ].reduce(this.reducer, note);
  };
}
