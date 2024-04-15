import cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

export const uploadImageCloudinary = async function (image: Express.Multer.File, oldImage?: string) {
	try {
		const result = await cloudinary.v2.uploader.upload(image.path, {
			folder: "medium_clone",
		});

		if (oldImage) {
			await cloudinary.v2.uploader.destroy(
				`medium_clone/${extractPublicIdFromUrl(oldImage)}`,
			);
		}

		return result.secure_url;
	} catch (error) {
		console.error("Error uploading image to Cloudinary:", error);
		return;
	}
};

// Function to extract public_id from Cloudinary image URL
function extractPublicIdFromUrl(imageUrl: string): string {
	const startIndex = imageUrl.lastIndexOf("/") + 1;
	const endIndex = imageUrl.lastIndexOf(".");
	return imageUrl.substring(startIndex, endIndex);
}
