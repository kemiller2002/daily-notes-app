import React from "react";
import { useState, useEffect } from "react";

import { reducer } from "./Reducer";
import { ConnectingAirportsOutlined } from "@mui/icons-material";
import Markdown from "react-markdown";
import { logToConsole } from "./Logging";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import "./Notes.css";

import { Link } from "react-router-dom";

import { formatDateString } from "./SupportingFunctions";

function makeCategoryEntry(category) {
  return (
    <span className="category" key={category.id}>
      {category.name}
    </span>
  );
}

function createNoteHeadlineDisplay(note) {
  return (
    <Link to={note.id} key={note.id} className="note-summary-container">
      <h2 className="title">{note.title}</h2>
      <div className="details">
        <div className="dates">
          <div className="entry">{formatDateString(note.date)}</div>
          <div className="dashboard-followup">
            {formatDateString(note.followup)}
          </div>
        </div>
        <Markdown remarkPlugins={[]}>{note.note}</Markdown>
        <div className="categories">
          {(note.categories || []).map(makeCategoryEntry)}
        </div>
      </div>
    </Link>
  );
}

function filterNotes(filter, note) {
  if ((filter.categories || []).length > 0) {
    const filterCategoryIds = filter.categories.map((x) => x.id);
    const noteCategoryIds = note.categories.map((x) => x.id);

    return (
      filterCategoryIds.filter((value) =>
        (noteCategoryIds || []).includes(value)
      ).length > 0
    );
  }

  return true;
}

export default function NotesDashboard({
  noteAdministrator,
  categoryAdministrator,
}) {
  const [notes, updateNotes] = useState([]);
  const criteria = {
    yearsAndMonths: [new Date()],
  };

  const [filter, updateFilter] = useState({});
  const [categories, updateCategories] = useState([]);

  const getCategories = () => {
    categoryAdministrator.getCategories().then(updateCategories);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    noteAdministrator
      .getNotes(criteria)
      .then((x) => updateNotes([...notes, ...x]));
  }, []);

  const handleInputChange = (event, values) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    updateFilter({
      ...filter,
      [name]: values
        ? values.map((v) => (typeof v === "string" ? { label: v } : v))
        : value,
    });
  };

  return (
    <div>
      <section>
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
          renderInput={(params) => (
            <TextField {...params} label="Category" name="categories" />
          )}
          name="selectCategory"
        />
      </section>
      <section className="notes">
        {notes
          .filter((n) => filterNotes(filter, n))
          .sort((a, b) => parseInt(b.id) - parseInt(a.id))
          .map(createNoteHeadlineDisplay)}
      </section>
    </div>
  );
}
