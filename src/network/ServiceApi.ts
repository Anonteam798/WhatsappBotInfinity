import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import BotConstants from "../shared/BotConstants";
import { UtilService } from "../util/Util";
import { NetworkUtils } from "../util/NetworkUtils";

class ServiceApi {
  private objAxios: any = null;

  constructor() {
    this.objAxios = axios.create({
      baseURL: BotConstants.MAIN_BASE_API_URL,
    });
  }
  /**
   * Encargado de hacer el test de los servicios 
   * @returns Promesa 
   */
  public async testService(): Promise<boolean> {
    UtilService.log("Se inicia la peticion de test");
    let isOk: boolean = false;

    try {
      const result: AxiosResponse = await this.objAxios.get(BotConstants.TEST_API_URL);
      isOk = true;
      UtilService.log("Respuesta: " + NetworkUtils.respToJson(result.data));
    } catch (err: any) {
      UtilService.log("Ocurrió un error en la llamada: " + err);
    }

    UtilService.log(isOk + "");
    return isOk;
  }
}

export default ServiceApi;

//new ServiceApi().testService();
