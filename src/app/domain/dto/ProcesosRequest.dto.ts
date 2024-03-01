export interface FiltroBusquedaPermisos {
    idEntidad: number | null,
	idOperacion: number | null,
	fechaDesde: Date,
	fechaHasta: Date,
	estado: string | null
}

export interface FiltroBusquedaSolicitud {
	idSolicitud: number | null,
    idEntidad: number | null,
	idOperacion: number | null,
	idEstadoSolicitud: number | null,
	fechaDesde: Date,
	fechaHasta: Date
} 

export interface RegistroSolicitud {
	idEntidad: number,
	idOperacion: number,
	usuarioRegistro: string,
	justificacion: string,
	nroDocumentoSolicitante: string,
	nombreSolicitante: string,
	idTiposSolicitud: number,
	cuotaCambio: number,
	estadoCambio: string,
	listaIps: IpModel[]
}

export interface Entidad{
	idEntidad:number,
	ruc: string,
	razonSocial: string,
	activo: string
}

export interface OperacionCombo {
	idOperacion: number,
	nombre:string,
	descripcion: string,
	endPoint:string,
	cuotaDefecto: string,
	activo:string
}

export interface EvaluarSolicitud {
	idSolicitud: number | null,
	usuarioAprobo:string,
	idEstadoSolicitud: number | null
}

export interface RegistroEntidad {
	nroRuc: string,
	razonSocial:string,
	activo: string
}

export interface DetalleSolicitud {
	idSolicitud: number | null,
	nombreTipoSolicitud: string,
	idEstadoSolicitud: number,
	idTipoSolicitud:number,
	usuarioRegistro: string,
	solicitante:string,
	usuarioEvaluo:string,
	justificacion:string,
	estadoCambio: string,
	cuotaCambio:number | null,
	estadoActual: string,
	cuotaActual:number | null,
	fechaRegistro: string,
	fechaEvaluacion:string,
	listaIpSolicitud: IpModel2[] | null
}

export interface IpModel{
	idIpAcceso: number,
	idTemp: string,
	ipPublica: string,
	activo: string,
	descActivo: string,
	flagCambio: number
}

export interface IpModel2{
	idEntidad:number,
	idIpAcceso: number,
	ipPublica: string,
	activo: string
}

export interface ValidarDocumento{
	nroDocumento: string		
}

export interface ValidarRuc{
	ruc: string		
}

