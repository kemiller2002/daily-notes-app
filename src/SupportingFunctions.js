function formatDateString(input) {
  if (input) {
    const date = new Date(input);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
  return "";
}

export { formatDateString };
