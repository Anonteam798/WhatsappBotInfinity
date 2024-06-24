import {
  Client,
  LocalAuth,
  Message,
  MessageMedia,
  MessageTypes,
} from "whatsapp-web.js";
import { UtilService } from "../util/Util";
import { FileService } from "../service/FileService";
import ServiceApi from "../network/ServiceApi";
import WspMessageService from "../service/WspMessageService";
import BussinessService from "../service/BussinessService";
import BotConstants from "../shared/BotConstants";

const path = require("path"); //  para el tema de rutas en los archivos
export class BotController {
  private _client: Client;
  private _qrcode = require("qrcode-terminal");
  private _fileService: FileService;
  private mainServiceApi: ServiceApi = new ServiceApi();
  private objWspService: WspMessageService = new WspMessageService();

  constructor() {
    this._client = new Client({
      authStrategy: new LocalAuth(),
      /*,
      webVersionCache: {
        type: "remote",
        remotePath:
          "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.0.html",
      },*/
    });

    this._fileService = new FileService();
  }

  initListener(): void {
    this._client.on("qr", (qr) => {
      // Generate and scan this code with your phone
      this._qrcode.generate(qr, { small: true });
    });

    this._client.on("ready", () => {
      UtilService.log("Cliente se ha inicializado");
      UtilService.log("Test del servicio rest");

      this.mainServiceApi.testService().then((result) => {
        if (!result) {
          UtilService.finishProgram("Servicios no iniciados con exito");
        }
        UtilService.log("<> Servicios operando con exito <>");
        new BussinessService().findByRucOrRazonSocial();
      });
    });

    this._client.on("message", (msg) => {
      this.messageHandler(msg);
    });

    this._client.on("authenticated", () => {
      UtilService.log("Autenticado con exito!");
    });

    this._client.on("auth_failure", (msg) => {
      // Fired if session restore was unsuccessful
      UtilService.log("AUTHENTICATION FAILURE: " + msg);
    });

    this._client.initialize();
  }

  private messageHandler(message: Message): void {
    this.showMessageDetails(message);

    //Aplica para lo que es solo mensajes de texto

    //Aplica solo si tiene contenido por descargar
    if (message.hasMedia && message.type !== MessageTypes.STICKER) {
      //Se omite stickers
      //var fullPath: string = process.env.DIRECTORY_PATH!;

      if (BotConstants.BUSSINESS_CONFIG_SYSTEM === undefined) {
        UtilService.finishProgram(
          "Error de inicio, no se ha establecido un directorio local para la multimedia Whatsapp"
        );
      }
      message.downloadMedia().then((meMedia) => {
        this.showMediaDetails(meMedia);

        var fullPath: string =
          BotConstants.BUSSINESS_CONFIG_SYSTEM.configurationCollection!![0]
            .mainLocalDirectory!!;

        var currentDateCreation: string = UtilService.formatDate(new Date());
        var fileName: string = "";

        switch (message.type) {
          case "image":
            UtilService.log("Se detecto una imagen, guardando");
            fileName = currentDateCreation + "_file.jpg";
            break;

          case "video":
            UtilService.log("Se detecto un video, guardando");
            fileName = currentDateCreation + "_file.mp4";
            break;
          /*
          case "document":
            fileName +=
              currentDateCreation +
              this._fileService.determinateExtension(
                meMedia.filename === undefined ? "" : meMedia.filename!!
              );
            break;

            */
          case "ptt":
            fileName = currentDateCreation + ".ogg";
            break;

          case "audio":
            fileName = currentDateCreation + ".mp3";
            break;
        }

        if (meMedia.filename == undefined) {
          fileName = meMedia.filename!!;
        }

        UtilService.log("fffff -> Nombre del archivo a guardar: " + fileName);

        fullPath = path.join(fullPath, fileName);

        const isSaved: Boolean = this._fileService.writeBase64IntoFile(
          fullPath,
          meMedia.data
        );

        if (isSaved) {
          this.objWspService
            .saveMediaMessage(message, fullPath, this._fileService)
            .then((r) => {
              UtilService.log(`Respuesta del saveMediaMessage: ${r}`);
              UtilService.log("Guardando mensaje");
              this.objWspService.saveWhatsappMessage(message, r);
            });
        }
      });
    } else {
      this.objWspService.saveWhatsappMessage(message, undefined);
    }
  }

  /**
   *
   * @param mime
   * @returns
   */
  private getExtensionFromMimeType(mime: string): string {
    return mime.split("/")[1];
  }

  /**
   *
   * @param mess
   */
  private showMediaDetails(mess: MessageMedia): void {
    UtilService.log(
      "*******************************************************************"
    );
    const nName = mess.filename ?? {};
    UtilService.log("Detalles del archivo: ");
    UtilService.log("Nombre del archivo: " + nName ?? "Sin nombre");
    UtilService.log("Peso del archivo: " + mess.filesize);
    UtilService.log("MimeType: " + mess.mimetype);

    UtilService.log(
      "*******************************************************************"
    );
  }

  /**
   * Encargado de imprimir los detalles del mensaje
   * @param messa objeto mensaje
   */
  private showMessageDetails(messa: Message): void {
    UtilService.log(
      "*******************************************************************"
    );
    //UtilService.log("Alias: " + messa.getChat().then(c => { return c.name}));
    UtilService.log("Author: " + messa.author);
    UtilService.log(
      "Mensaje de: " + UtilService.cleanWhatsappPhone(messa.from)
    );
    UtilService.log(
      "Mensaje para: " + UtilService.cleanWhatsappPhone(messa.to)
    );
    UtilService.log("Tipo de mensaje: " + messa.type);
    UtilService.log("Mensaje: " + messa.body);
    UtilService.log(
      "*******************************************************************"
    );
  }
}
