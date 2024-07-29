//import standard from "@eslint/js"
const standard = require("@eslint/js")
const globals = require("globals")
module.exports = [
  standard.configs.recommended,
  { 
    ignores :[
      'node_modules',
      '__test__/'
    ],
    rules: {
      curly :'error'
    },
    languageOptions : {
      ecmaVersion : "latest",
      globals: {
        ...globals.node,
        myCustomGlobal: "readonly"
    }
  },
}
]