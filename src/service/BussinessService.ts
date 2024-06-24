import BussinessDto from "../dto/request/BussinessDto";
import GeneralDtoResp from "../dto/response/GeneralDtoResp";
import ServiceApi from "../network/ServiceApi";
import BotConstants from "../shared/BotConstants";
import { NetworkUtils } from "../util/NetworkUtils";
import { UtilService } from "../util/Util";
import * as dotenv from "dotenv";

export default class BussinessService {
  public async findByRucOrRazonSocial() {
    dotenv.config();
    try {
      const ruc: string | undefined = process.env.RUC;
      const razonSocial: string | undefined = process.env.RAZON_SOCIAL;

      UtilService.log("Verificando negocio");
      UtilService.log("Ruc a buscar: " + ruc);
      UtilService.log("Razon social a buscar: " + razonSocial);

      if (ruc === undefined) {
        UtilService.finishProgram("No se ha cargado la variable RUC");
        return;
      }

      UtilService.log(
        "Buscando negocio con el servicio web usando el ruc: " + ruc
      );

      const serverResponse = await ServiceApi.getInstance().get<GeneralDtoResp>(
        `${BotConstants.BUSSINESS_GET_RUC_URL}${ruc}`
      );

      UtilService.log("serverResponse.status: " + serverResponse.status);

      if (serverResponse.status !== 200) {
        UtilService.finishProgram(
          "No se ha encontrado un negocio en particular"
        );
        return;
      }

      // Asegúrate de que serverResponse.data.data es un array y tiene al menos un elemento
      const responseData = serverResponse.data.data;
      if (!Array.isArray(responseData) || responseData.length === 0) {
        UtilService.log(
          "Error: Datos no encontrados en serverResponse.data.data"
        );
        return;
      }

      // Acceder al primer elemento del array
      const response: BussinessDto = responseData[0] as BussinessDto;

      // Verificar las propiedades del objeto response
      UtilService.log("Negocio recibido: " + response.name);

      response.configurationCollection!!.forEach((conf) => {
        UtilService.log("+++++++++ Configuracion traida ++++++++++++")
        UtilService.log(`.- Ruta local de guardado: ${conf.mainLocalDirectory}`)
        UtilService.log(`.- Credenciales email: ${conf.emailCredential}`)
        UtilService.log(`.- Google Api Key: ${conf.googleApiKey}`)
        UtilService.log(`.- Remote Folder: ${conf.mainRemoteDirectory}`)
        UtilService.log(`.- Whatsapp credenciales: ${conf.whatasppCredential}`)
        UtilService.log("++++++++++++++++++++++++++++++++++++++++++")
      });

      UtilService.log("Guardando en memoria")
      BotConstants.BUSSINESS_CONFIG_SYSTEM = response;

    } catch (error) {
      UtilService.log(
        "Se ha encontrado un error al buscar el negocio: " + error
      );
    }
  }
}
