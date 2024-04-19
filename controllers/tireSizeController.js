const Tire = require('../models/tire.js');
const TireInstance = require('../models/tireInstance.js');
const Manufacturer = require('../models/manufacturer.js');
const Category = require('../models/category.js');
const TireSize = require('../models/tire_size.js')

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');


//list
exports.tire_size_list = asyncHandler(async (req, res, next) => {
    try {
        const allSizes = await TireSize.find().sort({ size: 1 }).exec()
        res.render('tire_size_list', {
            title: 'All Tire Sizes:',
            size_list: allSizes,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database read list Error: ${dbError.message}.`)
        return res.redirect(`/catalog/sizes?error=${error}`);
    }
});

//details
exports.tire_size_detail = asyncHandler(async (req, res, next) => {
    try {
        //find all tires of a certain size
        const instancesOfSize = await Tire.find() 
        
    } catch (dbError) {
        const error = encodeURIComponent(`Database read detail Error: ${dbError}.`)
        return res.redirect(`/catalog/sizes?error=${error}`);
    }
})
//create

//update

//delete