let jwt = require('jsonwebtoken');

const mongo = require('../lib/mongo'); 
let db; 

const bcrypt = require('bcrypt');
let config = require('./config');
let auth= require ('../config/config')

function checkToken (req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['x-auth-token']; 
  if (auth.authentication) {
    if (token !== undefined) {
      if (token.startsWith('Bearer')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
    
      if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
            return res.json({
              success: false,
              message: 'Token is not valid'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.json({
          success: false,
          message: 'Auth token is not supplied'
        });
      }
    } else {
      return res.json({
        success: false,
        message: 'Auth token is missing!'
      });
    }
  } else {
    next(); 
  }
  
 
};

function authenticate (req, res, next) {
  let username = req.body.username; 
  db=mongo.getdb(); 
  db.collection('users').findOne({'username':req.body.username}, function(err, user){
      if (err) {
          next(err);
      } else {
          if(bcrypt.compareSync(req.body.password, user.password)) {
              let token = jwt.sign({username: username},
                  config.secret,
                  { expiresIn: config.expires 
                  }
                );
                // return the JWT token for the future API calls
                res.json({
                  success: true,
                  message: 'Authentication successful!',
                  token: token
                });
                next(); 
          }else{
              res.send(403).json({
                  success: false,
                  message: 'Incorrect username or password'
                });
          }
      }
  });
}

module.exports = {
    checkToken,  
    authenticate
}