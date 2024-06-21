import BussinessDto from "../dto/request/BussinessDto";
import GeneralDtoResp from "../dto/response/GeneralDtoResp";
import ServiceApi from "../network/ServiceApi";
import BotConstants from "../shared/BotConstants";
import { NetworkUtils } from "../util/NetworkUtils";
import { UtilService } from "../util/Util";
import { AxiosResponse } from "axios";
import * as dotenv from "dotenv";

export default class BussinessService {
  public findByRucOrRazonSocial(): void {
    dotenv.config();
    try {
      const ruc: string | undefined = process.env.RUC;

      if (ruc === undefined) {
        UtilService.finishProgram("Se ha cargado la variable RUC");
      }

      UtilService.log(
        "Buscando negocio con el servicio web usando el ruc: " + ruc
      );
      ServiceApi.getInstance()
        .get<GeneralDtoResp>(
          `${BotConstants.BUSSINESS_GET_RUC_URL}${process.env.RUC!}`
        )
        .then((reps) => {
          if (reps.status !== 200) {
            UtilService.finishProgram(
              "No se ha encontrado un negocio en particular"
            );


            const response: BussinessDto = reps.data.data as BussinessDto;

            UtilService.log(response.razonSocial + "");

          }

        });
      UtilService.log("Inicio exitoso");
    } catch (error) {
      UtilService.log(
        "Se ha encontrado un error al buscar el negocio: " + error
      );
    }
  }
}
