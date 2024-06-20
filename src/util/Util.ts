import { format } from "date-fns";

const log4js = require("log4js");

/*
log4js.configure({
  appenders: { walog: { type: "file", filename: "whatsappOwn.log" } },
  categories: { default: { appenders: ["walog"], level: "debug" } },
});
*/

const logger = log4js.getLogger("walog");
logger.level = "debug";

export class UtilService {
  public static cleanWhatsappPhone(rowPhone: string): string {
    return rowPhone.replace("@c.us", "").substring(2);
  }

  public static log(message: string): void {
    logger.debug(message);
  }

  public static formatDate(date: Date): string {
    return format(date, "ddMMyyyy_HHmmss");
  }

  public static finishProgram(message:string){
    UtilService.log("/****** Cerrando aplicacion. *****\\");
    UtilService.log("Motivo: " +message)
    process.exit(0);
  }


  

}
