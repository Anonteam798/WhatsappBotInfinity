import { Message, MessageTypes } from "whatsapp-web.js";
import WspDtoReq from "../dto/request/WspDtoReq";
import { UtilService } from "../util/Util";
import { AxiosError, AxiosResponse } from "axios";
import ServiceApi from "../network/ServiceApi";
import BotConstants from "../shared/BotConstants";
import GeneralDtoResp from "../dto/response/GeneralDtoResp";
import { NetworkUtils } from "../util/NetworkUtils";
import WhatsappUtils from "../util/WhatsappUtils";
import WspMediaReq from "../dto/request/WspMediaReq";
import { FileService } from "./FileService";
import FileObject from "../model/FileObject";

export default class WspMessageService {
  public analyzeMessageType(wspMessage: Message): string {
    //Verificando si es una notificacion broadcoast
    // Se subio un estado

    if (wspMessage.from.startsWith("atus@broad")) {
      return MessageTypes.BROADCAST_NOTIFICATION.toString();
    }

    const returned: string | undefined = BotConstants.getKeyByValue(
      MessageTypes,
      wspMessage.type
    );

    return returned != undefined ? returned : "MESSAGETYPE NOT FOUND";
  }

  public async saveMediaMessage(
    wspMessage: Message,
    fullPath: string,
    objFileService: FileService
  ): Promise<Number> {
    UtilService.log("Registrando mensaje");
    var idReturned: number = -1;

    const stringFileHash = await objFileService.hashFileSha256(fullPath);
    const fileInformation: FileObject | undefined =
      await objFileService.getFileInformation(fullPath);

    if (fileInformation === undefined) {
      UtilService.log("No se ha podido retornar la informacion del archivo");
      UtilService.log("Escapando envio de la info");
    } else {
      const wspFileDto: WspMediaReq = {
        name: fileInformation.fileName,
        fullPath: fullPath,
        extension: fileInformation.extension,
        hash: stringFileHash,
        size: fileInformation.fileSizeBytes,
        isUploaded: "",
        uploadUrl: "",
      };

      const response = await ServiceApi.getInstance().post<GeneralDtoResp>(
        BotConstants.WSP_MEDIA_API_URL_POST,
        wspFileDto
      );

      UtilService.log("serverResponse.status: " + response.status);

      if (response.status !== 200) {
        UtilService.finishProgram(
          "No se ha encontrado un negocio en particular"
        );
        return 0;
      }

      const responseData = NetworkUtils.objectToMap(response.data.data);
      UtilService.log("Id retornado: " + responseData.get("idResult"));
      idReturned = responseData.get("idResult")!!;

      return idReturned;
    }

    return 0;
  }

  /**
   * Encargado de registrar los mensajes de whatsapp
   * @param wspMessage entidad del modelo Message
   * @returns true si fue creado exitosamente de lo contrario
   * false
   */
  public async saveWhatsappMessage(
    wspMessage: Message,
    fileId: Number | undefined
  ): Promise<Boolean> {
    UtilService.log("Registrando mensaje");
    let isOk: Boolean = true;

    var groupId: string = WhatsappUtils.getGroupId(wspMessage);

    var message = "";
    if ((wspMessage.body === null || wspMessage.body === "") && wspMessage.hasMedia) {
      message = "MSJ MEDIA";
    } else {
      message = wspMessage.body;
    }

    try {
      const request: WspDtoReq = {
        message: message,
        isMediaMessage: wspMessage.hasMedia,
        uuidMediaMessage: "xx",
        idWhatsAppFile: fileId === undefined ? 0 : fileId.valueOf(),
        idContactFrom: {
          contactName: wspMessage.author === undefined ? "" : wspMessage.author,
          phoneNumber:
            groupId === ""
              ? UtilService.cleanWhatsappPhone(wspMessage.from)
              : UtilService.cleanWhatsappPhone(wspMessage.author!),
        },
        idContactTo: {
          contactName: wspMessage.author === undefined ? "" : wspMessage.author,
          phoneNumber: UtilService.cleanWhatsappPhone(wspMessage.to),
        },
        groupId: groupId,
        idTypeMessage: this.analyzeMessageType(wspMessage),
      };

      UtilService.log(
        "Haciendo peticion con el cuerpo: " + NetworkUtils.respToJson(request)
      );

      const response: AxiosResponse<GeneralDtoResp> =
        await ServiceApi.getInstance().post<GeneralDtoResp>(
          BotConstants.WSP_API_URL_POST,
          request
        );

      UtilService.log(
        "Respuesta del servicio: " + NetworkUtils.respToJson(response.data)
      );
    } catch (error) {
      UtilService.log("Ocurrio un error en la llamada: " + error);
    }
    return isOk;
  }
}
