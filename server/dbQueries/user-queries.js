const pool = require('../db-connector');
const {request} = require('express');

const registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.user (id_user, email, password) VALUES (DEFAULT, $1, $2)",
            [email, password],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Пользователь зарегестрирован");
                }
            });
    });
}
const findUser = (email) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.user WHERE email = $1", [email],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                request.isFound = true;
                resolve(result.rows[0]);
            });
    });
}

module.exports = {
    registerUser,
    findUser
}