"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageCloudinary = void 0;
const uploadImageCloudinary = function (image) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a FormData object and append the image and upload preset
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "uploadPresetOne"); // Replace with your upload preset
        // Send a POST request to Cloudinary API to upload the image
        const cloudinaryResponse = yield fetch("https://api.cloudinary.com/v1_1/daiozrypo/image/upload", {
            method: "POST",
            body: formData,
        });
        // Parse the JSON response from Cloudinary and return secure URL
        const response = yield cloudinaryResponse.json();
        return response.secure_url;
    });
};
exports.uploadImageCloudinary = uploadImageCloudinary;
