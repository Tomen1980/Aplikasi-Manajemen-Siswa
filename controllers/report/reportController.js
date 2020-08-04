const PDFDocument = require('pdfkit');
const assessmentModel = require("../../models/assessment/assessmentModel")
const studentModel = require("../../models/student/studentModel");
const { y } = require('pdfkit');

const student = {
    students:{
        today: new Date(),
        number: Math.floor(Math.random()*101),
        date: function(){
            return(
                this.today.getFullYear() +
                 "-" + 
                 (this.today.getMonth() + 1) +
                 "-" +
                 this.today.getDate()
            )
        },
        showDataAssessment:function(){
            return assessmentModel.findAll({
                include:[{
                    model:studentModel,
                    attributes:["id","name","classs","nik","gender","Address","Image"]
                }],
                order:[
                    ["id","DESC"]
                ]
            })
        }
    }
}

exports.getReport= async (req,res,next)=>{
    let doc = new PDFDocument({
        margin:50
    })
    let showDataAsessment = await student.students.showDataAssessment()

    let invoicename = "Report Student"
    res.setHeader("Content-type","application/pdf")
    res.setHeader(
        "Content-Dispotiotion",
        'inline; filename="'+ invoicename +'"'
    )
    generateHeader(doc)
    generateStudentInformation(doc)

    generateInoviceTable(doc,showDataAsessment)

    doc.pipe(res);
    doc.end();
}

