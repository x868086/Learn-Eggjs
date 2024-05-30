module.exports = (options, app) => {
  const auth = async (ctx, next) => {
    // 添加crsf token
    ctx.state.csrf = ctx.csrf;
    await next();
  };
  return auth;
};
