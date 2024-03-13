const { Service } = require('egg');

class UserService extends Service {
    async getUserInfo() {
        const user = {
            name: '张三',
            age: 18,
        };
        return user;
    }
}

module.exports = UserService;
