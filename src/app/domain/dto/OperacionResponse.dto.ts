import { OperacionModel } from "../models/Operacion.model"
import { BaseResponse } from "./BaseResponse,dto"

export interface OperacionesListarResponse extends BaseResponse{
    data: OperacionModel[]
}
