const Category = require('../models/category.js');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

//display list of all Categorys
exports.category_list = asyncHandler(async (req, res, next) => {
    try {
        const allCategories = await Category.find().sort({ tire_class: 1 }).exec()

        res.render('category_list', {
            title: 'Tire Categories',
            categories: allCategories,
    } );
    } catch (dbError) {
        const error = encodeURIComponent(`Database error: ${dbError.message}`);
        res.redirect(`/catalog/categories?error=${error}`);
    }
});

//display details page for each Category
exports.category_detail = asyncHandler(async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            const error = encodeURIComponent(`Cannot find ID: ${req.params.id}`)
            return res.redirect(`/catalog/categories?error=${error}`)
        }

        res.render('category_detail', {
            title: `Category Details: ${category.tire_class}`,
            category: category,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database error: ${dbError.message}`);
        res.redirect(`/catalog/categories?error=${error}`);
    }
});

//display create new Category form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
    try {        
        res.render('category_form', {
            title: 'Create Category',
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET create error: ${dbError.message}`);
        res.redirect(`/catalog/categories?error=${error}`);
    }
});
//handle Category create on POST
exports.category_create_post = [
    body('tire_class', 'Class required.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('season', 'Season required')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            //is error open form
            res.render('category_form', {
                title: 'Create Category',
                category: req.body, //pass the submitted data back to the form
                error: errors.array(),
            });
        } else {
            //no errors create new category
            const newCategory = new Category({
                tire_class: req.body.tire_class,
                season: req.body.season,
                description: req.body.description,
            });
            try {
                await newCategory.save()
                res.redirect(newCategory.url)
            } catch (dbError) {              
                const error = encodeURIComponent(`Database POST create error: ${dbError.message}`)
                res.redirect(`/catalog/categories?error=${error}`);
            }
        }
    }),
];

//display Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {   
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            const error = encodeURIComponent('Category not found.')
            return res.redirect(`/catalog/categories?error=${error}`);
        }
        res.render('category_delete', {
            title: 'Category Delete',
            category: category,
        })
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET error: ${dbError.message}.`)
        res.redirect(`/catalog/categories?error=${error}`)
    }
});

//handle Category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
   try {
    const category = await Category.findById(req.params.id) 

    if (!category) {
        const error = encodeURIComponent('Category not found.')
        return res.redirect(`/catalog/categories?error=${error}`);
    }

    await Category.findByIdAndDelete(req.params.id)
    res.redirect('/catalog/categories')

   } catch (dbError) {
        const error = encodeURIComponent(`Database POST error: ${dbError.message}`)
        res.redirect(`/catalog/categories?error=${error}`);
   }
});

//display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    try{
        const category = await Category.findById(req.params.id);

        if(!category) {
            const error = encodeURIComponent('Category not found.')
            return res.redirect(`/catalog/categories?error=${error}`);
        }

        res.render('category_form', {
            Title: `Update Category: ${category.tire_class}`,
            category: category,
        })
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET Error: ${dbError.message}.`)
        return res.redirect(`/catalog/categories?error=${error}`);
    }
})
//handle Category update on POST
exports.category_update_post = [
    body('tire_class', 'Class required.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('season', 'Season required')
        .trim()
        .isLength({ min: 1 })
        .escape(),

        asyncHandler(async (req, res, next) => {
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                try {
                    //errors display form
                    const category = await Category.findById(req.params.id);
                    res.render('category_form', {
                        title: 'Update Category',
                        category: {...category.toObject(), ...req.body},  //pass the submitted data back to the form
                        error: errors.array(),
                    });
                } catch (dbError) {
                    const error = encodeURIComponent(`Database error during data retrieval: ${dbError.message}`);
                    return res.redirect(`/catalog/categories?error=${error}`);
                } 
            } else {
                try {
                    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {
                        tire_class: req.body.tire_class,
                        season: req.body.season,
                        description: req.body.description,
                    }, { new: true });

                    res.redirect(updatedCategory.url)

                } catch (dbError) {
                    const error = encodeURIComponent(`Database POST Error: ${dbError.message}.`)
                    return res.redirect(`/catalog/categories?error=${error}`);
                }
            } 
        }),
];