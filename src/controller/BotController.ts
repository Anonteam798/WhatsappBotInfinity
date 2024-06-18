import {
  Client,
  LocalAuth,
  Message,
  MessageMedia,
  MessageTypes,
} from "whatsapp-web.js";
import { UtilService } from "../service/Util";
import { FileService } from "../service/FileService";
import * as dotenv from "dotenv";

export class BotController {
  private _client: Client;
  private _qrcode = require("qrcode-terminal");
  private _fileService: FileService;

  constructor() {
    this._client = new Client({
      authStrategy: new LocalAuth(),
      webVersionCache: {
        type: "remote",
        remotePath:
          "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.0.html",
      },
    });

    this._fileService = new FileService();
    dotenv.config();
  }

  initListener(): void {
    this._client.on("qr", (qr) => {
      // Generate and scan this code with your phone
      this._qrcode.generate(qr, { small: true });
    });

    this._client.on("ready", () => {
      UtilService.log("Cliente se ha inicializado");
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
    if (message.hasMedia) {
      var fullPath: string = process.env.DIRECTORY_PATH!;
      //console.log(MessageTypes.IMAGE)
      switch (message.type) {
        case "image":
          UtilService.log("Se detecto una imagen, guardando");
          fullPath += UtilService.formatDate(new Date()) + "_file.jpg";
          break;

        case "video":
          UtilService.log("Se detecto un video, guardando");
          fullPath += UtilService.formatDate(new Date()) + "_file.mp4";
          break;

        case "document":
          fullPath += UtilService.formatDate(new Date()) + ".docx";
          break;

        case "ptt":
          fullPath += UtilService.formatDate(new Date()) + ".ogg";
          break;
      }

      message.downloadMedia().then((meMedia) => {
        this.showMediaDetails(meMedia);
        this._fileService.writeBase64IntoFile(fullPath, meMedia.data);
      });
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
    UtilService.log("Detalles del archivo: ");
    UtilService.log("Nombre del archivo: " + mess.filename);
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
