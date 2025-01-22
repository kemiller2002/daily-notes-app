function createNumericalId(date) {
  return (date || new Date()).getTime();
}

function createTimeStampId(date) {
  return createNumericalId(date);
}

function getDateFromTimeStampId(id) {
  return new Date(Number.parseInt(id));
}

export { createNumericalId, createTimeStampId, getDateFromTimeStampId };
