import { AxiosError, AxiosResponse } from "axios";
import { UtilService } from "./Util";

export class NetworkUtils {
  public static respToJson(resp: any): string {
    return JSON.stringify(resp);
  }

  public static showAxiosError(err: AxiosError): void {
    UtilService.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    UtilService.log("Error code: " + err.code);
    UtilService.log("Error status: " + err.status);
    UtilService.log("Error response: " + this.respToJson(err.response));
    UtilService.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  }
  public static objectToMap(obj: Object): Map<string, number> {
    /*
    const map = new Map<string, number>();
    Object.keys(obj).forEach((key) => {
      map.set(key, obj[key]);
    });
    return map;*/
    return new Map<string, number>(Object.entries(obj));
  }
}
