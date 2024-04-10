const { Controller } = require('egg');

class NewsController extends Controller {
  async index() {
    const msg = 'hello ejs';
    const list = await this.service.news.getNewsList();
    console.log(list);
    await this.ctx.render('newsIndex.html', {
      msg, list,
    });
  }

  async content() {
    const aid = this.ctx.query.aid;
    const content = await this.service.news.getNewsContent(aid);
    await this.ctx.render('newsContent.html', { content });
  }
}

module.exports = NewsController;

