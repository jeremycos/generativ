module.exports = {
  JSONisValid: {
    message: "JSON provided is correct",
    color: "\x1b[32m",
  },
  gettingURL: {
    color: "\x1b[0m",
    message: `\nGetting json from %s...\n`,
  },
  noValidJSON: {
    message:
      "\nNo valid json format. Please read the doc to provide a correct json file.",
    color: "\x1b[32m",
  },
  noCorrectMode: {
    message: "Invalid mode given for instruction %i",
    color: "\x1b[31m",
  },
  noValidUrl: {
    message: "\nNo valid uid or url. Use --get uid or --get yoururl.json",
    color: "\x1b[31m",
  },
  startingInstruction: {
    color: "\x1b[0m",
    message: `\nStarting instruction - %s`,
  },
  expressionFound: {
    message: '✅ Insert code: Expression "%s" found',
    color: "\x1b[32m",
  },
  expressionNotFound: {
    message: '❌ Insert code: Expression "%s" not found',
    color: "\x1b[31m",
  },
  replacedCode: {
    message: "✅ Replaced %s with %s",
    color: "\x1b[32m",
  },
  fileModified: {
    message: "✅ File modified: %s",
    color: "\x1b[32m",
  },
  fileNotModified: {
    message: "❌ File not modified: %s",
    color: "\x1b[31m",
  },
  fileFound: {
    message: "✅ File found: %s",
    color: "\x1b[32m",
  },
  noFileFound: {
    message: "❌ No file found in the directory",
    color: "\x1b[31m",
  },
  manySameFiles: {
    message: "❌ There are many files with the same name. Here is the list : ",
    color: "\x1b[31m",
  },
};
