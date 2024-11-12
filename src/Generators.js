function createNumericalId(date) {
  return (date || new Date()).getTime();
}

export { createNumericalId };
