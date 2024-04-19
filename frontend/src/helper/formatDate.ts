export function formatDate(inputDate: string) {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// Parse the input date string
	const date = new Date(inputDate);

	// Extract the components of the date
	const year = date.getFullYear();
	const month = months[date.getMonth()];
	const day = date.getDate();

	// Construct the formatted date string
	const formattedDate = `${month} ${day}, ${year}`;

	return formattedDate;
}
