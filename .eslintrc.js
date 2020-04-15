module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    "no-unneeded-ternary": 0,//禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
    "camelcase": 0,//强制驼峰法命名
    "no-cond-assign": 0,//禁止在条件表达式中使用赋值语句
    "no-constant-condition": 0,//禁止在条件中使用常量表达式 if(true) if(1)
    "no-label-var": 0, //label名不能与var声明的变量名相同
    "no-inner-declarations": [0, "functions"], //禁止在块语句中使用声明（变量或函数）

    "no-eq-null": 0,//禁止对null使用==或!=运算符
    "eqeqeq": 0, //必须使用全等
    "semi": [0, "always"],//语句强制分号结尾
    "no-mixed-spaces-and-tabs": 0, // 禁止混用tab和空格
    "no-multi-spaces": 0, // 不能用多余的空格
    "no-multiple-empty-lines": [1, {"max": 5}], // 空行最多不能超过2行
    "spaced-comment": 0,// 注释风格要不要有空格什么的
    "quotes": [0, "single"],//引号类型 `` "" ''
    "quote-props":[0, "always"],//对象字面量中的属性名是否强制双引号
    "space-before-function-paren": [0, "always"],//函数定义时括号前面要不要有空格
    "generator-star-spacing": 0,//生成器函数*的前后空格
    "no-spaced-func": 0,//函数调用时 函数名与()之间不能有空格
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
