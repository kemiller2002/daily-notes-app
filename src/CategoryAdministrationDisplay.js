import { React, useState } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import { Switch } from "@mui/material";
import { reducer, createRailReducerFunction } from "./Reducer";

const label = { inputProps: { "aria-label": "Toggle category enabled" } };

function createCategoryEntryDisplay(administrator, notify, category) {
  return (
    <div className="category" key={`category-container-${category.id}`}>
      <span className="id">{category.id}</span>
      <span className="label">{category.label}</span>
      <Switch
        key={category.id}
        {...label}
        checked={category.enabled}
        className="enabled"
        onChange={(e) => {
          administrator.updateCategory({
            ...category,
            enabled: e.target.checked,
          });
        }}
      />
    </div>
  );
}

const categoryTypes = "Person,Department,Project".split(",");

const changeInput = (event, newInputValue, reason) => {
  if (reason === "reset") {
    //setValue("");
    return;
  } else {
    //setValue(newInputValue);
  }
};

function createCategoryEntry(notify, data, e) {
  e.preventDefault();

  const failure = () => {
    notify("An error occurred creating note.  Please try again.");
    console.log(...arguments);
  };

  const railSystem = createRailReducerFunction(failure);

  return [].reduce(railSystem, data);
}

export default function CategoryAdministrationDisplay({
  categoryAdministrator,
  notify,
}) {
  const defaultNewCategory = { enabled: true };
  const [categories, updateCategoryState] = useState([]);
  const [newCategory, updateNewCategory] = useState(defaultNewCategory);

  const handleInputChange = (event, values) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    updateNewCategory({ ...newCategory, [name]: value });
  };

  categoryAdministrator.getCategories().then(updateCategoryState);
  return (
    <div>
      <h1>Category Administration</h1>

      <section className="category">
        <h2>Current Categories</h2>
        {categories.map((x) =>
          createCategoryEntryDisplay(categoryAdministrator, notify, x)
        )}
      </section>
      <section>
        <h2>Add New Category</h2>

        <form
          className="createCategory"
          onSubmit={(e) => createCategoryEntry(notify, newCategory, e)}
        >
          <TextField
            name="categoryName"
            label="Name"
            onChange={handleInputChange}
          ></TextField>
          <Autocomplete
            multiple
            getOptionLabel={(option) => option || option}
            options={categoryTypes}
            onChange={handleInputChange}
            onInputChange={changeInput}
            renderInput={(params) => (
              <TextField {...params} label="Category Types" name="category" />
            )}
            name="selectCategory"
          />
          <Button>Create</Button>
        </form>
      </section>
    </div>
  );
}
