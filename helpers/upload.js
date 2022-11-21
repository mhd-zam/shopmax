const uploadFilesMiddleware = require("../middleware/multer");
const db=require('../config/connection')

const { response } = require('../app');



const multipleUpload = async (req, res,next) => {
  try {
    await uploadFilesMiddleware(req, res);
 
    next();
    //  return res.send('success')
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

module.exports = {
  multipleUpload: multipleUpload
};