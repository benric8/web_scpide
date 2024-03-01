import {ActionReducerMap} from "@ngrx/store";

//----------- reducers ----------
import * as reducersGeneral from './general/reducers';
//------------ states -----------
import * as statesGeneral from './general/states/general.states';
import * as statesLayout from './general/states/layout.states'

export interface AppCpState {
    //--- general
    mostrartituloNavBar: statesGeneral.mostrartituloNavBar,
    mostrarCargando: statesGeneral.mostrarCargando,
    recuperarUsuario: statesGeneral.recuperarUsuario,
    //--- layout
    seleccionarOpcioMenu: statesLayout.seleccionarOpcionMenu,
    seleccionarOpcionMenuIndice: statesLayout.seleccionarOpcionMenuIndice
}

export const appCpReducers: ActionReducerMap<AppCpState> = {
    //--- general
    mostrartituloNavBar: reducersGeneral.mostrarTituloNavBar,
    mostrarCargando: reducersGeneral.mostrarCargando,
    recuperarUsuario: reducersGeneral.recuperarUsuario,
    //--- layout
    seleccionarOpcioMenu: reducersGeneral.seleccionarOpcionMenu,
    seleccionarOpcionMenuIndice: reducersGeneral.seleccionarOpcionMenuIndice
}