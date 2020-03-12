'use strict'

var user_model = require('../models/user_model.js')
var presence_model = require('../models/presence_model.js')

exports.login = async (req, res) => {
    
    // POST handling
    if(req.method == 'POST') {

        console.log(isset(req.body.email, req.body.password));
        
        // API: Log in handling
        if(isset(req.body.email, req.body.password)) {
            
            // automatically redirect if it's true/valid
            var is_valid = await user_model.get_by_credentials(req.body.email, req.body.password)
                
            if(is_valid) {

                req.session.current_user = {
                    email: req.body.email
                }

                res.redirect('/dashboard')

            } else {

                req.flash('user_validation_message', 'Invalid username or password!')
                res.render('auth/login')
            }
        }
    }

    if(req.method == 'GET')
        res.render('auth/login')
}

exports.logout = (req, res) => {

    req.session.current_user = null
    res.redirect('/login')
}

exports.register = (req, res) => {

    res.render('auth/register')
}

exports.presence_board = (req, res) => {

    res.render('user_public/presence_board')
}