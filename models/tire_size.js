const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TireSizeSchema = new Schema({
    tire_width: { type: Number, required: true },
    aspect_ratio: { type: Number, required: true },
    wheel_dia: { type: Number, required: true }
});

TireSizeSchema.virtual('url').get(function () {
    return `/catalog/tiresizes/${this._id}`
})

TireSizeSchema.virtual('size').get(function () {
    return `${this.tread_width}/${this.aspect_ratio}/${this.wheel_dia}`
})

module.exports = mongoose.model('TireSize', TireSizeSchema);