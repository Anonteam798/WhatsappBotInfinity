import { Message } from "whatsapp-web.js";
import { UtilService } from "./Util";

export default class WhatsappUtils {

    /**
     * Encargado de verificar si el mensaje viene de un grupo
     * @param message Mensaje recibido 
     * @returns Vacio si no es de un grupo de lo contrario envia el id del grupo
     */
  public static getGroupId(message: Message): string {
    var groupId: string = "";

    UtilService.log("Verificando si mensaje es de un grupo");
    if (message.from.endsWith("@g.us")) {
      UtilService.log("Proviene de un grupo, extrayendo id");
      groupId = message.from.replace("@g.us", "");
      UtilService.log("Group-Id: " + groupId);
    } else {
      UtilService.log("No proviene de un grupo, retornando vacio");
    }
    return groupId;
  }
}
