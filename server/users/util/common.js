'use strict';

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = require('../../config/auth');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const privateKey = auth.key.privateKey;

const mgauth = {
    auth: {
        api_key: auth.mailgun.key,
        domain: auth.mailgun.domain
    }
};
const nodemailerMailgun = nodemailer.createTransport(mg(mgauth));

exports.decrypt = function(password){
    return decrypt(password);
};

exports.encrypt = function(password){
    return encrypt(password);
};

exports.sentMailVerificationLink = function(user,token){
    const from = auth.email.accountName+' Team<' + auth.email.username + '>';
    const mailbody = '<p>Thanks for Registering on '+auth.email.accountName+' </p><p>Please verify your email by clicking on the verification link below.<br/><a href="http://'+auth.server.host+':'+ auth.server.port+'/'+auth.email.verifyEmailUrl+'/'+token+'">Verification Link</a></p>';
    mail(from, user.email , 'Account Verification', mailbody);
};

exports.sentMailForgotPassword = function(user){
    const from = auth.email.accountName+' Team<' + auth.email.username + '>';
    const mailbody = '<p>Your '+auth.email.accountName+'  Account Credential</p><p>username : '+user.username+' , password : '+decrypt(user.password)+'</p>';
    mail(from, user.email , 'Account password', mailbody);
};


// method to decrypt data(password) 
function decrypt(password){
    const decipher = crypto.createDecipher(algorithm, privateKey);
    let dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// method to encrypt data(password)
function encrypt(password){
    const cipher = crypto.createCipher(algorithm, privateKey);
    let crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function mail(from, email, subject, mailbody){
    const mailOptions = {
        from: from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody  // html body
    };

    nodemailerMailgun.sendMail(mailOptions, function(error){
        if (error){
            console.error(error);
        }
        nodemailerMailgun.close(); // shut down the connection pool, no more messages
    });
}