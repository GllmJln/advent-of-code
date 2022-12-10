export const deepClone = (object) => {
  return JSON.parse(JSON.stringify(object));
};

export const getUniqueValuesArrays = (array) => {
  return new Set(array.map((value) => JSON.stringify(value)));
};

export const splitArrayIntoChunks = (array, chunkSize) => {
  return array.reduce(
    (previous, _, index, fullArray) =>
      index % chunkSize === 0
        ? [...previous, fullArray.slice(index, index + chunkSize)]
        : previous,
    []
  );
};

export const transpose = (array) => {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
};
