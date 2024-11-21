export interface DUser {
    id: number;
    email: string;
    name: string | null;
    password: string;
    passwordSalt: string;
    forgotpasswordtoken: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IUser {
    id?: unknown | null;
    name: string | null;
    email: string;
    password: string;
    passwordSalt: string;
}

export interface RegisteredUser {
    email: string;
    username: string;
    token: string;
}

export interface ChangePassword {
    otp: string;
    oldPassword: string;
    newPassword: string;
    email: string
}

export interface ValidateData {
    password: string;
}

export interface TokenDecode {
    id: string;
    email: string;
}
  

export interface ValidationResult {
    password: string;
    salt: string;
}

export interface WebsocketData {
    lineWidth: number;
    x: any;
    y: any;
    color: string;
    clear: boolean;
    room: string;
    type: string;
}

export interface SaveWhiteBoardData {
    whiteBoardId?: number | any
    name: string;
    userId: number | string;
    imageData?: string
}