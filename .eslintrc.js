module.exports = {
  plugins: [
    "@typescript-eslint",
    "prettier",
    'typescript-sort-keys',
    'react-hooks',
    'sort-keys-fix',
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:typescript-sort-keys/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "ecmaVersion": 2020,
    "sourceType": "module",
    tsconfigRootDir: __dirname,
    // project: ["./tsconfig.json"],
  },
  env: {
    "es6": true,
    "browser": true,
    "node": true
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: false,
        trailingComma: 'all',
        arrowParens: 'avoid',
        endOfLine: 'lf',
      },
    ],
    "no-debugger": "off",
    "no-console": 0,
    "no-underscore-dangle": "off",
    "@typescript-eslint/naming-convention": "off",
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/static-property-placement': 0,
    'jsx-a11y/alt-text': 0,
    'react/jsx-props-no-spreading': 0,
    "@typescript-eslint/no-explicit-any": "off",
    'linebreak-style': ["error", "unix"],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'import/no-unresolved': ['error', {ignore: ['\\.d.ts$']}],
    "import/prefer-default-export": ["off"],
    'import/no-default-export': 'error',
    'import/no-unassigned-import': ['error', {"allow": ["**/*.css"]}],
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index', 'object'],
        alphabetize: {order: 'asc', caseInsensitive: true},
        'newlines-between': 'always',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    "sort-keys-fix/sort-keys-fix": "error",
    "@typescript-eslint/no-empty-function": "off"
  },
  "settings": {
    "import/resolver": {
      "node": {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"]
      }
    }
  },
  "ignorePatterns": [".idea/*", "artifacts/*", "_dist/*", "node_modules/*", ".eslintrc.js", "contract/*"],
}
