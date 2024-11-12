import { createRailReducerFunction, reducer } from "./Reducer";
import { getWeekNumber } from "./DateFunctions";

import { logToConsole } from "./Logging";
import { LoginTwoTone } from "@mui/icons-material";

import { createNumericalId } from "./Generators";

const railSystem = createRailReducerFunction(logToConsole);

const railSystemLogStep = (s, i) => {
  logToConsole(s, i);
  return railSystem(s, i);
};

const configurationFilePath = ["configuration", "categories.json"].join("/");

export default function CategoryAdministration(communicator) {
  this.reducer = reducer;

  function makeUniqueCategoryList(currentList, updatedItem) {
    const itemObject = currentList
      .filter(Boolean)
      .reduce((s, i) => ({ ...s, [i.id]: i }), {});
    const constUpdatedObject = { ...itemObject, [updatedItem.id]: updatedItem };

    return Object.keys(constUpdatedObject)
      .map((key) => constUpdatedObject[key])
      .sort((a, b) => a.id > b.id);
  }

  const updateData = (documentString, updatedCategory) => {
    return [
      ({ documentString, updatedCategory }) => ({
        updatedCategory,
        documentData: documentString ? JSON.parse(documentString) : [],
      }),
      ({ documentData, updatedCategory }) =>
        this.makeUniqueCategoryList(documentData, updatedCategory),
      (d) => JSON.stringify(d, null, 4),
    ].reduce(this.reducer, { updatedCategory, documentString });
  };

  this.makeUniqueCategoryList = makeUniqueCategoryList;

  this.getCategories = function () {
    return [
      communicator.getFileOrDefault,
      ({ decodedContent }) =>
        decodedContent ? JSON.parse(decodedContent) : [],
      (x) => x.filter(Boolean),
    ].reduce(this.reducer, configurationFilePath);
  };

  this.saveCategory = function (category) {
    const creationDate = new Date();
    const id = createNumericalId(creationDate);

    return [
      (x) => ({ id, ...x, creationDate }),
      (x) => ({
        path: configurationFilePath,
        formatted: x,
      }),
      async (x) => ({
        file: await communicator.getFileOrDefault(x.path),
        ...x,
      }),
      (x) => ({ ...x, sha: x.file.sha, currentContent: x.file.content }),
      (x) => ({ ...x, decodedContent: x.file.decodedContent }),
      (x) => ({
        ...x,
        updatedContent: updateData(x.decodedContent, x.formatted),
      }),
      communicator.sendData,
    ].reduce(this.reducer, category);
  };
}
