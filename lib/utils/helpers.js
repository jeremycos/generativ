function isValidURL(_string) {
  const matchpattern =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
  return matchpattern.test(_string);
}

function isExpressionFound(_string, data) {
  return data.indexOf(_string) >= 0;
}

module.exports = { isValidURL, isExpressionFound };
