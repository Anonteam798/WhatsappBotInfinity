import { MessageTypes } from "whatsapp-web.js";
import { UtilService } from "../util/Util";
import BussinessDto from "../dto/request/BussinessDto";
import { config } from "dotenv";

export default class BotConstants {
  public static readonly MAIN_BASE_API_URL: string =
    "http://localhost:8084/api/v1";
  public static readonly TEST_API_URL: string = "/test";
  public static readonly WSP_API_URL_POST: string = "/wspm";
  public static readonly WSP_MEDIA_API_URL_POST: string = "/wspm/media";

  //Bussiness
  public static readonly BUSSINESS_POST_URL = "/bussiness/new";
  public static readonly BUSSINESS_GET_URL = "/bussiness/all";
  public static readonly BUSSINESS_GET_RUC_URL = "/bussiness/find/";
  

  public static readonly MESSAGE_TYPES_CONF: Map<string, string> = new Map<
    string,
    string
  >();

  public static BUSSINESS_CONFIG_SYSTEM: BussinessDto;

  public static RUC_ENV: string;
  public static RAZON_SOCIAL: string;

  public static loadEnvConfig(): void {
    config({ path: "../../.env" });

    BotConstants.RUC_ENV = process.env.RUC || "";
    BotConstants.RAZON_SOCIAL = process.env.RAZON_SOCIAL || "";

    UtilService.log(
      "Se han cargado las variables de configuracion del archivo .env"
    );
  }

  public static getKeyByValue(object:any, value:any):any {
    return Object.entries(object).find(([key, val]) => val === value)?.[0];
  }
  public static seedTypes(): void {
    this.MESSAGE_TYPES_CONF.set("chat", "TEXT");
    this.MESSAGE_TYPES_CONF.set("video", "VIDEO");
    this.MESSAGE_TYPES_CONF.set("image", "IMAGE");
  
    //this.MESSAGE_TYPES_CONF.set("chat",MessageTypes.TEXT);

    UtilService.log(
      "MESSAGE_TYPES_CONF inicializado con: " +
        this.MESSAGE_TYPES_CONF.size +
        " items"
    );
  }
}



