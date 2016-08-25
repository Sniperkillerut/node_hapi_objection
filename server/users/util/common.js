'use strict';

const nodemailer = require('nodemailer');
const auth = require('../../config/auth');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const privateKey = auth.key.privateKey;

// create reusable transport method (opens pool of SMTP connections)
console.log(auth.email.username+'  '+auth.email.password);
const smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: auth.email.username,
        pass: auth.email.password
    }
});

exports.decrypt = function(password) {
    return decrypt(password);
};

exports.encrypt = function(password) {
    return encrypt(password);
};

exports.sentMailVerificationLink = function(user,token) {
    const from = auth.email.accountName+' Team<' + auth.email.username + '>';
    const mailbody = '<p>Thanks for Registering on '+auth.email.accountName+' </p><p>Please verify your email by clicking on the verification link below.<br/><a href="http://'+auth.server.host+':'+ auth.server.port+'/'+auth.email.verifyEmailUrl+'/'+token+'">Verification Link</a></p>';
    mail(from, user.userName , 'Account Verification', mailbody);
};

exports.sentMailForgotPassword = function(user) {
    const from = auth.email.accountName+' Team<' + auth.email.username + '>';
    const mailbody = '<p>Your '+auth.email.accountName+'  Account Credential</p><p>username : '+user.userName+' , password : '+decrypt(user.password)+'</p>';
    mail(from, user.userName , 'Account password', mailbody);
};


// method to decrypt data(password) 
function decrypt(password) {
    const decipher = crypto.createDecipher(algorithm, privateKey);
    let dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// method to encrypt data(password)
function encrypt(password) {
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

    smtpTransport.sendMail(mailOptions, function(error) {
        if (error) {
            console.error(error);
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}