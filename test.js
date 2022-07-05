let code = `module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
`;

let arrayToSelect = "presets";

const selector = eval(code)[arrayToSelect];

selector.push("test");

console.log(selector);
