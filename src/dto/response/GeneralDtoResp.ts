
/**
 * Corresponde a la interface de respuesta del servidor
 */
export default interface GeneralDtoResp{
    success: boolean,
    message: string,
    errors: object,
    data: object
}