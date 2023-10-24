const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// Local file upload ===> handler function
exports.localFileUpload = async(request, respond) => {
    try{
        // fetch file from request as normal post request
        const uploadingFile = request.files.file;
        console.log(uploadingFile);
        // create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + "." +  `${uploadingFile.name.split('.')[1]}`;
        console.log("Path Is---->" , path);
        // add path to move function
        uploadingFile.mv(path , (err) => {
            console.log(err);
        }); 
        // create a successful response
        respond.json({
            success:true,
            message:"Local File uploaded successfully",
        });
    }
    catch(error){
        console.log("Not able to upload files on server");
        console.log(error);
        return respond.status(401).json({
            success:false,
            message:"File is not uploaded",
            error:error.message,
        });
    }
}


/***************************************************************************************************************************************/

function isSupportedSize(size) {
    return (size < 5000000);
}

function isSupportedFormat(type, supportedTypes){
    if(supportedTypes.includes(type)) return true;
    return false;
}

async function uploadFiletoCloudinary(file, folder, quality) {
    const options = {folder}
    if(quality) options.quality = quality;
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

/***************************************************************************************************************************************/


exports.imageUpload = async(request, respond) => {
    try{
        const {name, email ,tags} = request.body;
        console.log(name,email, tags);
        const uploadingImage = request.files.imageFile;
        console.log(uploadingImage);
        // perform validation on files to supported or not
        const supportedTypes = ["pdf", "jpg", "jpeg"];
        let fileType = uploadingImage.name.split(".")[1];  // hitendra.pdf
        if(!isSupportedFormat(fileType,supportedTypes)){
            return respond.status(401).json({
                success:false,
                message:"File type is not supported",
            });
        }
        // now upload file to cloudinary
        const uploadedImage = await uploadFiletoCloudinary(uploadingImage, "Hitendra");
        console.log(uploadedImage);
        // save entry in database
        const imageDatabaseEntry = await File.create({name,email,tags,imageUrl:uploadedImage.secure_url});
        return respond.status(200).json({
            success:true,
            data:imageDatabaseEntry,
            imageUrl: uploadedImage.secure_url,
            message:"Image successfully uploaded",
        })
    }
    catch(error) {
        console.log(error);
        return respond.status(400).json({
            success:false,
            data:"Internal server error",
            message:"Something went wrong file uploading image to server",
            error:error.message,
        })
    }
}



/*****************************************************************************************************************/


exports.videoUpload = async(request, respond) => {
    try{
        // fetch name email and tags of video
        const {name, email, tags} = request.body;
        console.log(name, email ,tags);
        // fetch the file of video
        const uploadingVideo = request.files.videoFile;
        console.log(uploadingVideo);
        // check validation file type + file size
        const supportedTypes = ["mkv", "mov" , "mp4"];
        const fileType = uploadingVideo.name.split(".")[1];
        if(!isSupportedFormat(fileType, supportedTypes)){
            return respond.status(401).json({
                success:false,
                message:"File type is not supported please check and try again",
            });
        }
        const fileSize = uploadingVideo.size;
        if(!isSupportedSize(fileSize)) {
            return respond.status(401).json({
                success:false,
                message:"File size is greater than 5MB",
            });
        }
        console.log("uploading to cloudinary .....")
        // upload file to cloudinary
        const uploadedVideo = await uploadFiletoCloudinary(uploadingVideo, "Hitendra");
        console.log(uploadedVideo);
        // make entry in database
        const videoDatabaseEntry = await File.create({name,email,tags,imageUrl:uploadedVideo.secure_url});
        // send a success flag
        console.log("File uploaded successfully to cloudinary");
        respond.status(200).json({
            success:true,
            data:videoDatabaseEntry,
            url:uploadedVideo.secure_url,
            message:"File uploaded successfully to cloudinary",
        })
    }
    catch(error) {
        console.log(error);
        respond.status(600).json({
            success:false,
            data:"Internal server error",
            message:"video not uploaded",
            error:error.message,
        });
    }
}




/******************************************************************************************************************** */
exports.imageSizeReducer = async(request, respond) => {
    try{
        const {name, email, tags} = request.body;
        const uploadingImage = request.files.imageFile;
        const supportedTypes = ["pdf", "jpg", "jpeg"];
        const fileType = uploadingImage.name.split(".")[1];
        if(!isSupportedFormat(fileType, supportedTypes)){
            return respond.status(401).json({
                success:false,
                message:"File type is not supported please check and try again",
            });
        }
        const uploadedImage = await uploadFiletoCloudinary(uploadingImage, "Hitenda" , 30);
        const imageDatabaseEntry = await File.create({name,email,tags,imageUrl:uploadedImage.secure_url});
        console.log("File uploaded successfully to cloudinary");
        respond.status(200).json({
            success:true,
            data:imageDatabaseEntry,
            url:uploadedImage.secure_url,
            message:"File uploaded successfully to cloudinary",
        })
    }
    catch(error) {
        console.log(error);
        respond.status(600).json({
            success:false,
            data:"Internal server error",
            message:"video not uploaded",
            error:error.message,
        });
    }
}