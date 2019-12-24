const router = require('express').Router();
var Adoption = require ('../models/adoption'); 

router.route('/').get((req, res) => res.send("<html><body><h1>Microservicio de gestion de adopciones de mascotas Ver. 1.0</h1></body></html>"));

module.exports = router;