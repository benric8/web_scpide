import {ActionReducerMap} from "@ngrx/store";

//----------- general - shared --------
import * as reducersMantenimientos from './reducers';
import * as statesUsuarioWeb from './states/usuarios-web.states';

export interface AppMantenimientosState {
    cargarDetalleUsuarioWeb: statesUsuarioWeb.cargarDetalleUsuarioWeb,
}

export const appMantenimientosReducers: ActionReducerMap<AppMantenimientosState> = {
    cargarDetalleUsuarioWeb:reducersMantenimientos.cargarDetalleUsuarioWeb,
}