const generateHeader = (doc)=>{
    doc.image("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEBUPEBAQEhAQEA8QDxAQEBIVFRAQFRUWFhUVFRUYHSgiGBolGxUVITEhJSorLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGysdHR0tKy0tLS0tKy0tKystLSsrLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS03LS0tLS0tKy0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAAAQMEBQYHAgj/xABMEAACAgACBAcLBwoEBwEAAAAAAQIDBBEFBiExBxIyQVFxchM0NWGBkaGxssHRIiNUdJOz0hczQkNEUmJzgpIUY4PxJCVklKLC8Bb/xAAbAQEBAQEBAQEBAAAAAAAAAAAAAQIDBAUGB//EADARAQACAQIDBgUEAgMAAAAAAAABAhEDBAUSMRMhMkFRkRQ0QlKxBhVxgSJDM2Hx/9oADAMBAAIRAxEAPwDs7x1XGcO618dPJx48eMnlntWezYyc0N9leYzicK8Zp7mvOGOWYTmEMxgChmML3mYEgMwJAAAAAAAAAAAEZgMwGYDMCMwGYQzJhTMuDC2vx9MFnO2uHanFetkzDUadp8pVe7x6V50ExLhPCIv+aXvnTr2rsRPlbnuvOH9C4HSttlXPf/6wdWOujybro9m2a9TOPaWjzfUnZ7eetI9l1Vp/Gx5OLxHltk/Wyxq3jzcLcM2tv9ceyvHWrSC3Yy/+5fAvb6nq5zwfaT9EKkdcdJL9st8vEfuNfEanqx+ybP7IVFrvpP6XP+yv8I+J1PVP2PZ/Y9rXvSf0p/Z1/hL8VqMTwDZz9KpDhB0ov2hPrqr9yRfi9Rzn9PbOfKVxXwlaSW+VEu1U/dI1G8u52/Te2npmGQw/Ctily8PRLpyc4v3mo3sx1h57/pfT+m8szguFeh7LsPbDpcHGa9zOtd5WesPn636Z16+CYlteiNacFidlN8HJ/oSfFn/bLaemurS3SXxdfYa+h46s1xjo8j0AAhyAxultOYbDR42IvrqXNx5JN9S3sk2iOrrpaF9ScVjLTdI8LmBg2qa77nzNRUIvyyefoONtxEdH0tPg2vbr3NfxPDHe/wA3hKor+OyUn6EjlO5n0eynAq+dpYy7hX0m+T/horxVSeXlcjPxNnojgmjHWZlaWcJmlX+vguzTX70yfEXda8G28eqi+EXS30t/ZU/hJ292/wBo232vEuEDSr/bJ+Sur8JO2u1+1bb7YUpa9aVf7db5FBeqI7W/qftW2+2FOWuek3vxt/nXwJ2tvVqOGbePpULdaNIS343E+S2S9RO0t6ukbDbx9MLSzSuJlysTiJdq+x+tk57erpG10Y6VhSpk3ZBybb48Nref6S6RWf8AKE1tKsadsR5S+lNviPbyvyHc45wjeE7+uHsRPBuvHL9twD5KrWzzPtgQAAAAACBlUhEAT4+dPNPoZYnHezalbRiYbbq1r9isM1C2TvoWzizfy4r+Gb39TPTpbq1e6X5/f8A0tWJtpf4y67oLT+HxdfdaJqS3Si9koS6JR5j6VLxaO5+L3W01dtfl1Iwu8djq6a5W2zjXXBZynJpJLrNzOOrhSlrziIci1t4U7Jt1YDOuG1PESXy5L+CL5PW9vUePU1+/FX6HZcHrjm1e/wD6c4xF87JOyyUpzlypzk5Sb8bZ5ZzPV9+mlSkRFYxCkHQGFSBAQAAAoACJQWFTC8uHbh60WPFDlreCf7/D6YPoPxbjXCL4Tv64exE+duvHL9vwD5KrWzzPtgQAAAAAAAAAAAF5ofSt2FtV1E3Ga39E1+7Jc6N6epNJzDx7zZaW505rqQ9a262YnHWfOvi1Q/N0wb4qf7z/AHpdZ6r61rvi7Xh+ntZ7u+fVrxze3CAAAAAAAAAAABKCwqYXlw7cPWjVesOWt4J/v8Ppg978W41wi+E7+uHsRPnbrxy/b8A+Sq1s8z7YEAAAAAAAAAAABA80t0WF/KfWz0R0fKv4lMrIEAAAAAAAAAACUFhUwvLh24etGq9YctbwT/f4fTB734txrhF8J39cPYifO3Xjl+34B8lVrZ5n2wIAAAAAAAAAAALCB5s2WF/KfWz0R0fKv4lMrAAAAAAAAAAAAJQWFTC8uHbh60ar1hy1vBP9/h9MHvfi3GuEXwnf1w9hHztz/wAkv2/APkqtbPM+2BAAAAAAAAAAABYQPNmywv5T62eiOj5V/EplYAAAAAAAAAAABKCquG5cO3D1oseKHLW8E/3+H0ufQfi3GeEXwnf1w9iJ87deOX7fgHyVWuHlfaiYCgAAAAAAAAAAAsIHmzZYX8p9bPRHR8q/iUysAAAAAAAAAAAABVXDfnIduHrRqvihx1v+O38PpbM92JfjXO9fdTsbZi7MTVWra7OK0oSXGjlFLJxeXRzM8u429rW5ofoeDcX2+joxpX7mlYjQ2Lhy8NfHLpqnl58sjyTo384foqcR21u+Lx7rOVclvjJdcWjM0tHk713OlbpaPdTc10oziXSNSs+cHHXSvOMHPX1OMulecLzQnMYOaDMYMwkYMwBcgAAFQPNmywv5T62eiOj5V/EplZAicgqAmQBmEzBmUzCOMukHNBxl0rzg56+px10rzjCc9fV7rrlLkxlLspv1DEszq0jzhd0aJxM+Rhr5dmmb9xeS0+TnO70Y+qGw6E4P9JWzi/8ADuqKlGTndJRySeb+Ss5Z+Q600bZiZeDc8U0IrMROZmMdzuv+FkevE+r8z2tV+0dMPMhxCKcqYvfGL/pRMNxqWjpMvEsFU99db64R+BOWGu21Pun3U3ouh76an11x+A5K+ixuNX7p91OWhMK9+GofXVD4Dkr6NfFa33z7qMtWsC9+Dwr/ANCv4CaVnyX4vXj6593h6q4B/seG+xh8DPZ19G43+5j6591OzU7Rz34PD+StInZafo3HEt1H+yfdjcZwc6OnuqlW+mqcll5Nxidtpz5PTpcb3lPqz/LVtL8Fdkc5YW+M1zV2rJ/3rZ6DhfZR5Psbb9TdO2r7NE0nou/Dz7nfXKuXNxlsl2ZbmeK+nNOr9Ltt9o7iM0tlaGHrjvQIS3RYX8p9bO9ej5V/FKmaZVsLh52TVdcZTslsjCEXKT8iEVmejjfVppxm04b5oLgpxdqUsRZDDxe3i5d0sy6k0l52eiu3mer4+441Ss4pGW7YHgq0bDlq2587nY0v7Y5I7xoVh8rU4vuL9JwzFWo+jI7FgsP/AFQUvWb7KrzTvtf75V46o6OW7A4T7Cv4F5Ks/Ga/3z7vf/5bR/0HCf8AbVfAvJX0Z+J1fun3VYavYJbsJhl1UVr3Dkr6Mzr6v3T7qsNEYZbsPSuqqHwHLX0Ttr+sqscBSt1Va6oR+A5Y9E7W/rKpHDwW6MV1RReWPROe3rL3xSs5l6SADCd6QoBGQEgAAAAAAAQ0BaaR0dVfW6rq42QlvjJZ/wCxm1YtGJdNLWvpTzUnEuTa5cH1mH41+F41tO+VeWc614suUvT1nz9bbcvfV+w4Xx6NSYprd0/loh48YnEv1OYmIlYX8p9bO0R3PlakxzS2bUzUnEY+XG21YZPKVzXK6VWnyn49yPRp6M36vk77iVNvHLHfZ2/VzVrC4KHEw9ai/wBKx7ZzfTKXuPbSkV6Pyu43Opr2zeWYyNvNh6CgAAAAAAAAAAAAAAACGwNX0tr1hcNdLD3wxEZxyefc04yi90otS2r4MuEmUUcIWjZfr5R7dVi9OQwnMyuD1kwVuyvFUSb3R7rFS/tbzJhcsnGSe3NZdIMvQUAAeZRA5ZwjalKKljcLHZnxr6o7vHOK9aPDudvn/Kr9XwXjExPY6s/xMtX1C1MeOudtqawdc8pvc7ZL9CPi6X5OrOhpTbq68W4jGlzUp4pd2wuGhXBV1xUYQSjGMVkopbkke+Ix0fkLWm05lWyKiQIzAtMfpSihca66utf5k1HPqT3lwmWt4zhI0fB5Rlba/wDKreXnk0hgyxdvCvR+jhbn2pwj6sxhOZ5hwr1c+EsS8VkX7hg5oX2F4T8DLZON9XjcFJf+Lb9AwczZdGafwuI/MX1Te/iqS4y64vb6BhcskmRUgAAAAAAAANB4XNFRnho4rdOiUYN/vV2NLLyPJ+csM2ckNMDQwL7R+mcTQ86b7YeJTfF8sXsfmGDLcdDcJ98Mo4quNsd3HrXEn1uO6XoJhqJdF0Jp/DYqHHosUsuVDdOHai9q9RnDWWVCgHicM9nTvQWJwo4LB11QVdUIwhHPKMVklm83s62yRGIwtrTaczOVwisjAxWndP4bCQ7pfZlnyYLbOb6IxW/r3BMuYaf4RsVdnDD/APD17dq22teOW6Pk85rDPM0662U5cacpSk98pycm/KyxDLwUAmAABMXk81sa3NbGupgbhq3wg4nDtQvbxFO75T+civ4Zvf1Pzokw1FnWtEaVpxNSuompwl0b4y54yXM10Mw3Er4KAAAAAAA1PhR8GW9uj72JYZs4kbYAAQArYTF2VTVtU5QnF5xlF5Nf/dAwsOu6j67xxeVF+UMSlsy2RuS549Et+a83ixLcS3VMjSQAADV9d9bIYGvixyliLF83Dmiv35+L1+cQkuLaQx1t9krrpynZJ7ZS9CS3JLoRvDnlblQCgAAEAAAKzGq+sFuCvVsM3W8ldVnssh+JczJMES7xo7GQurhdXLjQsipRfSn7zDquQAAAAAAanwo+DLe3R97EsM2cSNsAQAAAPVVkoyUotxlFqUZJ5OMluaYwO56jaxLGYZSll3avKFyXO+aa8Ult85iXSJbIRoAhgc44XtEuUK8ZFfm/mbezJ5wb/qbX9RqGLQ5caZAgAAAAAAAAA6XwRaZfzmCm9mTupze7alOK86flZmW6z5OmZmXR6CAAAAA1PhR8GW9uj72JYZs4kbYAgAAAANm4O9KvD4+Cb+bv+YsXNnLkS61LJeVmWqy7kjLokABb4/BwuqnTZHjQsi4yXSmBwXWfQFuCvdU03B5umzmsh+Jc6NxLlMMQVAAAAAAAAABmdTcZ3HH4ezm7qoPs2fIftElY6u+8Uy6PZFAAAABqfCj4Mt7dH3sSwzZxI2wBAAAAATGxxanHlRalHtLaiSr6RwNynXCxbrIQmv6kn7zDqrgAAGP03oenFVOm+ClF7U90oS5pRfMwkw5BrNqNisK3OCd9G1qcFnKK/jgt3WtnUbiWJhqiYyiS5AIAAAAABdaLqcroZc04yz6OK0ySr6J7ozLpmFYigAAAA1PhR8GW9uj72JYZs4kbYAgAAAABJWH0FqnLPAYV/wDS0ewjEukMuFUMZiY1wdk3lGKzk+hZ5ZgVa5ppNPNNZprc0B6AjIDAaa1OwWJblZSozf6yp8SWfS8tkvKmXKcsNO0jwVyW3D4lNc0boZP+6PwGWeVr+L4P9JQ3URsXTVbB+iTT9BcpiWDxuisRT+eoury55VyS/uyyNZTCzCAAKlLN5JZt7l0hGx6Iwnc8s+U5LjfAkpl27Iy6YVyNgAAAA1PhR8GW9uj72JYZs4kbYAgAAAAAV9B6q944b6rR7ETEukMqiKxOtned38v3osM2nuaRq7rNZhmoTTnTnyf0oeODfN4izDnWzoWj9I1Xw49U1Jc/Sn0Ncxl1iV4FAAENARKOex7V4wMBpfU3AYjNzojCb/WU/Nyz6Xxdj8qZcszDnmsnB1iKE7MPLu9S2uOWVsV2Vsl5NviKzytMrrbfFSbk9mXPmVlnNHaPUPlSyc/RHq8fjKkyyNXKXWvWSUjq7EZdcrgjYAAAANT4UfBlvbo+9iWGbOJG2AIAAAAAwPoPVXvHDfVqPYiYnq61ZVEVidbO8rv5fvRYZs5WzTiq4bEzrlx65ShJbnF5f7ohltGjdd7I/JvrU/44bJeVbn6BhuLtkwes+Es/XRi+iz5HpewmG+Zlqr4y2xlGS6YtP1EXL3mAzCrXFaRorXzltcO1NZ+beDMNd0lrtTHZRF2y6XnGC978xcMTeGiYu3uls7nGEZ2PjS4kck2acpnKmVHqvlLrRJWOrsRHRcGXQAAAAGp8KPgy3t0fexLDNnEjbAEAAAAAYH0Hqr3jhvq1HsRMT1dasqiKxOtneV38v3osM2crNQ4IKAACYya3NrqeQXKvHG2rdbauqyXxGDLzPFWS5Vlj65yfvBlRyABAAB6q5S60SVjq7ER0XBl0AAAABqfCj4Mt7dH3sSwzZxI2wBAAAAAGJV9Caq944b6rR7CObpHRlUFYjWzvK7+X70WGbOVmocEFAAAAAAAAAAA9VcpdaJKx1diI6Lgy6AAAAA1PhR8GW9uj72JYZs4kbYAgAAAADEj6E1V7xw31Wj2Ec5dY6MqFYjWzvK7+X70WGbOVmocEFAAAAAAAAAAA9VcpdaJKx1diI6Lgy6AAAAA1PhR8GW9uj72JYZs4kbYAgAAAADEj6E1V7xw31Wj2Ec5dY6MqFYjWzvK7+X70WGbOVmocEFAAAAAAAAAAA9VcpdaJKx1diI6Lgy6AAAAA1PhR8GW9uj72JYZs4kbYAgAAAADEj6E1V7xw31Wj2Ec5dY6MqFYjWzvK7+X70WGbOVmocEFAAAAAAAAAAA9V8pdaJKx1diMui4I6AAAAA1PhR8GW9uj72JYZs4kbYAgAAAADEj6E1V7xw31Wj2Ec5dY6MqFYjWzvK7+X70WGbOVmocEFAAAAAAAAAAArYOmU7IwhFylKSyS5ySsRmXXdpl1xK5I2AAAADUuFHwZb26PvYlhmziZtgGQGQGQGQGQZJH0Hqr3jhvqtHsIw6QywVa6TwauqnVJtKcXFtb0EmHN9L6s4ijOXF7pX+/BZ5L+KO9eo3EuM1wwoyyFAAAAACAUBkZDROhrsRLKuL4ufyrJbIx8vO/EiZaiuXRdBaAqw0fk/Ksa+XY1tfiXQjM97rWMMrxTLeXoqAAAAAxWsuh1jMPLDSnKCm4PjRSbXFkpbn1BJjLTvyUU/S7fs4Fyzyo/JRV9Lt+zh8Rk5Ufkor+l2fZR+IOVD4KIfTJ/ZR+IycqPyUQ+mS+xX4hk5Ufknj9Ml9gvxDJyn5J19Mf2C/GMnK3/RWD7jRXRnxu5VV18bLLjcWKWeXNuI1C8CgHnIDF6S1dwt22dSUv34Zxl6N/lKzNctcxmoj303dUbF/wCy+BcszRh8RqpjY/qlNdNc4v0PJjLHIsLdFYmO+i5f6cmvOkIk5ZUJYexb65rrizRyyRw9j2Kub6oyCYlc06GxU+TRb5YNelmVxLK4PUzFT5fEqXjlxn5o/ETK8stj0bqbhq8nZndJfvbI59lb/LmRuKNjhXFJKKSS2JJZJeQjeHsAAAAAAACGBIQAgKlhHlhYSAAASAAgAAYHlhHoKkAwjyygg0lEEoIAAP/Z",50,45,{
        width: 50
    })
    .fillColor("#444444")
    .fontSize(20)
    .text("SMK TELKOM MALANG",120,70)
    .fontSize(10)
    .text(" MALANG JAWA TIMUR",200,65,{
        align:"right"
    })
    .text("JEMBER, JAWA TIMUR, 2003",200,80,{
        align:"right"
    })
    .moveDown()
}

