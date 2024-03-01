import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppMantenimientosState } from "./mantenimientos.reducers";

export const getLayout = createFeatureSelector<AppMantenimientosState>(
    'MantenimientosModule'
);

export const getDetalleUsuariosWeb = createSelector(getLayout, (state: AppMantenimientosState) => {
    if(state.cargarDetalleUsuarioWeb) {
        return  state.cargarDetalleUsuarioWeb.detalle;     
    } 
    else {
        return null;
    }
});
