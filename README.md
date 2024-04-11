<style>

    .success {
        padding:5px;
        display:inline;
        color:#1B5E20;
        background-color:#C8E6C9;
    }
    .warning {
        padding:5px;
        display:inline;
        color:#E65100;
        background-color:#FFE0B2;
        width:100%;
    }
    .danger {
        padding:5px;
        display:inline;
        color:#B71C1C;
        background-color:#FFCDD2;
    }
    .info {
        padding:5px;
        display:inline;
        color:#006064;
        background-color:#B2EBF2;
    }
    .doubt {
        padding:5px;
        display:inline;
        color:#AAA;
        background-color:#DDDDDD;
    }
    .asso {
        padding:5px;
        display:inline;
        color:#555;
        background-color:#FFCC00;        
    }
    
    .alert {
        display:inline-block;
        width:100%;
        padding:5px;
        line-height:30px;
        margin-top:10px;
    }
</style>


# Learn-Egg.js
## MVC框架
**V view**       视图模板，处理页面
**C controller** 控制器，负责处理业务逻辑,**负责解析用户的输入，处理后返回相应的结果**。
**M model模型（service）**,负责提供数据（查询数据库，请求数据）
**middleware**, 中间件的功能是在**匹配路由之前或匹配路由完成这两个阶段执行一些操作**。



<b class="success">service 服务的命名规范</b>
```js 
// app/service/biz/user.js 对应到 ctx.service.biz.user
app/service/biz/user.js => ctx.service.biz.user
// app/service/sync_user.js 对应到 ctx.service.syncUser
app/service/sync_user.js => ctx.service.syncUser
// app/service/HackerNews.js 对应到 ctx.service.hackerNews
app/service/HackerNews.js => ctx.service.hackerNews
```


## 中间件 middleware
#### 1. 中间件的配置
一个中间件是一个放置于 app/middleware 目录下的单独文件，需要exports出一个普通函数，有两个参数
- options: 中间件的配置项，通过app.config[$middlewareName]传递进来。例如，在config中增加options配置，`config.middlewareName = {ip:'123'}`之后，在自定义middlewareName的函数中获取options参数时`options.ip`得到的是'123'
- app: application实例
#### 2. 使用中间件
- 在应用中使用中间件（是全局的，会处理每一个请求）。 通过配置文件`config.default.js`中来加载中间件
```js 
    module.exports = {
        // 配置需要的中间件，数组顺序即为中间件的加载顺序
        middleware:['middlewareName1','middlewareName2'],
        // 配置中间件的配置项
        middlewareName1:{key:123}
    }
```
- 在单个router中使用中间件（是局部的，只对单个路由生效）
```js 
// app/router.js 路由文件
module.exports = app => {
    // 加载名为gzip的中间件，且传入配置参数{key: 123}
  const gzip = app.middleware.gzip({ key: 123 });
  // 在某个路由匹配中使用中间件
  app.router.get('/needgzip', gzip, app.controller.handler);    
}
```

- 在框架和插件中使用中间件（是全局的，会处理每一个请求）。框架和插件不支持在 config.default.js 中匹配 middleware
```js 
// 在框架默认中间件中加载自定义的中间件
// app.js
module.exports = app => {
  // 在中间件最前面统计请求时间
  app.config.coreMiddleware.unshift('report');
};

// app/middleware/report.js
// 定义中间件
module.exports = () => {
  return async function(ctx, next) {
    const startTime = Date.now();
    await next();
    // 上报请求时间
    reportTime(Date.now() - startTime);
  };
};
```
应用层定义的中间件<b class="success">app.config.appMiddleware</b>和框架默认中间件<b class="success">app.config.coreMiddleware</b>都会被加载器加载，并挂载到 <b class="success">app.middleware</b>上。