const generateStudentInformation = (doc)=>{
    generateHr(doc,185)
    doc
        .text(`Report Number : ${student.students.number}`,50,120)
        .text(`Report Date : ${student.students.date()} `,50,145)
        .text(`School : SMK TELKOM MALANG`,400,120)
        .text(`Address : Jl. Danau Ranau, Sawojajar, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139`,400,145 )
        .moveDown()
    generateHr(doc,110)
}

const generateHr=(doc,y)=>{
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(10,y)
        .lineTo(580,y)
        .stroke()
}

const generateInoviceTable = (doc,showDataAsessment)=>{
    let i
    const inovoiceTableTop = 230
    doc.font("Helvetica-Bold")
    generateTableRow(doc,
                    inovoiceTableTop,
                    "id",
                    "classs",
                    "nik",
                    "gender",
                    "name",
                    "score"
                    )
    generateHr(doc,inovoiceTableTop + 20)
    doc.font("Helvetica")
    for(i=0;i<showDataAsessment.length;i++){
        const item = showDataAsessment[i]
        const position = inovoiceTableTop + (i + 1) * 30
        generateTableRow(
            doc,
            position,
            item.student.id,
            item.student.classs,
            item.student.nik,
            item.student.gender,
            item.student.name,
            item.score
        )
        generateHr(doc,position + 20)
    }
}

const generateTableRow = (doc,y,id,name,classs,nik,gender,score)=>{
    doc
        .fontSize(10)
        .text(id,50,y)
        .text(classs,150,y)
        .text(nik,250,y,{
            width:90
        })
        .text(gender,320,y,{
            width:90
        })
        .text(name,400,y,{
            width:50,
            height:50
        })
        .text(score,450,y,{
            width:90,
            align:"right"
        })
}