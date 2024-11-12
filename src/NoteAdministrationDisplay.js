import React from "react";
import Button from "@mui/material/Button";
import TextArea from "@mui/material/TextareaAutosize";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { reducer, createRailReducerFunction } from "./Reducer";
import { logToConsole } from "./Logging";

function administrateNote(noteAdministrator, clearFields, notify, note) {
  const failure = () => {
    notify("An error occurred creating note.  Please try again.");
  };

  const railSystem = createRailReducerFunction(failure);

  const boundCreateNote = noteAdministrator.createNote.bind({
    reducer: railSystem,
  });

  const results = [
    boundCreateNote,
    () => clearFields(),
    () => notify("Note created"),
  ].reduce(railSystem, note);

  console.log(railSystem.success, railSystem.errors);

  return results;
}

function NoteAdministrationDisplay({
  categoryAdministrator,
  noteAdministrator,
  messageUser,
  notify,
}) {
  const [categories, updateCategories] = useState([]);

  const getCategories = (x) => {
    categoryAdministrator
      .getCategories()
      .then(logToConsole)
      .then(updateCategories);
  };

  const blankNote = { followUpDate: "" };
  const [noteInformation, updateNote] = useState(blankNote);

  const clearFields = () => {
    updateNote(blankNote);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleInputChange = (event, values) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    updateNote({
      ...noteInformation,
      [name]: values
        ? values.map((v) => (typeof v === "string" ? { label: v } : v))
        : value,
    });
  };

  function setCurrentValue(target) {
    target.value = noteInformation[target.name] || "";
  }

  const changeInput = (event, newInputValue, reason) => {
    if (reason === "reset") {
      //setValue("");
      return;
    } else {
      //setValue(newInputValue);
    }
  };

  function submitNote(e) {
    e.preventDefault();

    administrateNote(noteAdministrator, clearFields, notify, noteInformation);
  }

  console.log(JSON.stringify(categories));

  return (
    <div>
      <h1>Note Administration</h1>

      <section>
        <h2>Create Note</h2>
        <form className="note-container" onSubmit={submitNote} method="post">
          <div className="followup">
            <InputLabel htmlFor="followUpDate">
              Follow Up Date:{" "}
              <Input
                type="date"
                name="followUpDate"
                id="followUpDate"
                onChange={handleInputChange}
                value={noteInformation.followUpDate || ""}
              />
            </InputLabel>
          </div>
          <Autocomplete
            key="categorySelect"
            multiple
            freeSolo
            disablePortal
            autoSelect
            getOptionLabel={(option) => option.name || option}
            options={categories}
            onChange={(e, v) =>
              handleInputChange({ target: { name: "categories" } }, v)
            }
            onInputChange={changeInput}
            renderInput={(params) => (
              <TextField {...params} label="Category" name="categories" />
            )}
            name="selectCategory"
          />
          <TextField
            name="title"
            label="Title"
            onChange={handleInputChange}
            className="title"
            value={noteInformation.title || ""}
          ></TextField>
          <div className="note-text-container">
            <TextArea
              className="note"
              onChange={handleInputChange}
              minRows={10}
              name="note"
              value={noteInformation.note || ""}
            ></TextArea>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default NoteAdministrationDisplay;
