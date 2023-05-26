"use strict"

const Product = require("../models/product");
const User = require("../models/user");

exports.sendUploadProductPage = (req, res) => {
    res.render("uploadProduct.ejs", { page: "Upload Produkt" });
}

exports.newProductPost = (req, res) => {
    let user = {
        name: req.query.user,
        id: undefined
    }

    let query = User.findOne({ username: user.name })
    query.exec()
        .then((resDB) => {
            console.log(resDB)
            user.id = resDB._id.toString()
        })
        .then(() => {
            console.log(user.id)
            let newProduct = new Product({
                user_id: user.id,
                title: req.body.title,
                description: req.body.description,
                category: req.body.categories,
                size: req.body.size,
                offer_type: req.body.trade
            });
            newProduct.save()
                .then(() => {
                    console.log("Success!")
                    res.redirect("./?user=" + user.name);
                })
                .catch((err) => { console.log(err) });
        })
        .catch((err) => { console.log(err) })
}