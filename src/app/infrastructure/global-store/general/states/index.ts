import * as states from './general.states';
import * as statesLayout from './layout.states';

export const mostrartituloNavBarInit: states.mostrartituloNavBar = {
    titulo: ""
};
export const mostrarCargandoInit: states.mostrarCargando = {
    estado: false
};
export const recuperarUsuarioInit: states.recuperarUsuario = {
    usuario: null
}

export const seleccionarOpcionMenuInit: statesLayout.seleccionarOpcionMenu= {
    url:""
}
export const seleccionarOpcionMenuIndiceInit: statesLayout.seleccionarOpcionMenuIndice = {
    indice:-1
}