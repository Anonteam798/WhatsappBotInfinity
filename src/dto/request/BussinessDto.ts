import { List } from "whatsapp-web.js";
import ConfigurationDto from "./ConfigurationDto";

export default interface BussinessDto {
  name: string | undefined;
  phone: string | undefined;
  direcction: string | undefined;
  ruc: string | undefined;
  razonSocial: string | undefined;
  email: string | undefined;
  facebookUrl: string | undefined;
  instagramUrl: string | undefined;
  tiktokUrl: string | undefined;
  twiterUrl: string | undefined;
  whatsappContactMe: string | undefined;
  logoBase64: string | undefined;
  logoName: string | undefined;
  configurationCollection:ConfigurationDto[] | undefined;
  
}
