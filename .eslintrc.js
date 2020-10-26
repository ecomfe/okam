module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:vue/recommended'
    ],
    'globals': {
        'App': 'readonly',
        'Page': 'readonly',
        'swan': 'readonly',
        'getApp': 'readonly',
        'getCurrentPages': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'vue'
    ],
    'rules': {
        "vue/max-attributes-per-line": [2, {
            "singleline": 10,
            "multiline": {
                "max": 1,
                "allowFirstLine": false
            }
        }],
        "vue/singleline-html-element-content-newline": "off",
        "vue/multiline-html-element-content-newline": "off",
        "vue/name-property-casing": ["error", "PascalCase"],
        'indent': [
            'error',
            4
        ],
        'vue/html-indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'semi': [
            'error',
            'always'
        ],
        'camelcase': [
            'error'
        ],
        'no-empty': 'off',
        'quotes': [
            'error',
            'single'
        ]
    }
};
