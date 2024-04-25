const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TireInstanceSchema = new Schema({
    tire: {type: Schema.ObjectId, ref: 'Tire', required: true},
    size: { type: Schema.ObjectId, ref: 'TireSize', required: true},
    dot: {type: String, required: true},
    date_code: {type: Number, required: true},
});

TireInstanceSchema.virtual('url').get(function () {
    return `/catalog/tireinstance/${this._id}`
})

TireInstanceSchema.virtual('tire_name').get(function () {
    return `${this.tire.manufacturer.name} ${this.tire.model_name}`
})

TireInstanceSchema.virtual('tire_name_rating').get(function () {
    return `${this.tire.manufacturer.name} ${this.tire.model_name} ${this.tire.category.tire_class}`
})

module.exports = mongoose.model('TireInstance', TireInstanceSchema);