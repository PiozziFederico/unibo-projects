/**
 * =====
 * SETUP
 * =====
 */

// require
const { isAdmin } = require('../../../database');
const express = require('express');

// router
const router = express.Router()

/**
 * BackOffice
 */
const { renderRoot } = require('../controllers/backofficeController/root')
const { renderLogin } = require('../controllers/backofficeController/login')
const { renderHome } = require('../controllers/backofficeController/home')
const { renderProfile } = require('../controllers/backofficeController/profile')

/**
 * Anagrafica Clienti
 */
const { renderUser } = require('../controllers/userController/user')
const { renderNewUser } = require('../controllers/userController/new-user')

/**
 * Community
 */
const { renderCommunity } = require('../controllers/communityController/community');
const { renderBoard } = require('../controllers/communityController/board');

/**
 * Ecommerce
 */
const { renderEcommerce } = require('../controllers/ecommerceController/ecommerce')
const { renderSearchProducts } = require('../controllers/ecommerceController/search-products');
const { renderAddProduct } = require('../controllers/ecommerceController/add-product');
const { renderCategory } = require('../controllers/ecommerceController/category');

/**
 * Servizi
 */
const { renderServices } = require('../controllers/servicesController/services');
const { renderService } = require('../controllers/servicesController/service');
const { renderBook } = require('../controllers/servicesController/book');
const { renderBookService } = require('../controllers/servicesController/book-service');
const { renderAddOffice } = require('../controllers/servicesController/add-office');
const { renderModifyService } = require('../controllers/servicesController/modify-service');
const { renderModifyDoc } = require('../controllers/servicesController/modify-doc');
const { renderAddService } = require('../controllers/servicesController/add-service');
const { renderShowOffices } = require('../controllers/servicesController/show-offices');
const { renderDeleteOffice } = require('../controllers/servicesController/delete-office');


/**
 * ======
 * ROUTES
 * ======
 */



/**
 * Backoffice
 */

router.get('/', renderRoot)
router.get('/login', renderLogin)

// Login Middleware
router.use( async (req,res,next) => {
    if(req.session.isLogged && await isAdmin(req.session.username)){
            next();
    }
    else {
        res.redirect('https://site212234.tw.cs.unibo.it/backoffice/login')
    }
})

router.get('/home', renderHome)
router.get('/profile', renderProfile)



/**
 * Anagrafica Clienti
 */

router.get('/users', renderUser)
router.get('/users/newuser', renderNewUser)



/**
 * Community
 */

router.get('/community', renderCommunity)
router.get('/community/:board', renderBoard)



/**
 * Ecommerce
 */

router.get('/ecommerce', renderEcommerce) 
router.get('/ecommerce/searchproducts', renderSearchProducts )
router.get('/ecommerce/addproducts', renderAddProduct)
router.get('/ecommerce/:category', renderCategory)



/**
 * Servizi
 */
router.get('/services', renderServices )
router.get('/services/book', renderBook)
router.get('/services/bookservice/:service', renderBookService) 
router.get('/services/modifyservice', renderModifyService)
router.get('/services/modifyservice/service/:city/:address/doc/:doc', renderModifyDoc)
router.get('/services/modifyservice/service/:city/:address/:officename/addservice', renderAddService )
router.get('/services/addoffice', renderAddOffice)
router.get('/services/deleteoffice', renderDeleteOffice)
router.get('/services/showoffices', renderShowOffices)
router.get('/services/service/:service', renderService )

 
module.exports = router