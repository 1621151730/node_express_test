/*
 * @Author: wangwendie
 * @Date: 2023-06-28 14:28:44
 * @LastEditors: wangwendie
 * @Description: 菜单
 */
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  description: String,
  is_selected: { type: Boolean, default: true },
  icon_url: { type: String, default: '' },
  name: { type: String, isRequired: true },
  id: { type: Number, isRequired: true },
  restaurant_id: { type: Number, isRequired: true },
  type: { type: Number, default: 1 },
  foods: [foodSchema]
});

menuSchema.index({ id: 1 });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;