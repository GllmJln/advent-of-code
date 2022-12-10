export const deepClone = (object) => {
  return JSON.parse(JSON.stringify(object));
};

export const getUniqueValuesArrays = (array) => {
  return new Set(array.map((value) => JSON.stringify(value)));
};
