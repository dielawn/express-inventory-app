const Tire = require('../models/tire.js');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

//display list of all tires
exports.tire_list = asyncHandler(async (req,res, next) => {
    const allTires = await Tire.find().sort({ tire_name: 1 }).exec();
    res.render('tire_list', {
        title: 'Tires',
        tire_list: allTires,
    });
});

//display details page for each tire
exports.tire_detail = asyncHandler(async (req, res, next) => {
    const tire = await Tire.find().sort()
    res.render('tire_detail', {
        tire: tire,
    })
})
//display create new tire form on GET

//handle tire create on POST

//display tire delete form on GET

//handle tire delete on POST

//display tire update form on GET

//handle tire update on POST