import { BaseResponse } from "./BaseResponse,dto"

export interface UsuarioWebModel{
    idUsuarioWeb: number,
    ubigeo: string,
    tipoDocumento: string,
    nombres: string,
    primerApellido: string,
    segundoApellido: string,
    fechaNacimiento: string,
    documentoIdentidad: string,
    sexo: string,
    direccion: string,
    telefono: string,
    operador: string,
    email: string,
    institucion: number,
    usuario: string,
    clave: string,
    perfiles: string,
    resetearClave:string
}

export interface UsuarioWebBuscarResponse extends BaseResponse{
    data: UsuarioWebModel[]
}

export interface UsuarioWebcrearResponse extends BaseResponse{
    data:any
}