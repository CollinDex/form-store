import { Types } from 'mongoose';

export enum UserRole {
	USER = 'user',
	ADMIN = 'admin'
}

export enum NotificationsStatus {
	UNREAD = 'unread',
	READ = 'read'
}

export interface IUser {
	id: string;
	username: string;
	password: string;
	email: string;
	role: UserRole;
}

export interface IUserLogin {
	email: string;
	password: string;
}

export interface IUserSignUp {
	username: string;
	email: string;
	password: string;
	role: UserRole;
}

export interface JwtPayload {
	userId: string;
	role?: UserRole;
}
