const Router = require("@koa/router")
const {
    default: to
} = require("await-to-js")
const router = new Router
const userModel = require("../model/User")
const jwt = require('jsonwebtoken')

const { getImgUrl, isUserCreatedThisMonth } = require("../utils");

async function checkExistingUser(field, value) {
    const existingUser = await userModel.findAll({
        where: {
            [field]: value
        },
        raw: true
    });

    if (existingUser.length > 0) {
        return true;
    }

    return false;
}

router.get("/getUserInfo", ctx => {
    let token = ctx.request.header.authorization
    jwt.verify(token, 'token', async (err, decoded) => {
        if (err) {
            console.log(err)
            console.log('Failed to verify token');
        } else {
            // decoded 为解析后的 token 内容
            const iat = decoded.iat;
            const exp = decoded.exp;
            const now = Math.floor(Date.now() / 1000);

            if (now < iat || now > exp) {
                console.log('Token expired');
            } else {
                console.log('Token valid');
            }
            decoded.data.roles = decoded.data.roles && [decoded.data.roles]
            ctx.suc("", decoded.data)
        }
    });
})

router.post("/register", async ctx => {
    let data = ctx.request.body;

    if (data.email === '20478048816@qq.com') {
        data.roles = 'admin'
    } else {
        data.roles = 'user'
    }
    const avatar = await getImgUrl()
    data.avatar = avatar
    const token = jwt.sign({ data }, 'token', { expiresIn: '7d' });

    if (await checkExistingUser('email', data.email)) {
        ctx.err("该邮箱已经被注册!");
        return;
    }
    if (await checkExistingUser('name', data.name)) {
        ctx.err("该用户名已经被注册!");
        return;
    }
    // 如果不存在相同邮箱或者用户名的用户，创建一个新的用户，并将其保存到数据库中
    const [err, newUser] = await to(
        userModel.create({
            email: data.email,
            name: data.name,
            password: data.password,
            roles: data.roles,
            avatar
        })
    );
    newUser.dataValues.token = token
    if (err) {
        ctx.err("添加失败", err);
        console.log('err', err);
    } else {
        console.log('添加成功');
        ctx.suc("添加成功", newUser);
    }
});

router.post("/login", async ctx => {
    let data = ctx.request.body
    if (data.email === '20478048816@qq.com') {
        data.roles = 'admin'
    } else {
        data.roles = 'user'
    }
    const [err, newUser] = await to(
        userModel.findAll({
            where: {
                email: data.email
            },
            raw: true
        })
    )
    const len = newUser.length
    if (!len) {
        ctx.err("登录失败", err)
        console.log('err', err)
        return
    } else {
        data = {
            ...data,
            name: newUser[0].name
        }
        const token = jwt.sign({ data }, 'token', { expiresIn: '7d' });
        console.log("🚀 ~ token:", token)
        if ((newUser[0].password + '') === (data.password + '')) {
            ctx.suc("登录成功!", { ...data, token })
        } else {
            ctx.err("密码错误！", err)
        }
    }
})

router.post("/logout", async ctx => {
    ctx.suc("注销成功!")
})

router.post("/resetPassword", async ctx => {
    let data = ctx.request.body
    const [err, succ] = await to(
        userModel.update({ password: data.password }, {
            where: {
                email: data.email,
            },
            raw: true
        })
    )
    if (err) {
        ctx.err("修改密码失败", { success: false })
        console.log('err', err)
        return
    } else {
        console.log(succ)
        if (succ[0] === 1) {
            ctx.suc("修改密码成功!", { success: true })
        } else {
            ctx.err("邮箱未注册!", { success: false })
        }
    }
})

router.post("/getAllUsers", async ctx => {
    const [err, allUsers] = await to(
        userModel.findAll({})
    )
    let length = 0;
    allUsers.forEach(user => {
        if (isUserCreatedThisMonth(user.dataValues.createTime)) {
            length = length + 1
        }
    })
    if (err) {
        ctx.err("查找用户失败", { success: false })
        console.log('err', err)
        return
    } else {
        ctx.suc("查找用户数量成功!", { totalNum: allUsers.length, curMonthNum: length })
    }
})

router.post("/relaxAssessment", async ctx => {
    const data = ctx.request.body;
    const { email, firstWenJuanAnswer, secondWenJuanQuestion, corrFunc } = data
    const [err, user] = await to(
        userModel.update({ hasUnFinish: true, firstWenJuanAnswer, secondWenJuanQuestion, corrFunc }, {
            where: {
                email,
            },
            raw: true
        })
    )
    if (err) {
        ctx.err("添加失败", err);
    }
    ctx.suc("下次再继续成功!", { success: true })
})

router.post("/getSecondWenjuan", async ctx => {
    const data = ctx.request.body;
    const { email } = data
    const [err, user] = await to(
        userModel.findAll({
            where: {
                email
            },
            raw: true
        })
    )
    if (err) {
        ctx.err("添加失败", err);
    }
    const { firstWenJuanAnswer, hasUnFinish, secondWenJuanQuestion, corrFunc } = user[0]
    ctx.suc("获取第二份问卷成功！", { hasUnFinish: !!hasUnFinish, firstWenJuanAnswer, secondWenJuanQuestion, corrFunc })
})

router.post("/clearSecondWenjuan", async ctx => {
    const data = ctx.request.body;
    const { email } = data
    const [err, user] = await to(
        userModel.update({ hasUnFinish: false, firstWenJuanAnswer: [], secondWenJuanQuestion: [], corrFunc: '' }, {
            where: {
                email,
            },
            raw: true
        })
    )
    if (err) {
        ctx.err("添加失败", err);
    }
    ctx.suc("情况第二份问卷成功！", { success: true })
})

module.exports = router.routes()
