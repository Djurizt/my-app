const mysqlConnection = require ('../config/mysql')


const newUser = (email,hashedPassword,image) => {
   
    return new Promise((resolve, reject) => {

        mysqlConnection.query({
            sql:'INSERT into clients (email,hashedPassword,image) VALUE(?,?,?)',
            values: [email,hashedPassword,image]
        },
          (err, results, fields) => {
                if (err) {
                 reject(err)
                }
                resolve(results)
          })
    })
}

const checkIfUserExist = (email) => {
    return new Promise((resolve, reject) => {

        mysqlConnection.query({
            sql:'SELECT * from clients where email=?',
            values: [email]
        },
          (err, results, fields) => {
                if (err) {
                 reject(err)
                }
                resolve(results)
          })
    })
}
const getUserDetailsByEmail = (email) => {
   
    return new Promise((resolve, reject) => {

        mysqlConnection.query({
            sql: `select * from clients where email=?`,
            values: [email]
        },
          (err, results, fields) => {
                if (err) {
                 reject(err)
                }
                resolve(results)
          })
    })
}

module.exports={
    newUser,
    checkIfUserExist,
    getUserDetailsByEmail
}