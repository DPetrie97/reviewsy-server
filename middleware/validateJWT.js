const jwt = require("jsonwebtoken");
const User = require('../db').import('../models/User');

const validateSession = (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  } else {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        User.findOne({
          where: { id: decoded.id }
        })
          .then(user => {
            if (!user) throw err;
            req.user = user;
            return next();
          })
          .catch(err => next(err));
      } else {
        req.errors = err;
        return res.status(500).send("Not authorized.");
      }
    });
  }
};

module.exports = validateSession;



// const jwt = require('jsonwebtoken');
// const Users = require('../models/User');

// const validateSession = (req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     return next();
//   } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
//     const { authorization } = req.headers;
//     const payload = authorization ? jwt.verify(authorization.includes('Bearer') ? authorization.split(' ')[1] : authorization, process.env.JWT_SECRET): undefined;
//     if (payload) {
//       Users.findOne({
//         where: {
//           id: payload.id
//         }
//       })
//       .then(user => {
//         req.user = user;
//         next();
//       })
//     } else {
//       res.status(401).json({
//         message: 'Not allowed'
//       });
//     }
//   } else {
//     res.status(401).json({
//       message: 'Not allowed'
//     });
//   }
// }

// module.exports = validateSession;