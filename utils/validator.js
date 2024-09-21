import isEmail from "validator/lib/isEmail.js"
import mongoose from "mongoose";


const isValidEmail = (email) => {
    try {
        // mx checker 
        // const isValid = await emailCheck.isValid(email);
        email = email.toLowerCase().trim();
        console.log("Email: " + isEmail(email))
        if (!email || !isEmail(email) || email.includes('+')) {
            console.log('Not a valid email');
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const isValidUserId = (userId) => {
    try {

        if (!userId || !mongoose.isValidObjectId(userId)) {
            console.log('Not a valid userId');
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};


const isStrongPassword = (password) => {
    if (password.length < 8) {
        return false;
    }

    // Contains upper case or not
    if (!password.match(/[A-Z]/)) {
        return false;
    }

    // Contains lower case or not
    if (!password.match(/[a-z]/)) {
        return false;
    }

    // Contains digits or not
    if (!password.match(/[0-9]/)) {
        return false;
    }

    // Contains at least one speciia char
    if (!password.match(/[!@#$%^&*()_+\-=`~]/)) {
        return false;
    }

    return true;
};


export { isValidEmail, isStrongPassword, isValidUserId };
