const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TireSizeSchema = new Schema({
    tread_width: { type: Number, required: true },
    sidewall: { type: Number, required: true },
    wheel_dia: { type: Number, required: true }
});

TireSizeSchema.virtual('url').get(function () {
    return `/catalog/tiresizes/${this._id}`
})

TireSizeSchema.virtual('size').get(function () {
    return `${this.tread_width}/${this.sidewall}/${this.wheel_dia}`
})

module.exports = mongoose.model('TireSize', TireSizeSchema);