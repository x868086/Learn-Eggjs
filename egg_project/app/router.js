/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/news', controller.news.index);
  router.get('/newscontent', controller.news.content);
  router.post('/add', controller.home.add);
  router.get('/home', controller.home.testSession);
  router.get('/home2', controller.home.add);
};
