/*
 * @Author: wangwendie
 * @Date: 2023-06-28 13:59:52
 * @LastEditors: wangwendie
 * @Description: 快递方式
 */
import mongoose from 'mongoose'
import deliveryData from '../../InitData/delivery'

const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
  color: String,
  id: Number,
  is_solid: Boolean,
  text: String
})

DeliverySchema.index({ id: 1 });

const Delivery = mongoose.model("Delivery", DeliverySchema);

Delivery.findOne()
  .then(res => {
    if (!res) {
      Delivery.create(deliveryData);
    }
  })
  .catch(err => {
    console.log(err);
  })

export default Delivery;
