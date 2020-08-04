// const path = require("path");
// const fs = require("fs");
// const db = require("../../utils/database")

// const p = path.join(path.dirname(process.mainModule.filename),
//     "data",
//     "student.json"
// )

// const getStudentForm = cb =>{
//     this.id = Math.random().toString();
//     fs.readFile(p,(err,fileContent)=>{
//         if(err){
//             cb([]);
//         }else{
//             cb(JSON.parse(fileContent));
//         }
//     })
// }


// module.exports = class Student{
//     constructor(id,name,classs,nik,Image,gender,Address){
//         this.id = id
//         this.name = name
//         this.classs = classs
//         this.nik = nik
//         this.Image = Image
//         this.gender = gender
//         this.Address = Address
//     }
//     save(){
//         if(this.id){
//             return db.execute(`UPDATE student SET name="${this.name}",classs="${this.classs}",nik="${this.nik}",Image="${this.Image}",gender="${this.gender}",Address="${this.Address}" WHERE id = "${this.id}" `)
//         }else{
//             return db.execute(`INSERT INTO student (name,classs,nik,Image,gender,Address) VALUES (?,?,?,?,?,?)`,[this.name,this.classs,this.nik,this.Image,this.gender,this.Address])
//         }

//     // getStudentForm(student=>{
//     //     if(this.id){
//     //         const studentIndex = student.findIndex(stud => stud.id === this.id)
//     //         const updateStudent = [...student]
//     //         updateStudent[studentIndex] = this
//     //         fs.writeFile(p,JSON.stringify(updateStudent),(err)=>{
//     //             console.log(err)
//     //         })
//     //     }else{
//     //         this.id=Math.random().toString();
//     //              student.push(this)
//     //              fs.writeFile(p,JSON.stringify(student),(err)=>{
//     //                  console.log(err)
//     //              })
//     //         }
//     //     })
//     }

//     static fetchAll(){
//     //   getStudentForm(cb)
//     return db.execute("SELECT * FROM student")
//     }

//     static findById(id){
//     return db.execute(`SELECT * FROM student WHERE student.id = ?`, [id])
//         // getStudentForm(students=>{
//         //     const student = students.find(p=>p.id === id);
//         //     cb(student)
//         // })
//     }

//     static deleteById(id){
//     return db.execute(`DELETE FROM student WHERE id = ? `,[id])

//         // getStudentForm(students=>{
//         //     const studentDelete = students.filter(stud => stud.id !== id);
//         //     fs.writeFile(p,JSON.stringify(studentDelete),(err)=>{
//         //         console.log(err)
//         //     })
//         // })
//     }
// }

//PENGGUNAAN SEQUELIZE
const Sequelize = require("sequelize");
const sequelize = require("../../utils/database");

const Student = sequelize.sequelize.define('student',{
    id:{
       type:Sequelize.INTEGER,
       allowNull:false,
       autoIncrement:true,
       primaryKey:true 
    },
    name:Sequelize.TEXT,
    classs:Sequelize.TEXT,
    nik:Sequelize.TEXT,
    gender:{
        type:Sequelize.STRING,
        allowNull:false
    },
    Address:Sequelize.TEXT,
    Image:Sequelize.TEXT
});

module.exports = Student;