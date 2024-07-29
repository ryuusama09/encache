//import standard from "@eslint/js"
const standard = require("@eslint/js")
module.exports = [
  standard.configs.recommended,
  {
    ignores :[
      'node_modules'
    ],
    rules: {
      curly :'error'
    },
    languageOptions : {
      ecmaVersion : "latest"
  },
}
]