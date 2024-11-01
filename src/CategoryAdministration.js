import React from "react";

export default function CategoryAdministration(communicator) {
  let categories = [
    { label: "The Godfather", id: 1 },
    { label: "Pulp Fiction", id: 2 },
  ];

  this.getCategories = function () {
    return Promise.resolve((x) => {
      return categories;
    });
  };

  this.updateCategory = function (category) {
    categories = categories.reduce((s, i) => {
      const current = category.id === i.id ? category : i;
      return [...s, current];
    }, []);

    return Promise.resolve((x) => category);
  };
}
