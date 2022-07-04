/**
 * Add the code at the end of a file
 *
 * @param {code} String The code to insert
 * @param {data} String Represents the file code
 *
 * @returns {newData} String the new file code with inserted code
 */
module.exports = (code, data) => {
  return data + code;
};
