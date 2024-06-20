import ContactDtoReq from "./ContactDtoReq";

export default interface WspDtoReq{
    message:string;
    isMediaMessage:boolean;
    uuidMediaMessage:string;
    idWhatsAppFile:number;
    idContactFrom:ContactDtoReq;
    idContactTo:ContactDtoReq;
    groupId:string;
    idTypeMessage:string;

}