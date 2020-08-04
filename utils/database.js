// const mysql = require("mysql2")

// const pool = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"node_students"
// })

// module.exports = pool.promise();

//PENGGUNAAN SEQUELIZE
const Sequelize = require("sequelize");
const session = require("express-session");
const SessionStore = require("express-session-sequelize")(session.Store);

const sequelize = new Sequelize(`${process.env.namedatabase}`, `${process.env.dbusername}`, ``, {
    dialect: `${process.env.dbengine}`,
    host: `${process.env.dbhost}`
});
const sequelizeSessionStore = new SessionStore({
    db:sequelize,
})

module.exports = {
    sequelize,
    sequelizeSessionStore
}