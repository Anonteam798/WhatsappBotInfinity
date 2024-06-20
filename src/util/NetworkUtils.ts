import { AxiosResponse } from "axios";

export class NetworkUtils{
    public static respToJson(resp:any):string{
        return JSON.stringify(resp);
    }
}