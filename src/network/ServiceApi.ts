import axios, {
  AxiosResponse,
  AxiosInstance,
} from "axios";
import BotConstants from "../shared/BotConstants";
import { UtilService } from "../util/Util";
import { NetworkUtils } from "../util/NetworkUtils";

import {config} from  "dotenv" 

class ServiceApi {
  private objAxios:AxiosInstance|null = null ;
  private static objInstanceAxios:AxiosInstance|null = null ;

  constructor() {
    this.objAxios = axios.create({
      baseURL: BotConstants.MAIN_BASE_API_URL,
    });
  }

  /**
   * Apicando el patron singleton
   * @returns Instancia de axios para las llamadas http
   */
  public static getInstance():AxiosInstance{
      if(this.objInstanceAxios == null){
        this.objInstanceAxios = axios.create({
          baseURL: BotConstants.MAIN_BASE_API_URL,
        });
      }

      return this.objInstanceAxios;

  }


  /**
   * Encargado de hacer el test de los servicios 
   * @returns Promesa 
   */
  public async testService(): Promise<boolean> {
    UtilService.log("Se inicia la peticion de test");
    let isOk: boolean = false;

    try {
      const result: AxiosResponse = await this.objAxios!
              .get(BotConstants.TEST_API_URL);
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

