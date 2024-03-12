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



<b class="danger">service 服务的命名规范</b>
```js 
// app/service/biz/user.js 对应到 ctx.service.biz.user
app/service/biz/user.js => ctx.service.biz.user
// app/service/sync_user.js 对应到 ctx.service.syncUser
app/service/sync_user.js => ctx.service.syncUser
// app/service/HackerNews.js 对应到 ctx.service.hackerNews
app/service/HackerNews.js => ctx.service.hackerNews
```




----
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