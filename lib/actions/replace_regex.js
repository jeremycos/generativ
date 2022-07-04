/**
 * Replace code found by regex into a string data (file)
 *
 * @param {regex} String The code reference where we place after our code
 * @param {code} String The code to insert
 * @param {isUnique} Boolean There is only one reference in the data or many ?
 * @param {data} String Represents the file code
 *
 * @returns {newData} String the new file code with inserted code
 */
module.exports = (regex, code, isUnique, data) => {
  const newRegex = new RegExp(regex);

  if (isUnique) {
    return data.replace(newRegex, code); //Replace by regex
  } else {
    return data.replaceAll(newRegex, code);
  }
};
