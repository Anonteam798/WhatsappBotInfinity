import { MessageTypes } from "whatsapp-web.js";
import { UtilService } from "../util/Util";



export default 
    class BotConstants{

    public static readonly MAIN_BASE_API_URL:string  = "http://localhost:8084/api/v1";
    public static readonly TEST_API_URL:string = "/test";
    public static readonly WSP_API_URL_POST:string = "/wspm";


    public static readonly MESSAGE_TYPES_CONF:Map<string,string>
        = new Map<string,string>();



    public static seedTypes():void{

        this.MESSAGE_TYPES_CONF.set("chat","TEXT");
        this.MESSAGE_TYPES_CONF.set("video","VIDEO");
        //this.MESSAGE_TYPES_CONF.set("chat",MessageTypes.TEXT);


        UtilService.log("MESSAGE_TYPES_CONF inicializado con: " + this.MESSAGE_TYPES_CONF.size + " items");


    }

    

}


