const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TireInstanceSchema = new Schema({
    tire: {type: Schema.ObjectId, ref: 'Tire', required: true},
    dot: {type: String, required: true},
    date_code: {type: Number, required: true},
});

TireInstanceSchema.virtual('url').get(function () {
    return `/catalog/tireinstances/${this._id}`
})

TireInstanceSchema.virtual('tire_name').get(function () {
    return `${this.tire.manufacturer} ${this.tire.model}`
})

TireInstanceSchema.virtual('tire_name_rating').get(function () {
    return `${this.tire.manufacturer} ${this.tire.model} ${this.tire.category.load_speed_rating}`
})

module.exports = mongoose.model('TireInstance', TireInstanceSchema);