import multer from 'multer';
import DataParser from 'datauri/parser.js';
import path from 'path';

const storage = multer.memoryStorage();
const upload = multer({ storage });
/* const storage = multer.diskStorage({
  //cb <= callback 
  destination: (req, file, cb) => {
    // 'public/uploads': the actual location, the destination <= to set the directory where uploaded files will be stored
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    //construct a file name
    const fileName = file.originalname;
    // set the name of the uploaded file
    cb(null, fileName);
  },
}); */

const parser = new DataParser();

// when we run Malter, essentially
// we add this file to a request object
export const formatImage = (file) => {
  //console.log(file);
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;
