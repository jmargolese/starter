var chalk = require("chalk");
var fs = require('fs');
var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

var env = process.env.IONIC_ENV;

if (process.env.MY_ENV) {env = process.env.MY_ENV};

if (env === 'prod' || env === 'dev') {
//  console.log(chalk.red('\n' + 'env = ' + env + ' @app/env =' + path.resolve(environmentPath()) ));
  useDefaultConfig[env].resolve.alias = {
    "@app/env": path.resolve(environmentPath())
  };
} else {
  // Default to dev config
//  console.log(chalk.red('\n' + 'Default config =' + path.resolve(environmentPath()) ));
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    "@app/env": path.resolve(environmentPath())
  };
}

function environmentPath() {
  var filePath = './src/environments/environment' + (env === 'prod' ? '' : '.' + env) + '.ts';
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}

module.exports = function () {
  return useDefaultConfig;
};