/**
 * Add code between found by regex and update it directly with js code
 *
 * Example: select "plugins" into babel.config.js and plugins.push(mycode to push).
 *
 * @param {regex} String The code regex where we select the code
 * @param {code} String The code to execute
 * @param {data} String Represents the file code
 *
 * @returns {newData} String the new file code with inserted code
 */
module.exports = (reference, code, data) => {
  const referenceWithoutCode = reference.replace("$code", "");

  const newRegex = new RegExp(referenceWithoutCode);

  const partBefore = reference.split("$code")[0];
  const partAfter = reference.split("$code")[1];

  const dataDivided = data.match(
    new RegExp(
      "(?<firstPart>" + partBefore + ")(?<secondPart>" + partAfter + ")"
    )
  );

  const firstData = dataDivided.groups?.firstPart;
  const secondData = dataDivided.groups?.secondPart;

  const newCode = firstData + code + secondData;

  return data.replace(newRegex, newCode);
};
