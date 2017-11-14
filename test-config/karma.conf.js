var webpackConfig = require('./webpack.test.js');

module.exports = function(config) {
  var _config = {
    basePath: '../',

    frameworks: ['jasmine'],
//    frameworks: ['jasmine', '@angular/cli'],

    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    files: [
      {
        pattern: './test-config/karma-test-shim.js',
        watched: true
      },
      {
        pattern: './src/assets/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false
      }
    ],

    proxies: {
      '/assets/': '/base/src/assets/'
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },

    preprocessors: {
      './test-config/karma-test-shim.js': ['webpack', 'sourcemap']    },


 //   coverageIstanbulReporter: {
 //     reports: [ 'html', 'lcovonly' ],
 //     fixWebpackSourcePaths: true
 //   },

    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
  
    reporters: config.angularCli && config.angularCli.codeCoverage ? ['progress', 'coverage-istanbul'] : ['progress', 'kjhtml'],
   //reporters: config.coverage ? ['kjhtml', 'dots', 'coverage-istanbul'] : ['kjhtml', 'dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeNoSandbox'],
  //browsers: ['Chrome'],
    singleRun: false,
    junitReporter: {
      outputDir: process.env.JUNIT_REPORT_PATH,
      outputFile: process.env.JUNIT_REPORT_NAME,
      useBrowserName: false
    },
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
//        flags: ['--no-sandbox']
      }
    }
  };

  config.set(_config);
};
