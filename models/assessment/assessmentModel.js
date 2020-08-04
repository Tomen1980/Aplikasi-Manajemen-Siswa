// const db = require("../../utils/database")

// module.exports = class Assessment{
//     constructor(id,student_id,score){
//         this.id = id
//         this.student_id = student_id,
//         this.score = score
//     }

//     save(){
//         if(this.id){
//             return db.execute(`UPDATE assessment SET student_id = '${this.student_id}',score = '${this.score}' WHERE id = '${this.id}'`)
//         }else{
//             return db.execute("INSERT INTO assessment (student_id,score) VALUES (?,?)",[this.student_id,this.score])
//         }
//     }
//     static fetcAll(){
//         return db.execute(`SELECT am.id,am.score,st.name,st.classs,st.nik,st.gender,st.Address,st.Image FROM assessment am JOIN student st ON am.student_id=st.id`)
//     }
//     static findById(id){
//         return db.execute(`SELECT am.id,am.score,st.name,st.classs,st.nik,st.gender,st.Address,st.Image FROM assessment am JOIN student st ON am.student_id=st.id WHERE am.id = "${id}"`)
//     }
//     static deleteById(id){
//         return db.execute(`DELETE FROM assessment WHERE id = '${id}'`)
//     }
// }

const Sequelize = require("sequelize");
const sequelize = require("../../utils/database");
// const { Sequelize } = require("sequelize");

const Assessment = sequelize.sequelize.define("assessment",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    score:Sequelize.TEXT
})

module.exports = Assessment;