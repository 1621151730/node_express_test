/*
 * @Author: wangwendie
 * @Date: 2023-06-28 10:56:45
 * @LastEditors: wangwendie
 * @Description: 分类
 */
import mongoose from "mongoose";
import categoryData from '../../InitData/category'

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  count: Number,
  id: Number,
  ids: [],
  image_url: String,
  level: Number,
  name: String,
  sub_categories: [
    {
      count: Number,
      id: Number,
      image_url: String,
      level: Number,
      name: String
    },
  ]
})

// 设置静态方法
categorySchema.statics.addCategory = async function (type) {
  // 上传进来食品种类
  const categoryName = type.split('/');
  try {
    const allcate = await this.findOne();
    const subcate = await this.findOne({ name: categoryName[0] });
    allcate.count++;
    subcate.count++;
    subcate.sub_categories.map(item => {
      if (item.name == categoryName[1]) {
        return item.count++
      }
    })
    await allcate.save();
    await subcate.save();
    console.log('保存cetegroy成功');
    return
  } catch (err) {
    console.log('保存cetegroy失败');
    throw new Error(err)
  }
}

const Category = mongoose.model("Category", categorySchema);

// 如果数据库没有值，就新创建数据

Category.findOne()
  .then(res => {
    if (!res) {
      for (let i = 0; i < categoryData.length; i++) {
        Category.create(categoryData[i]);
      }
    }
  })
  .catch(err => {
    console.log(err);
  })

export default Category;