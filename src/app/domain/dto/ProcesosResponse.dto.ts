import { BaseResponse } from "./BaseResponse,dto"
import { DetalleSolicitud, Entidad, IpModel, IpModel2, OperacionCombo } from "./ProcesosRequest.dto"

interface EstadoSolicitud{
    idEstadoSolicitud: number,
    nombre: string,
    descripcion: string,
    paraEvaluacion: string,
    activo: string
}

interface SolicitudListar{
    idSolicitud: number,
    idEntidad: number,
    nombreEntidad:string,
    idOperacion: number,
    nombreOperacion: string,
    documentoSolicitante: string,
    solicitante: string,
    justificacion: string,
    fechaSolicito: string,
    fechaAprobo: string,
    estadoSolicito: string,
    cuotaSolicito: number,
    estadoSolicitud: string,
    tipoSolicitud: string
}
interface PaginacionList{
    totalRecords: number |null,
    pageSize:number | null,
    currentPage: number |null,
    firstPage: number |null,
    lastPage: number |null
}
interface SolicitudData extends PaginacionList{
    list: SolicitudListar[]
}
interface PermisoListar{
    idEntidad: number,
    rucEntidad: string,
    nombreEntidad: string,
    activoEntidad: string,
    idOperacion: number,
    operacion: string,
    endpoint: string
    cuotaDefecto: number,
    activoOpercion: string,
    cuotaAsignada: number,
    activo: string,
    fechaRegistro: string
}
interface PermisosData extends PaginacionList{
    list: PermisoListar[]
}
export interface BuscarDetalleSolicitudResponse extends BaseResponse{
    data: DetalleSolicitud
}

export interface EntidadesSugerenciasResponse extends BaseResponse{
    data: Entidad[]
}

export interface OperacionesComboResponse extends BaseResponse{
    data: OperacionCombo[]
}

export interface EstadosSolicitudResponse extends BaseResponse{
    data: EstadoSolicitud[]
}

export interface BuscarSolicitudesResponse extends BaseResponse{
    data: SolicitudData
}

export interface BuscarPermisosResponse extends BaseResponse{
    data: PermisosData
}

export interface ListarIpsResponse extends BaseResponse{
    data: IpModel2[]
}

export interface ConsumoData{
    etiquetaMes: string,
    consumoCuota: number[],
    consumoDia: number[],
    cuotaAsignada: number[],
    diasConsumidos: number
}

export interface cuotaConsumoResponse extends BaseResponse{
    data: ConsumoData
}

interface TipoSolicitud{
    idTipoSolicitud: number,
    nombre: string,
    descripcion: string,
    activo: string,
    requiereAcceso: string,
    impacto: string
}
export interface ListarTipoSolicitudResponse extends BaseResponse{
    data: TipoSolicitud[]
}

interface ConsultaRuc{
    nroRuc: string,
    razonSocial: string,
    respuestaSunat: string
}

export interface ConsultaRucResponse extends BaseResponse{
    data: ConsultaRuc
}

interface ValidarDocumentoIdentidad{
    nroDocumento: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    nombres: string,
    respuestaReniec: string
}

export interface ValidarDocIdentidadResponse extends BaseResponse{
    data: ValidarDocumentoIdentidad
}

export interface ListarIpsEntidadResponse extends BaseResponse{
    data: IpModel[]
}

interface UsuarioListar {
    idUsuario: number,
    codigoRol: string | null,
    fechaCambioClave: string,
    fechaRegistro: string,
    nombrePerfil: string,
    descripcionPerfil: string,
    token: string|null,
    usuario: string,
    activo: string,
    apellidosNombres: string,
    idPerfil: number,
    clave: string
}

interface BuscarUsuarioData extends PaginacionList{
    list:UsuarioListar[]
}

export interface BuscarUsuariosResponse extends BaseResponse{
    data: BuscarUsuarioData
}

interface PerfilCombo{
    idPerfil: number,
    nombrePerfil: string,
    descripcionPerfil: string,
    activo: string
}

export interface ListarComboPerfiles extends BaseResponse{
    data: PerfilCombo[]
}