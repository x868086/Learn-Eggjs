const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const list = await this.service.news.getNewsList();
    const user = await this.service.user.getUserInfo();
    await this.ctx.render('home.ejs', {
      list, user,
    });
  }
}

module.exports = HomeController;
