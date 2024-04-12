const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TireSchema = new Schema({
    manufacturer: {type: Schema.ObjectId, ref: 'Manufacturer', required: true},
    model_name: {type: String, required: true},
    size: {type: String, required: true},
    info: {type: String, required: true},
    sku: {type: String, required: true},
    category: {type: Schema.ObjectId, ref: 'Category', required: true},
    stock: {type: Number, required: true},
    cost_price: {type: Number, required: true},
    list_price: {type: Number, required: true},    
});

TireSchema.virtual('url').get(function () {
    return `/catalog/tire/${this._id}`
});

TireSchema.virtual('tire_name').get(function () {
    return `${this.manufacturer} ${this.model_name}`
});

TireSchema.virtual('tire_name_rating').get(function () {
    return `${this.manufacturer} ${this.model_name} ${this.category.load_speed_rating}`
});


module.exports = mongoose.model('Tire', TireSchema);