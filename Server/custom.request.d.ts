// making custom express request to add user object in request
declare namespace Express {
	export interface Request {
		user: {
			id: string;
			email: string;
			userName: string;
			password: string;
			bio: string;
			about: string;
			profileImg: string;
		} | null;
	}
}
