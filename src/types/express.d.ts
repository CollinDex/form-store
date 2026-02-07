import { UserRole } from '.';

declare global {
	namespace Express {
		interface Request {
			user?: {
				userId: string;
				role: UserRole;
				email: string;
				username: string;
			};
		}
	}
}