#### 3. 框架默认中间件的配置
框架自身和其他插件也会加载许多中间件，所有这些**自带中间件的配置项**都可以通过**修改配置文件**中的**同名配置项**来进行更改。例如，框架自带的中间件列表中有一个名为 `bodyParser` 的中间件（框架的加载器会将文件名中的分隔符都转换为驼峰形式的变量名）。如果我们想要修改 `bodyParser` 的配置，只需要在 `config/config.default.js` 中编写如下内容
```js 
module.exports = {
  bodyParser: {
    jsonLimit: '10mb',
  },
};
```
<b class="success">框架和插件加载的中间件会在应用层配置的中间件之前被加载。框架默认中间件不能被应用层中间件覆盖。如果应用层有自定义同名中间件，启动时将会报错。</b>

#### 4. 中间件的通用配置
无论是应用层加载的中间件还是框架自带中间件，都支持几个通用的配置项
- enable：控制中间件是否开启
- match: 设置只有符合某些规则的请求才会经过这个中间件。match和ignore不能同时配置。
- ignore：设置符合某些规则的请求不经过这个中间件。match和ignore不能同时配置。

match,ignore支持多种类型的配置方法
- 字符串：当参数为字符串类型时，配置的是一个 url 的路径前缀，所有以配置的字符串作为前缀的 url 都会匹配上。当然，你也可以直接使用字符串数组。
- 正则：当参数为正则时，直接匹配满足正则验证的 url 的路径。
- 函数：当参数为一个函数时，会将请求上下文传递给这个函数，最终取函数返回的结果（true/false）来判断是否匹配。
- 可配合egg-path-matching模块简化match,ignore的设置
```js 
module.exports = {
    bodyParser: {
        // 关闭中间件
        enable: false, 
        //  只对/static前缀开头的url开启，
        match: '/static'
    }
}
```

#### 5. 使用koa的中间件
按照框架的规范来在应用中加载这个 Koa 的中间件：
```js 
// app/middleware/compress.js
// koa-compress 暴露的接口（`(options) => middleware`）和框架对中间件要求一致
module.exports = require('koa-compress');

// config/config.default.js
module.exports = {
  middleware: ['compress'],
  compress: {
    threshold: 2048,
  },
};
```







## 扩展 extend
#### 扩展application 
<b class="success">这里的this 是 app 对象</b>
在controller中访问扩展的application方法 `this.app.foo()`
在application中访问其他扩展的application方法`this.bar()`
在application中访问其他属性 `this.config.abc`
config配置项挂载在application对象上

#### 扩展context
<b class="success">这里的this 是 ctx对象</b>
在controller中访问扩展的context方法`this.ctx.foo()`

#### 扩展request,response
在controller中访问扩展的req,res方法`this.ctx.request.foo()`,`this.ctx.response.bar(0)`

#### 扩展helper
在helper中this指向helper对象自身，可以调用help对象上的其他方法
this.ctx指向context对象
this.app指向application对象
在controller中访问扩展的helper方法,`this.ctx.helper.foo()`
在view视图页面中访问自定义的helper方法`helper.foo()`
helper对象挂载在ctx上 `ctx.helper`



## 常用第三方模块
- silly-datetime
    - 时间日期格式化https://www.npmjs.com/package/silly-datetime
- egg-path-matching
    - 配合控制中间件match,ignore规则使用的路径匹配/忽略模块，也可单独使用 https://www.npmjs.com/package/egg-path-matching



## 踩坑
- ctx.message 是http响应的状态信息，不是传给客户端页面的数据。**如果ctx.message中有中文字符**，egg应用会**提示错误**`Invalid character in statusMessage (code: ERR_INVALID_CHAR)
`
----


课程进度
- lession 1
        1.创建index.html页面，配置公共url路径，从service中获取getNewsList数据
        2.curl方法获取 this.ctx.curl(url)
        3.返回buffer格式数据转成json，将newsList渲染到index.html页面
        4.index.html页面上根据点击每条信息获取文章的aid（controller中新建content方法）,
        同时跳转到newContent.html页面，同时向新页面newContent.html传递aid参数
        5.在newContent.html页面实现，渲染时根据传过来的aid加载对应详情页面。
        6.显示新闻日期（extent方法实现）

