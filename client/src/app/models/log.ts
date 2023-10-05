import { FuseUtils } from "../utils";
export class Log {
    _id: number;
    viewSend: string;
    action: string;
    response: string;
    //firstName: string;
    name: string;
    user: string;
    createdAt: Date;
   

    /**
     * Constructor
     *
     * @param product
     */
    constructor(log: any) {
        log = log || {};
        this._id = log._id || FuseUtils.generateGUID();
        this.viewSend = log.viewSend;
        this.action = log.action;
        this.response = log.response;
        this.name = log.name;
        this.user = log.user;
        this.createdAt = log.createdAt;
    }
}