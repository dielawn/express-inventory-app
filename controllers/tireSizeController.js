const Tire = require('../models/tire.js');
const TireInstance = require('../models/tireInstance.js');
const TireSize = require('../models/tire_size.js')

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

//list
exports.size_list = asyncHandler(async (req, res, next) => {
    try {
        const [allSizes, allSizeInstances ] = await Promise.all([
            TireSize.find().sort({ wheel_dia: 1 })
            .exec(),
            TireInstance.find({ size: req.params.id })
            .populate({
                path: 'tire',
                populate: { path: 'manufacturer category' }
            })
            .populate('size').exec()
        ])
        res.render('size_list', {
            title: 'All Tire Sizes:',
            size_list: allSizes,
            instances: allSizeInstances,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database read list Error: ${dbError.message}.`)
        return res.redirect(`/catalog/sizes?error=${error}`);
    }
});

//details
exports.size_detail = asyncHandler(async (req, res, next) => {
    try {
        //find all tires of a certain size
        const [ size, allSizeInstances ] = await Promise.all([
            TireSize.findById(req.params.id).sort({ wheel_dia: 1 })
            .exec(),
            TireInstance.find({ size: req.params.id })
            .populate({
                path: 'tire',
                populate: { path: 'manufacturer category' }
            })
            .populate('size').exec()
        ]);
        res.render('size_detail', {
            title: 'Size',
            size: size,
            instances: allSizeInstances,
        })
    } catch (dbError) {
        const error = encodeURIComponent(`Database read detail Error: ${dbError.message}.`)
        return res.redirect(`/catalog/sizes?error=${error}`);
    }
});

//create
exports.size_create_get = asyncHandler(async (req, res, next) => {
    try {
        res.render('size_form', {
            title: 'Create new size',
        })
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET Delete Error: ${dbError.message}.`)
        return res.redirect(`/catalog/sizes?error=${error}`);
    }
});

exports.size_create_post = [
    body('tire_width', 'tire width must be a 3 digit number.')
        .trim()
        .isLength({ min: 3, max: 3 })
        .escape(),
    body('aspect_ratio', 'Sidewall must be a 2 digit number.')
        .trim()
        .isLength({ min: 2, max: 2})
        .escape(),
    body('wheel_dia', 'Wheel diameter must be a 2 digit number.')
        .trim()
        .isLength({ min: 2, max: 2})
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            //errors
            res.render('size_form', {
                title: 'Create tire size',
                errors: errors.array()
            });
        } else {
            //no errors
            const newSize = new TireSize({
                tire_width: req.body.tire_width,
                aspect_ratio: req.body.aspect_ratio,
                wheel_dia: req.body.wheel_dia,
            });
            try  {
                await newSize.save();
                res.redirect(newSize.url)
            } catch (dbError) {
                const error = encodeURIComponent(`Database error POST create: ${dbError.message}`)
                return res.redirect(`/catalog/sizes?error=${error}`);
            }
        }
})];

//update
exports.size_update_get = asyncHandler(async (req, res, next) => {
    try {
        const size = await TireSize.findById(req.params.id).exec()
        if (!size) {
            const error = encodeURIComponent('Size not found.')
            return res.redirect(`/catalog/sizes?error=${error}`)
        }
        res.render('size_form', {
            title: 'Update size',
            size: size,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET update error: ${dbError.message}`)
        return res.redirect(`/catalog/sizes?error=${error}`)
    }
});

exports.size_update_post = [
    body('tire_width', 'tire width must be a 3 digit number.')
        .trim()
        .isLength({ min: 3, max: 3 })
        .escape(),
    body('aspect_ratio', 'Sidewall must be a 2 digit number.')
        .trim()
        .isLength({ min: 2, max: 2})
        .escape(),
    body('wheel_dia', 'Wheel diameter must be a 2 digit number.')
        .trim()
        .isLength({ min: 2, max: 2})
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            //errors open form
            try {
                const size = await TireSize.findById(req.params.id).exec()
                if (!size) {
                    const error = encodeURIComponent('Size not found.')
                    return res.redirect(`/catalog/sizes?error=${error}`)
                }
                res.render('size_form', {
                    title: 'Update size',
                    size: size,
                });
            } catch (dbError) {
                const error = encodeURIComponent(`Database GET update error: ${dbError.message}`)
                return res.redirect(`/catalog/sizes?error=${error}`)
            }
        } else {
            //data is valid
            try {
                const updatedSize = await TireSize.findByIdAndUpdate(req.params.id, {
                    tire_width: req.body.tire_width,
                    aspect_ratio: req.body.aspect_ratio,
                    wheel_dia: req.body.wheel_dia
                }, { new: true });
                if (updatedSize) {
                    res.redirect(updatedSize.url);
                } else {
                    throw new Error('Failed to update tire size.');
                }
            } catch (dbError) {
                const size = await TireSize.findById(req.params.id).exec()
                if (!size) {
                    const error = encodeURIComponent('Size not found.')
                    return res.redirect(`/catalog/sizes?error=${error}`)
                }
                res.render('size_form', {
                    title: 'Update size',
                    size: size,
                }); 
            }
        }
    }),
];

//delete
exports.size_delete_get = asyncHandler(async (req, res, next) => {
    try {
        const [size, associatedInstances] = await Promise.all([
            TireSize.findById(req.params.id).exec(),
            TireInstance.find({ size: req.params.id }).exec() //all instances of size
        ]);

        if (!size) {
            const error = encodeURIComponent(`Size not found: ${req.params.id}`)
            return res.redirect(`catalog/sizes?error=${error}`)            
        }
        //check for tire instances of size before delete
        if (associatedInstances.length > 0) {
            const error = encodeURIComponent(`Delete associated tires of ${req.params.id} before deleting size`)
            return res.redirect(`/catalog/sizes?error=${error}`)
        }

        res.render('size_delete', {
            title: `Delete Size: ${size.size}`,
            size: size,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET delete error: ${dbError.message}`)
        return res.redirect(`/catalog/sizes?error=${error}`)
    }
});

exports.size_delete_post = asyncHandler(async (req, res, next) => {
    try {
        const [size, associatedInstances] = await Promise.all([
            TireSize.findById(req.params.id).exec(),
            TireInstance.find({ size: req.params.id }).exec() //all instances of size
        ]);

        if (!size) {
            const error = encodeURIComponent(`Size not found: ${size}`)
            return res.redirect(`catalog/sizes?error=${error}`)            
        }
        //check for tire instances of size before delete
        if (associatedInstances.length > 0) {
            const error = encodeURIComponent(`Delete associated tires of ${size} before deleting size`)
            return res.redirect(`/catalog/sizes?error=${error}`)
        }

        await TireSize.findByIdAndDelete(req.params.id)
        res.redirect('/catalog/sizes')

    } catch (dbError) {
        const error = encodeURIComponent(`Databse POST delete error: ${dbError.message}`)
        return res.redirect(`/catalog/sizes?error=${error}`)
    }
});