import { createReducer, on } from "@ngrx/store";
import * as acciones from '../actions';
import * as estados from '../states';


const _mostrarTituloNavBar = createReducer(estados.mostrartituloNavBarInit,
    on(acciones.mostrarTituloNavBar, (state, { titulo }) => ({
        ...state,
        titulo: titulo
    }))
);

export function mostrarTituloNavBar(state:any, action:any) {
    return _mostrarTituloNavBar(state, action);
}

/**
  * Manejador de acciones para recuperar token con autenticación
  */
const _mostrarCargando = createReducer(estados.mostrarCargandoInit,
    on(acciones.mostrarCargando, (state, { estado }) => ({
        ...state,
        estado: estado
    }))
);

export function mostrarCargando(state:any, action:any) {
    return _mostrarCargando(state, action);
}

/**
 * Manejador de acciones paa recuperar datos de usuario del sistema
 */

const _recuperarUsuario = createReducer(estados.recuperarUsuarioInit,
    on(acciones.recuperarUsuario,(state, {usuario}) => ({
        ...state,
        usuario:usuario
    }))
)

export function recuperarUsuario(state:any, action:any){
    return _recuperarUsuario(state, action);
}