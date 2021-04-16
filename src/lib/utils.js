export function sortByStringField(list, field, dir = "ASC") {
  return list.sort((a, b) => {
    const fieldA = a[field]?.toLowerCase() ?? "";
    const fieldB = b[field]?.toLowerCase() ?? "";
    if (fieldA < fieldB) {
      return dir === "ASC" ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return dir === "ASC" ? 1 : -1;
    }
    return 0;
  });
}

export function sortByDateField(list, field, dir = "ASC") {
  return list.sort((a, b) => {
    const dateA = a[field]?.toDate() ?? new Date();
    const dateB = b[field]?.toDate() ?? new Date();
    if (dir === "DESC") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}

export function sortByNumberField(list, field, dir = "ASC") {
  return list.sort((a, b) => {
    const fieldA = a[field] ?? 0;
    const fieldB = b[field] ?? 0;
    if (dir === "ASC") {
      return fieldA - fieldB;
    } else {
      return fieldB - fieldA;
    }
  });
}
