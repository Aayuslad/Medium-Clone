export function formatDate(inputDate: string) {
	const date = new Date(inputDate);

	const now = new Date();
	const diff = now.getTime() - date.getTime();

	const minute = 60 * 1000;
	const hour = minute * 60;
	const day = hour * 24;

	let timeAgo;

	if (diff < minute) {
		timeAgo = Math.round(diff / 1000) + " seconds ago";
	} else if (diff < hour) {
		timeAgo = Math.round(diff / minute) + " minutes ago";
	} else if (diff < day) {
		timeAgo = Math.round(diff / hour) + " hours ago";
	} else {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const month = months[date.getMonth()];
		const day = date.getDate();
		const year = date.getFullYear();
		timeAgo = `${month} ${day}, ${year}`;
	}

	return timeAgo;
}
