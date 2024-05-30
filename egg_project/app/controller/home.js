const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const list = await this.service.news.getNewsList();
    const user = await this.service.user.getUserInfo();
    await this.ctx.render('home.ejs', {
      list, user,
      // _csrf: this.ctx.csrf,  //中间件auth.js中已经添加了csrf token，这里不需要再添加
    });
  }

  async add() {
    // console.log(this.ctx.csrf);
    // console.log(this.ctx.request.body);
    console.log(11111111111111111111111);
    this.ctx.session.maxAge = 1000;
    console.log(this.ctx.session);
  }

  async testSession() {
    this.ctx.session.userInfo1 = { username: 'jack', age: 18 };
    console.log(this.ctx.session);
    this.ctx.session.userInfo2 = { userid: 123 };
    // this.ctx.session.userInfo3 = { contenxt: 'context str content' };
  }

  // 读取文件的方法

}

module.exports = HomeController;
