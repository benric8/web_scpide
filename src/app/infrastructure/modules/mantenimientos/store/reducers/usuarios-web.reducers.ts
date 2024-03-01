import { createReducer, on } from "@ngrx/store";
import * as acciones from '../actions';
import * as estados from '../states';

const _cargarDetalleUsuarioWeb = createReducer(estados.cargarDetalleUsuarioWebInit,
    on(acciones.cargarDetalleUsuarioWeb, (state, { detalle }) => ({
        ...state,
        detalle: detalle
    }))
);

export function cargarDetalleUsuarioWeb(state:any, action:any) {
    return _cargarDetalleUsuarioWeb(state, action);
}
