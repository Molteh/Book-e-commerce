'use strict';

const {database} = require("./Database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const checkToken = require("../utils/authenticator").checkToken;
const hashPassword = require("../utils/authenticator").hashPassword;


/**
 * Returns info about a user.
 *
 * returns User
 **/
exports.accountInfoGET = async (token) => {
    //check if the user is logged in, if so retrieve his user_id
    const user_id = await checkToken(token);

    //retrieve the info about the account
    return (await database.select("email","name","surname").table("account").where("user_id","=",user_id))[0];
};


/**
 * Updates the info of an account.
 *
 * account User Account details. (optional)
 * returns User
 **/
exports.accountInfoPOST = async (account, token) => {
    //check if the user is logged in, if so retrieve his user_id
    const user_id = await checkToken(token);

    //encrypt the password
    if(account["password"]) account["password"] = await hashPassword(account["password"]);

    return database.transaction(async trx => {
        //update existing account
        return (await trx.update(account, ['email', 'name', 'surname']).table("account").where({ 'user_id': user_id }))[0];
    }).catch(() => { throw { code: 400 } }
    );
};


/**
 * Login of a registered user.
 *
 * login Login Login details. (optional)
 * returns inline_response_200_4
 **/
exports.accountLoginPOST = async (login) => {
    //query the database to find an existing account with the provided credentials
    const account = await database.table("account").select().where("email", "=", login["email"]);

    //if there is no email associated
    if (account.length === 0)
        throw {code: 401};

    //if the password is wrong
    if (!(await bcrypt.compare(login["password"], account[0]["password"])))
        throw {code: 401};

    //generate jwt token containing user_id
    const token =  jwt.sign({
        user_id: account[0]["user_id"],
    }, config.get('jwtPrivateKey'));

    return {token: token};
};


/**
 * Registers a new user.
 *
 * user User User who wants to sign up. (optional)
 * returns inline_response_200_3
 **/
exports.accountRegisterPOST = async (user) => {
    //retrieve users with the same email
    const account = await database.table('account').select().where({ email: user.email });

    //check if some user already exists
    if (account.length > 0)
        throw {code: 409};

    //encrypt the password
    user["password"] = await hashPassword(user["password"]);

    return database.transaction(async trx => {
        //create new Account
        return (await trx.table("account").insert(user, ['user_id']))[0];
    }).catch( () => { throw { code: 400 } });
};

