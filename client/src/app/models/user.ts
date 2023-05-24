import {FuseUtils} from "../utils";

export enum Role {
    User = 'ROLE_USER',
    Admin = 'ROLE_ADMIN'
}

export class User {
    _id: number;
    username: string;
    password: string;
    email: string;
    //firstName: string;
    name: string;
    lastName: string;
    enabled: boolean;   
    token?: string;
    role: any;
    fullName?:string;  
    fileEncode?: any;

    /**
     * Constructor
     *
     * @param product
     */
    constructor(user:any)
    {
        user = user || {};
        this._id = user._id || FuseUtils.generateGUID();
        this.username = user.username;
        this.password = "";
        this.name = user.name;
        this.lastName = user.lastName;
        this.email = user.email;
        this.enabled = user.enabled;
        this.role = user.role;     
        this.fileEncode = user.fileEncode;      
    }
}