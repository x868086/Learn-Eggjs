/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1710328773626_9597';

  // 添加session的配置项
  config.session = {
    key: 'aaaa',
    encrypt: true,
  };

  // add your middleware config here
  config.middleware = ['auth', 'forbidip'];
  config.forbidip = {
    forbidips: ['192.168.1.15'],
  };

  // 自定义配置项
  config.api = 'http://www.phonegap100.com/';

  // 配置ejs模板引擎
  config.view = {
    mapping: {
      '.ejs': 'ejs',
      '.html': 'ejs',
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
