// 创建一个名称为forbidip的中间件，用于禁止访问指定的IP地址
module.exports = (options, app) => {
  const forbidip = async (ctx, next) => {
    const isFobide = options.forbidips.some((e, i, a) => {
      return e === ctx.request.ip;
    });
    if (isFobide) {
      ctx.status = 403;
      ctx.message = 'you ip is forbid';
      return false;
    }
    // ctx.status = 200;
    // ctx.body = 'welcome to me app';
    await next();

  };
  return forbidip;
};
