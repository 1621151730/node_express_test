import UserModel from "../../models/v2/user";
import AddressComponent from "../../prototype/AddressComponent";
import UserInfoModel from '../../models/v2/userInfo'
import formidable from "formidable";
import crypto from 'crypto'
import dtime from 'time-formater'

class User extends AddressComponent {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.signIn = this.signIn.bind(this);
    this.encryption = this.encryption.bind(this);

  }

  async login (req, res, next) {
    console.log(req.cookies);
    const cap = req.cookies.cap;

    if (!cap) {
      console.log('验证码失效')
      res.send({
        status: 0,
        type: 'ERROR_CAPTCHA',
        message: '验证码失效',
      })
      return
    }

    // const form = new formidable.IncomingForm();
    // form.parse(req, async (err, fields, files) => {

    const { username, password, captcha_code } = req.body;

    try {
      if (!username) {
        throw new Error('用户名参数错误');
      } else if (!password) {
        throw new Error('密码参数错误');
      } else if (!captcha_code) {
        throw new Error('验证码参数错误');
      }
    } catch (err) {
      console.log('登陆参数错误', err);
      res.send({
        status: 0,
        type: 'ERROR_QUERY',
        message: err.message,
      })
      return
    }

    if (cap.toString() !== captcha_code.toString()) {
      res.send({
        status: 0,
        type: 'ERROR_CAPTCHA',
        message: '验证码不正确',
      })
      return
    }

    const newpassword = this.encryption(password);

    try {
      const user = await UserModel.findOne({ username });

      // 获取用户信息
      if (!user) {
        console.log("没有该账号");
        res.send({
          status: 200,
          message: "该账号没有被注册"
        })
      } else if (user.password.toString() !== newpassword.toString()) {
        console.log('用户登录密码错误')
        res.send({
          status: 0,
          type: 'ERROR_PASSWORD',
          message: '密码错误',
        })
        return
      } else {
        req.session.user_id = user.user_id;
        const userinfo = await UserInfoModel.findOne({ user_id: user.user_id }, '-_id');
        res.send(userinfo);
      }

    } catch (err) {
      console.log('用户登陆失败', err);
      res.send({
        status: 0,
        type: 'SAVE_USER_FAILED',
        message: '登陆失败',
      })
    }
    // })
  }

  async signIn (req, res, next) {
    const { username, password } = req.body;
    try {
      if (!username) {
        throw new Error('用户名参数错误');
      } else if (!password) {
        throw new Error('密码参数错误');
      }
    } catch (err) {
      console.log('注册参数错误', err);
      res.send({
        status: 0,
        type: 'ERROR_QUERY',
        message: err.message,
      })
      return
    }
    const newpassword = this.encryption(password)
    try {
      const user_id = await this.getId('user_id');
      const registe_time = dtime().format('YYYY-MM-DD HH:mm');
      const newUser = { username, password: newpassword, user_id };
      const newUserInfo = { username, user_id, id: user_id, city: "未知的外星地点", registe_time, };
      await UserModel.create(newUser);
      // UserInfoModel 两种保存都一样的效果
      const createUser = new UserInfoModel(newUserInfo);
      const userinfo = await createUser.save();

      req.session.user_id = user_id;
      res.send({
        status: 200,
        success: '用户注册成功',
        message: userinfo
      })
    } catch (err) {
      console.log("注册用户失败");
      res.send({
        status: 200,
        message: "用户注册失败"
      })
    }
  }

  encryption (password) {
    const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
    return newpassword
  }
  Md5 (password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
  }
}


export default new User();