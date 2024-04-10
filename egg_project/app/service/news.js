const { Service } = require('egg');

class NewsService extends Service {
  async getNewsList() {
    const result = await this.ctx.curl(`${this.config.api}appapi.php?a=getPortalList&catid=20&page=1`);
    // console.log(JSON.parse(result.data).result);
    const list = JSON.parse(result.data).result;
    return list;
  }

  async getNewsContent(aid) {
    const result = await this.ctx.curl(`${this.config.api}appapi.php?a=getPortalArticle&aid=${aid}`);
    const content = JSON.parse(result.data).result[0];
    console.log(1111214222222);
    return content;
  }
}


module.exports = NewsService;

