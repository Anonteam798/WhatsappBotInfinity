import * as fs from "fs";
import { SHA1, SHA256 } from "crypto-js";
import { UtilService } from "../util/Util";
import * as crypto from "crypto";
import FileObject from "../model/FileObject";
import * as path from "path";

export class FileService {
  private objHash = crypto.createHash("sha256");

  public writeBase64IntoFile(filePath: string, base64: string): boolean {
    try {
      const binaryData = Buffer.from(base64, "base64");
      // Write binary data to file
      fs.writeFileSync(filePath, binaryData);

      UtilService.log("Fichero creado con exito");
      UtilService.log("Ruta: " + filePath);
      return true;
    } catch (error) {
      UtilService.log(
        "Ocurrio un error al convertir de Base64 a archivo: " + error
      );
    }
    return false;
  }

  /**
   * Encargado de traer la informacion de un archivo en promesa
   * @param fileFullPath  Ruta completa del archivo a retornar
   * @returns Objeto fileInformation
   */
  public async getFileInformation(
    fileFullPath: string
  ): Promise<FileObject | undefined> {
    try {
      const exists: Boolean = fs.existsSync(fileFullPath);
      if (!exists) {
        UtilService.log(`El archivo no existe, retornando vacio`);
        return undefined;
      }

      const stat = await fs.promises.stat(fileFullPath);
      const ext = path.extname(fileFullPath);
      const fileName = path.basename(fileFullPath);

      const fileObj: FileObject = {
        fileName: fileName,
        fileFullPath: fileFullPath,
        fileSizeBytes: stat.size,
        extension: ext,
        createdDate: UtilService.formatDate(new Date(stat.ctimeMs)),
        modifiedDate: UtilService.formatDate(new Date(stat.mtime)),
      };

      return fileObj;
    } catch (error) {
      UtilService.log(
        "Ocurrio un error al obtener la informacion del archivo."
      );
    }
  }
  /**
   *
   * @param fileName
   * @returns
   */
  public determinateExtension(fileName: string): string {
    if (fileName === "") {
      return "";
    }
    //TODO por desarrollar
    const ext = path.extname(fileName);
    return ext;
  }

  /**
   * Encargado de hashear el contenido
   * @param base64 contenido del archivo
   * @returns  hash con Sha1
   */
  public hashFile(base64: string): string {
    return SHA1(base64).toString();
  }

  /**
   * Encargado de hashear el archivo usando un flujo stream y retornando en promesa
   * @param fileFullPath  Ruta del archivo a hashear
   * @returns
   */
  public hashFileSha256(fileFullPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      UtilService.log("Operacion hash 256 iniciada");
      UtilService.log(`Verificando ruta: ${fileFullPath}`);

      const hash = crypto.createHash("sha256");

      const exists: Boolean = fs.existsSync(fileFullPath);
      if (!exists) {
        UtilService.log(`El archivo no existe, retornando vacio`);
        resolve("");
        return;
      }

      const stream = fs.createReadStream(fileFullPath);
      stream.on("data", (data) => {
        hash.update(data);
      });

      stream.on("end", () => {
        const hashed = hash.digest("hex");
        resolve(hashed);
      });

      stream.on("error", (error) => {
        reject(error);
      });
    });
  }
}

/*
new FileService()
  .hashFileSha256(
    "C:\\Users\\LuisQM\\Desktop\\bots\\ConfigPruebas\\23062024_154628_file.jpg"
  )
  .then((r) => {
    console.log("res -> " + r);
  });
*/
