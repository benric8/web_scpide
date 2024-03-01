import { createAction, props } from "@ngrx/store";

/* ************* Acciones para lista de opciones de menu ************** */
export const seleccionarOpcionMenu = createAction(
    '[LayoutComponent] SELECCIONAR OPCIONES DE MENU',
    props<{ url: string }>()
);

/* ************* Acciones para el indice de la lista de opciones del menu ************ */
export const seleccionarOpcionMenuIndice = createAction(
    '[LayoutComponent] SELECCIONAR OPCIONEs DE MENU INDICE',
    props<{ indice: number }>()
);