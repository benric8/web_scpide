export interface OperacionModel{
    idOperacion:number | null,
    nombre:string,
    operacion:string,
    descripcion:string,
    endPoint:string,
    cuotaDefecto:number,
    requiereAprobacionAcceso:string,
    requiereAprobacionCuota:string,
    requiereAprobacionIps:string,
    requiereAprobacionEstado:string,
    activo:string
}