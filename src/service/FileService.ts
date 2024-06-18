import * as fs from "fs";
import  { SHA1 } from "crypto-js";
import { UtilService } from "./Util";

export class FileService {
  public writeBase64IntoFile(filePath: string, base64: string): void {
    try {
      const binaryData = Buffer.from(base64, "base64");
      // Write binary data to file
      fs.writeFileSync(filePath, binaryData);

      UtilService.log("Fichero creado con exito");
      UtilService.log("Ruta: " + filePath);
    } catch (error) {
      UtilService.log(
        "Ocurrio un error al convertir de Base64 a archivo: " + error
      );
    }
  }

  /**
   *
   * @param mimeType
   * @returns
   */
  public determinateExtension(mimeType: string): string {
    //TODO por desarrollar
    return "";
  }

  /**
   * Encargado de hashear el contenido
   * @param base64 contenido del archivo
   * @returns  hash con Sha1
   */
  public hashFile(base64: string): string {
    return SHA1(base64).toString();
  }
}
