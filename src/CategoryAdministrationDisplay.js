import { React, useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import { Switch } from "@mui/material";
import { reducer, createRailReducerFunction } from "./Reducer";

const label = { inputProps: { "aria-label": "Toggle category enabled" } };

function tryCatch(fn) {
  return function (data) {
    try {
      return fn(data);
    } catch {
      return null;
    }
  };
}

function createCategoryEntryDisplay(
  administrator,
  updateState,
  notify,
  category
) {
  const change = (e) => {
    const updatedCategory = {
      ...category,
      enabled: e.target.checked,
    };

    administrator.saveCategory(updatedCategory);

    updateState(updatedCategory);
  };

  return (
    <div className="category" key={`category-container-${category.id}`}>
      <span className="label">{category.name}</span>
      <Switch
        key={category.id}
        {...label}
        checked={category.enabled}
        className="enabled"
        onChange={change}
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

function createCategoryEntry(
  categoryAdministrator,
  notify,
  loadCategories,
  data,
  e
) {
  e.preventDefault();

  return categoryAdministrator.saveCategory(data).then((x) => {
    loadCategories();
    return x;
  });
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
    updateNewCategory({ ...newCategory, [name]: values || value });
  };

  const loadCategories = () => {
    return categoryAdministrator.getCategories().then(updateCategoryState);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const updateSingleCategoryState = (newCategory) => {
    const newList = categoryAdministrator.makeUniqueCategoryList(
      categories,
      newCategory
    );

    updateCategoryState(newList);
  };

  return (
    <div>
      <h1>Category Administration</h1>

      <section className="category">
        <h2>Current Categories</h2>
        {categories.map((x) =>
          createCategoryEntryDisplay(
            categoryAdministrator,
            updateSingleCategoryState,
            notify,
            x
          )
        )}
      </section>
      <section>
        <h2>Add New Category</h2>

        <form
          className="createCategory"
          onSubmit={(e) =>
            createCategoryEntry(
              categoryAdministrator,
              notify,
              loadCategories,
              newCategory,
              e
            )
          }
        >
          <TextField
            name="name"
            label="Name"
            onChange={handleInputChange}
            value={newCategory.name || ""}
          ></TextField>
          <Autocomplete
            multiple
            getOptionLabel={(option) => option || option}
            options={categoryTypes}
            onChange={(e, v) => {
              handleInputChange({ target: { name: "categories" } }, v);
            }}
            onInputChange={changeInput}
            renderInput={(params) => (
              <TextField {...params} label="Category Types" name="category" />
            )}
            name="selectCategory"
          />
          <Button type="submit">Create</Button>
        </form>
      </section>
    </div>
  );
}
