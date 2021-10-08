const express = require('express');
const Router = express.Router();

const authController = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth').isAuth;
const isNotAuth = require('../middlewares/isAuth').isNotAuth;


Router.post('/getUser', authController.postGetUser);
Router.post('/logIn', isNotAuth, authController.postLogIn);
Router.post('/logOut', isAuth, authController.postLogOut);
Router.post('/updateUser', isAuth, authController.postUpdateUser);
Router.post('/getCountries', authController.postGetCountries);

module.exports = Router;
