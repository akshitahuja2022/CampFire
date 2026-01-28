import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "post") {
      cb(null, "./src/temp/post");
    } else if (file.fieldname === "avatar") {
      cb(null, "./src/temp/avatar");
    } else {
      cb(null, "./src/temp/thumbnail");
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    cb(null, `${timestamp}-${name}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;
