import multer from 'multer';

const storage = multer.diskStorage({
  /* cb <= callback */
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
});
const upload = multer({ storage });

export default upload;
