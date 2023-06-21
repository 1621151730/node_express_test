/*
 * @Author: wangwendie
 * @Date: 2023-06-20 09:57:24
 * @LastEditors: wangwendie
 * @Description: id的模块
 */
import formidable from "formidable";
import Ids from "../models/ids";
import path from 'path';
import fs from 'fs'
import gm from 'gm';

export default class BaseComponent{
  constructor(){
    this.idlist=["admin_id","img_id"];
    this.getId = this.getId.bind(this);
    this.getPath = this.getPath.bind(this);
  }

  async getId(type){

    if(!this.idlist.includes('admin_id')){
      console.log('id类型错误');
			throw new Error('id类型错误');
			return
    }

    try {
      const idData = await Ids.findOne();
      // 得到对象,自增
      idData[type]++;
      await idData.save();
      return idData[type]
    } catch (err) {
      console.log('获取ID数据失败');
			throw new Error(err)
    }
  }

  async getPath(req, res){
    return new Promise((resolve, reject) => {
      const form = formidable.IncomingForm();
      // 上传了图片了
      form.uploadDir = './public/img';

      form.parse(req, async (err, fields, files) => {

        let img_id;
        try {
          img_id = await this.getId('img_id');
        } catch (err) {
          console.log('获取图片id失败');
          // 文件不对，用于同步删除文件
					fs.unlinkSync(files.file.path);
					reject('获取图片id失败');
        }

        const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
        console.log(files);
        const extname = path.extname(files.file.name);
        if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
					fs.unlinkSync(files.file.path);
					res.send({
						status: 0,
						type: 'ERROR_EXTNAME',
						message: '文件格式错误'
					})
					reject('上传失败');
					return
				}

        const fullName = hashName + extname;
				const repath = './public/img/' + fullName;

        try {
          // 重命名文件
					fs.renameSync(files.file.path, repath);
          // 切割图片
          gm(repath)
          .resize(200, 200, "!")
          .write(repath, async (err) => {
						// if(err){
						// 	console.log('裁切图片失败');
						// 	reject('裁切图片失败');
						// 	return
						// }
						resolve(fullName)
					})

        } catch (err) {
          console.log('保存图片失败', err);
					if (fs.existsSync(repath)) {
						fs.unlinkSync(repath);
					} else {
						fs.unlinkSync(files.file.path);
					}
					reject('保存图片失败')
        }
      })
    })
  }
}