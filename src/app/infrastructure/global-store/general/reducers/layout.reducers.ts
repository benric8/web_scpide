import { createReducer, on } from "@ngrx/store";
import * as acciones from '../actions';
import * as estados from '../states';

const _seleccionarOpcionMenu = createReducer(estados.seleccionarOpcionMenuInit,
    on(acciones.seleccionarOpcionMenu, (state, { url }) => ({
        ...state,
        url: url
    }))
);

export function seleccionarOpcionMenu(state:any, action:any) {
    return _seleccionarOpcionMenu(state, action);
}

const _seleccionarOpcionMenuIndice = createReducer(estados.seleccionarOpcionMenuIndiceInit,
    on(acciones.seleccionarOpcionMenuIndice, (state, { indice }) => ({
        ...state,
        indice: indice
    }))
);

export function seleccionarOpcionMenuIndice(state:any, action:any) {
    
    return _seleccionarOpcionMenuIndice(state, action);
}
