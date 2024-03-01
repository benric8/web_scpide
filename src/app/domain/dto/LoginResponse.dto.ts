import { BaseResponse } from "./BaseResponse,dto"

export interface Usuario{

    idUsuario:number,
    idPerfil:number,
    nombrePerfil:string
    descripcionPerfil:string
    usuario: string,
    clave: string,
    token: string,
    apellidosNombres:string,
    fechaRegistro:string,
    fechaCambioClave:string
    activo:String

}

export interface LoginResponse extends BaseResponse{
  data: Usuario
}