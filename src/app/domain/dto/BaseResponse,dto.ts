export interface BaseResponse{
    codigo: string,
    descripcion: string,
    codigoOperacion: string
}
export interface GenericResponse extends BaseResponse{
    data: any,
}