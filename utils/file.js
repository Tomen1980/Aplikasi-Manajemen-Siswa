const fs = require("fs")

const deleteFile = (filePath)=>{
    if(fs.existsSync(filePath) == true){
        fs.unlink(filePath,(err)=>{
            if(err){
                throw err
            }
        })
    }
}

exports.deleteFile = deleteFile