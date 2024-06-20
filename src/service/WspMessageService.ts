import { Message, MessageTypes } from "whatsapp-web.js";
import WspDtoReq from "../dto/request/WspDtoReq";
import { UtilService } from "../util/Util";
import { AxiosError, AxiosResponse } from "axios";
import ServiceApi from "../network/ServiceApi";
import BotConstants from "../shared/BotConstants";
import GeneralDtoResp from "../dto/response/GeneralDtoResp";
import { NetworkUtils } from "../util/NetworkUtils";
import WhatsappUtils from "../util/WhatsappUtils";


export default class WspMessageService{


    public analyzeMessageType(wspMessage:Message):string{

        //Verificando si es una notificacion broadcoast
        // Se subio un estado

        if (wspMessage.from.startsWith("atus@broad")) {
            return MessageTypes.BROADCAST_NOTIFICATION.toString();
        }

        const returned:string| undefined =  BotConstants
        .MESSAGE_TYPES_CONF
            .get(wspMessage.type);

        return returned != undefined ? returned : "MESSAGETYPE NOT FOUND";

    }


    /**
     * Encargado de registrar los mensajes de whatsapp
     * @param wspMessage entidad del modelo Message 
     * @returns true si fue creado exitosamente de lo contrario
     * false
     */
    public async  saveWhatsappMessage(wspMessage:Message)
            :Promise<Boolean>{


        UtilService.log("Registrando mensaje")
        let isOk : Boolean = true;

        var groupId:string = WhatsappUtils.getGroupId(wspMessage); 

        try {
            const request:WspDtoReq = {
                message: wspMessage.body,
                isMediaMessage: wspMessage.hasMedia,
                uuidMediaMessage: "xx",
                idWhatsAppFile: 0,
                idContactFrom: {
                    contactName: wspMessage.author === undefined ? "": wspMessage.author,
                    phoneNumber:groupId === ""? UtilService.cleanWhatsappPhone(wspMessage.from) : UtilService.cleanWhatsappPhone(wspMessage.author!)
                },
                idContactTo: {
                    contactName: wspMessage.author === undefined ? "": wspMessage.author,
                    phoneNumber: UtilService.cleanWhatsappPhone(wspMessage.to)
                },
                groupId: groupId,
                idTypeMessage: this.analyzeMessageType(wspMessage)
            };
    
            UtilService.log("Haciendo peticion con el cuerpo: " + NetworkUtils
                    .respToJson(request))
    
            const response:AxiosResponse<GeneralDtoResp>
                = await ServiceApi
                .getInstance()
                .post<GeneralDtoResp>(BotConstants.WSP_API_URL_POST,request)
            
            UtilService.log("Respuesta del servicio: " + 
                    NetworkUtils.respToJson(response.data))
        } catch (error ) {
            UtilService.log("Ocurrio un error en la llamada: " +
             error)
            
        }
        return isOk;
    }


}