- lession 2
        1.创建中间件middleware，根据客户端访问用户的ip地址ctx.request.ip，屏蔽指定的ip,需要屏蔽的ip地址在config中配置
        some遍历比对
        ctx.status=403
        ctx.message='forbidden'  这里返回的是http响应的状态信息，不是传给客户端页面的数据
        2.在config中配置中间件 config.middleware = ['forbiddenIp']
        options是中间件配置项,app是当前应用的Application实例
        config中增加options配置，config.middlewareName = {ip:'123'}之后，在自定义middleware的函数中获取options参数时得到的是{ip:'123'}
        module.exports = (options,app) => {
            return async function(ctx,next){
                await next()
            }
        }

- lession 3
post 提交，CSRF防范
1. home.html页面中创建一个提交表单，地址/home
2. 在HomeController 中增加add函数，用于处理前端页面post提交的数据 this.ctx.request.body
3. egg防止csrf的 web安全机制，只允许签名机制授权访问
在HomeController index函数中增加 await this.ctx.render('home', {csrf: this.ctx.csrf}) 这里是非全局变量
前端页面提交数据时/add?_csrf=<%=csrf%> 获取index函数render时传入的csrf
4. 升级业务逻辑，在middleware中创建一个auth.js中间件，auth函数，设置全局变量，ctx.state.csrf = ctx.csrf,为什么这样写就能设置模板的全局变量？

ctx.state 是 Egg.js 框架中 Context 对象的一个属性，用于在不同中间件之间传递数据或在路由处理函数中存储数据。ctx.state 是一个对象，可以在请求处理过程中的不同阶段（如中间件、路由处理函数）中存储和访问数据。通过 ctx.state，你可以在中间件中设置数据，然后在控制器或者模板中获取这些数据。

主要作用包括但不限于：

传递数据: 可以在中间件中将一些数据存储在 ctx.state 中，然后在后续的中间件或路由处理函数中访问这些数据。
模板渲染: 在模板渲染过程中，可以将一些需要在模板中使用的数据存储在 ctx.state 中，方便模板引擎访问并渲染到页面上。
全局数据: 可以在应用程序的不同地方存储一些全局数据，例如用户信息、配置信息等，方便在整个请求处理周期中访问这些数据。
中间件中通过 ctx.state 存储数据，然后在后续的中间件或路由处理函数中通过 ctx.state 访问这些数据，实现数据的传递和共享。这样有助于组织和管理数据，并提高代码的可读性和维护性。

在Egg框架中，当您使用ctx.state对象将数据添加到模板中时，这些数据会自动传递给ctx.render()方法渲染的模板。Egg.js 内部做了处理，会自动将 ctx.state 中的数据注入到模板渲染的上下文中，使得模板可以直接访问到这些数据。您不需要在ctx.render()方法中显式传入ctx.state对象或其中的特定属性，因为Egg框架会自动将ctx.state对象中的数据传递给模板。

这种自动传递的机制是Egg框架内部实现的一部分，它确保了在渲染模板时可以访问到ctx.state对象中的数据，使得模板中可以直接使用这些数据而无需额外的传递。

因此，即使您没有在ctx.render()方法中显式传入ctx.state.user参数，模板仍然能够获取到ctx.state对象中的用户数据。这样的设计简化了模板渲染的过程，使开发更加便捷和高效。

---
<span class="success">
    test asdfds adasf dfas 
</span>

<span class="alert danger">
    test asdfds adasf dfas 
</span>

<span class="alert info">
    test asdfds adasf dfas 
</span>


<span class="alert success">
    test asdfds adasf dfas 
</span>

<div class="alert warning">python不区分单精度和双精度浮点
数，默认双精度，int也不细分short,long整型)
</div>

<div class="alert asso">python不区分单精度和双精度浮点
数，默认双精度，int也不细分short,long整型)
</div>

<div class="alert doubt">python不区分单精度和双精度浮点
数，默认双精度，int也不细分short,long整型)
</div>