/**
 * Replace a portion of code exactly in a string data (file)
 *
 * @param {reference} String The code reference where we place after our code
 * @param {code} String The code to insert
 * @param {isUnique} Boolean There is only one reference in the data or many ?
 * @param {data} String Represents the file code
 *
 * @returns {newData} String the new file code with inserted code
 */
module.exports = (reference, code, isUnique, data) => {
  if (isUnique) {
    return data.replace(reference, code); //Replace exactly
  } else {
    return data.replaceAll(reference, code);
  }
};
