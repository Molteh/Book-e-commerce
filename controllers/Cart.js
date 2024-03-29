'use strict';

const utils = require('../utils/writer.js');
const Cart = require('../service/CartService');

module.exports.accountCartCheckoutPOST = function accountCartCheckoutPOST (req, res, next) {
  const token = req.headers.authorization;
  Cart.accountCartCheckoutPOST(token)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        res.writeHead(response.code);
        res.end();
      });
};

module.exports.accountCartDELETE = function accountCartDELETE (req, res, next) {
  const item = req.swagger.params['item'].value;
  const token = req.headers.authorization;
  Cart.accountCartDELETE(item,token)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        res.writeHead(response.code);
        res.end();
      });
};

module.exports.accountCartEmptyPOST = function accountCartEmptyPOST (req, res, next) {
  const token = req.headers.authorization;
  Cart.accountCartEmptyPOST(token)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        res.writeHead(response.code);
        res.end();
      });
};

module.exports.accountCartGET = function accountCartGET (req, res, next) {
  const token = req.headers.authorization;
  Cart.accountCartGET(token)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        res.writeHead(response.code);
        res.end();
      });
};

module.exports.accountCartPOST = function accountCartPOST (req, res, next) {
  const book = req.swagger.params['book'].value;
  const token = req.headers.authorization;
  Cart.accountCartPOST(book, token)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        res.writeHead(response.code);
        res.end();
      });
};
