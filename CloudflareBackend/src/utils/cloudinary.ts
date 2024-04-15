
export const uploadImageCloudinary = async function (image: File) {
	// Create a FormData object and append the image and upload preset
	const formData = new FormData();
	formData.append("file", image);
	formData.append("upload_preset", "uploadPresetOne"); // Replace with your upload preset

	// Send a POST request to Cloudinary API to upload the image
	const cloudinaryResponse = await fetch("https://api.cloudinary.com/v1_1/daiozrypo/image/upload", {
		method: "POST",
		body: formData,
	});

	// Parse the JSON response from Cloudinary and return secure URL
	const response: { secure_url: string } = await cloudinaryResponse.json();
	return response.secure_url;
};
