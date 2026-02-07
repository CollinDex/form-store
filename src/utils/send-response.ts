import { Response } from 'express';
import { IUser, UserRole } from '../types';

export const sendUser = (user: IUser) => {
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		role: user.role
	};
};

export const sendLoginResponse = (user: IUser) => {
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		role: user.role
	};
};

export const sendJsonResponse = (
	res: Response,
	statusCode: number,
	message: string,
	data?: any,
	accessToken?: string
) => {
	const responsePayload: any = {
		status: 'success',
		message,
		status_code: statusCode,
		data
	};

	if (accessToken) {
		responsePayload.access_token = accessToken;
	}

	res.status(statusCode).json(responsePayload);
};
