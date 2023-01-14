const multer= require('multer');
const AppError = require('./AppError');
let FILE_MIME_TYPE= {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg"
};

let options= (folderName)=> {
    const storage= multer.diskStorage({
    
        destination: (req,file,cb)=> {
            let checkError= new AppError("Invalid Image type");
    
            if(FILE_MIME_TYPE[file.mimetype]) {
                checkError= null
            }
    
            cb(checkError,`uploads/${folderName}`)
        },
        filename: (req,file,cb)=> {
            let fName= file.originalname.split(' ').join('_');
            let ext= FILE_MIME_TYPE[file.mimetype];
            cb(null, fName +Date.now()+'.' + ext)
        }
    });
    
    const uploadStorage= multer({storage});
    return uploadStorage;
}
module.exports.uploadSingleFile= (fieldName, folderName)=> options(folderName).single(fieldName)


module.exports.uploadFields= (arrayOfFields, folderName)=> options(folderName).fields(arrayOfFields)
 
    