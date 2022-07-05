const { isExpressionFound } = require("../utils/helpers");
const messages = require("../utils/console");

/**
 * Inserts a code before a reference founded in a string data (file)
 *
 * @param {reference} String The code reference where we place before our code
 * @param {code} String The code to insert
 * @param {isUnique} Boolean There is only one reference in the data or many ?
 * @param {data} String Represents the file code
 *
 * @returns {newData} String the new file code with inserted code
 */
module.exports = (reference, code, isUnique, data) => {
  if (isExpressionFound(reference, data)) {
    console.log(
      messages.expressionFound.color + messages.expressionFound.message,
      reference
    );
    if (isUnique) {
      return data.replace(reference, code + reference); //Insert after
    } else {
      return data.replaceAll(reference, code + reference);
    }
  } else {
    console.log(
      messages.expressionNotFound.color + messages.expressionNotFound.message,
      reference
    );
  }
};
