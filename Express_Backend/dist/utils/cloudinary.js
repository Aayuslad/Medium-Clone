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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageCloudinary = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const uploadImageCloudinary = function (image, oldImage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield cloudinary_1.default.v2.uploader.upload(image.path, {
                folder: "medium_clone",
            });
            if (oldImage) {
                yield cloudinary_1.default.v2.uploader.destroy(`medium_clone/${extractPublicIdFromUrl(oldImage)}`);
            }
            return result.secure_url;
        }
        catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return;
        }
    });
};
exports.uploadImageCloudinary = uploadImageCloudinary;
// Function to extract public_id from Cloudinary image URL
function extractPublicIdFromUrl(imageUrl) {
    const startIndex = imageUrl.lastIndexOf("/") + 1;
    const endIndex = imageUrl.lastIndexOf(".");
    return imageUrl.substring(startIndex, endIndex);
}
