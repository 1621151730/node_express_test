/*
 * @Author: wangwendie
 * @Date: 2023-06-14 15:12:50
 * @LastEditors: wangwendie
 * @Description: admin的模块
 */
import chalk from "chalk";
import crypto from "crypto";
import dtime from 'time-formater'
import formidable from "formidable";
import AdminModel from "../../models/admin/admin.js";

class Admin{

  constructor(){
    // 给参数绑定一些自带的函数，比如encryption()、Md5()
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  async login(req, res, next){
    const form = new formidable.IncomingForm();

    form.parse(req, async(err, fields, files) => {

      if(err){
        res.send(errSendMessage("FORM_DATA_ERROR","表单信息错误"));
        return
      }

      const {user_name, password, status = 1} = fields;

      // 验证表单是否正确
      try {
        if(!user_name){
          // 引发报错，去catch中
          throw new Error('缺少参数：用户名参数错误');
        }else if(!password){
          throw new Error('缺少参数：密码参数错误');
        }
      } catch (err) {
        res.send("GET_ERROR_PARAM", errSendMessage(err.message))
      }

      // 验证密码与账号的可行性
      const newpassword = this.encryption(password);

      try {
        const admin = await AdminModel.findOne({user_name})

        if(!admin){
           // 开启注册，或者提示注册
           res.send({
            status:0,
            type: "GET_ERROR_RESULT",
            message: "该用户不存在，请前往注册"
           })
        }else if(newpassword.toString() != admin.password.toString()){
          console.log(
            chalk.red("登录密码有误")
          );
          res.send({
            status:0,
            type: "GET_ERROR_RESULT",
            message: "该用户存在，密码输入错误"
          })
        }else{
          // 是将用户的管理员ID（admin.id）保存到会话（session）中
          req.session.admin_id = admin.id;
          res.send(successSendMessage("登录成功"))
        }
      } catch (err) {
        console.log('登录管理员失败', err);
        res.send({
          status:0,
          type: "LOGIN_ADMIN_FAILED",
          message: "登录管理员失败"
        })
      }
      // res.send({user_name, password, status})
    })
  }

  async register(req, res, next){
    const from = formidable.IncomingForm();

    from.parse(req, async(err, fields, files) => {

      if(err){
        res.send({
          status:0,
          type: "FORM_DATA_ERROR",
          message: "表单信息错误"
         });
        return
      }

      const {user_name, password, status = 1} = fields;
      try{
				if(!user_name){
          // 引发报错，去catch中
          throw new Error('缺少参数：用户名参数错误');
        }else if(!password){
          throw new Error('缺少参数：密码参数错误');
        }
			}catch(err){
				res.send({
          status:0,
          type: "GET_ERROR_PARAM",
          message: err.message
         })
				return
			}

      try {
        const admin = await AdminModel.findOne({user_name});
        console.log(admin);
        if(admin){
          console.log('该用户已经存在');
					res.send( {
            status:0,
            type: "USER_HAS_EXIST",
            message: "该用户已经存在"
          });
        }else{
          const adminTip = status == 1 ? "管理员" : "超级管理员";
          // const admin_id = await this.getId("admin_id");
          const admin_id = 1008612;
          const newpassword = this.encryption(password);
          const newAdmin = {
            user_name: user_name,
            password: newpassword,
						id: admin_id,
						create_time: dtime().format('YYYY-MM-DD'),
						admin: adminTip,
						status: status,
          }
          await AdminModel.create(newAdmin);
          req.session.admin_id = admin_id;
          res.send({
            status:200,
            success: '注册管理员成功'
          });
        }
      } catch (err) {
        console.log('注册管理员失败', err);
				res.send({
          status:0,
          type: "REGISTER_ADMIN_FAILED",
          message: "注册管理员失败"
        })
      }
    })
  }

  async singout(req, res, next){
    console.log(chalk.red(req.session));
    try {
      delete req.session.admin_id;
      res.send({
				status: 1,
				success: '退出成功'
			})
    } catch (err) {
      console.log('退出失败', err)
			res.send({
				status: 0,
				message: '退出失败'
			})
    }
  }

  encryption(password){
    // 加密存储，因为不法黑客会盗窃账号密码
    // 自定义截取 2 到 7 拼接，再进行md5，不说谁想得到
    const newpassword = this.Md5(this.Md5(password).substring(2,7) + this.Md5(password));
    return newpassword;
  }

  Md5(password){
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest("base64");
  }

}

export default new Admin();