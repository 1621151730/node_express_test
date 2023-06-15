/*
 * @Author: wangwendie
 * @Date: 2023-06-14 15:12:50
 * @LastEditors: wangwendie
 * @Description: admin的模块
 */
import chalk from "chalk";
import AdminModel from "../../models/admin/admin.js";


class Admin{

  constructor(){
    this.login = this.login.bind(this);
  }

  async login(req, res, next){
    console.log();
    const {user_name} = req.query;
    // console.log(res);
    const admin = await AdminModel.findOne({user_name})
    console.log(chalk.green(`数据:${admin}`));
    res.send(admin)
  }
}

export default new Admin();