import { Usuario } from "src/app/domain/dto/LoginResponse.dto"

export interface mostrartituloNavBar {
    titulo: string
}
export interface mostrarCargando {
    estado: boolean
}
export interface recuperarUsuario{
    usuario: Usuario|null
}