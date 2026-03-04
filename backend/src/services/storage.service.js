const  ImageKit = require('@imagekit/nodejs');
const {toFile} = require("@imagekit/nodejs")


const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});



async function uploadFile({buffer,filename="filename",folder=""}){
 const response =  await client.files.upload({
  file: await toFile(Buffer.from(buffer),"file"),
  fileName:filename,
  folder:folder,
});

return response

}



module.exports = {uploadFile}