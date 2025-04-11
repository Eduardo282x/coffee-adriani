export interface IToken {
    id: number;
    name: string;
    lastName: string;
    username: string;
    rol: string;
    iat: number;
    exp: number;
}

export interface ITokenExp extends IToken {
    expired: boolean;
}

export interface GroupUsers {
    allUsers: IUsers[];
    users: IUsers[]
}
export interface IUsers {
    id:       number;
    name:     string;
    lastName: string;
    username: string;
    password: string;
    rolId:    number;
    roles:    Roles;
}

export interface Roles {
    id:  number;
    rol: string;
}

export interface BodyUsers {
    username: string;
    name: string;
    lastName: string;
    rolId: number;
}