var path = require("path");
const fs = require("fs");

const {
  add_after,
  add_before,
  replace_exact,
  remove_exact,
  replace_regex,
  add_first,
  add_between,
} = require("../actions");
const messages = require("../utils/console");

const directory = "."; // We execute globally only in the directory selected

/**
 * Look for a file by filePath in directory we are placed, and execute the specific instruction on this file
 *
 * @param {instruction} Object The instruction to execute. Includes file, mode, actions properties
 * @param {params} Object The parameters to execute.
 */
module.exports = async (instruction, params) => {
  const fileName = instruction?.file;

  return new Promise((resolve, reject) => {
    var finder = require("findit")(directory);
    const files = [];

    var totalFilesFound = 0;

    finder.on("file", function (file) {
      if (file.includes(fileName)) {
        totalFilesFound++;
        files.push(file);
      }
    });

    finder.on("error", reject);

    finder.on("end", () => {
      console.log(
        messages.startingInstruction.color +
          messages.startingInstruction.message,
        `updating file ${fileName}..`
      );

      if (totalFilesFound === 0) {
        console.log(messages.noFileFound.color, messages.noFileFound.message);
        return;
      }

      if (totalFilesFound === 1) {
        const file = files[0];

        console.log(
          messages.fileFound.color + messages.fileFound.message,
          file
        );

        //if the file is found, we read the content of it and print it to the console
        fs.readFile(file, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          var newData = instruction?.actions?.reduce((acc, item) => {
            //We use reduce to save/accumulate the modifications on the new code

            //Check & get variables
            if (item?.variables?.length > 0) {
              item.variables.map((variable) => {
                var check = variable?.name in params;

                if (check) {
                  item.code = item.code.replace(
                    `%${variable.name}`,
                    params[variable.name]
                  );

                  console.log(
                    messages.replacedCode.color + messages.replacedCode.message,
                    `%${variable?.name}`,
                    params[variable.name]
                  );
                }
              });
            }

            //Execute actions on code

            switch (item.type) {
              case "add_after":
                return add_after(item.reference, item.code, item.isUnique, acc);
              case "replace_exact":
                return replace_exact(
                  item.reference,
                  item.code,
                  item.isUnique,
                  acc
                );
              case "remove_exact":
                return remove_exact(
                  item.reference,
                  item.code,
                  item.isUnique,
                  acc
                );
              case "replace_regex":
                return replace_regex(
                  item.reference,
                  item.code,
                  item.isUnique,
                  acc
                );
              case "add_before":
                return add_before(
                  item.reference,
                  item.code,
                  item.isUnique,
                  acc
                );
              case "add_first":
                return add_first(item.code, acc);
              case "add_end":
                return add_end(item.code, acc);
              case "add_between":
                return add_between(item.reference, item.code, acc);
              default:
                return acc;
            }
          }, data);

          if (newData !== data && newData !== "") {
            fs.writeFile(file, newData, { flag: "w+" }, () => {
              console.log(
                messages.fileModified.color + messages.fileModified.message,
                file
              );
              resolve();
            });
          } else {
            console.log(
              messages.fileNotModified.color + messages.fileNotModified.message,
              file
            );
            return;
          }
        });
      }

      //if many files with the same filepath, we don't execute the script. Need to be more precise
      if (totalFilesFound > 1) {
        console.log(
          messages.manySameFiles.color + messages.manySameFiles.message,
          files
        );
        return;
      }
    });
  });
};
