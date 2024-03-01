import { createAction, props } from "@ngrx/store";
import { Usuario } from "src/app/domain/dto/LoginResponse.dto";
/* Accion para hacer login con datos de usuario para panel de administración */
export const mostrarCargando = createAction(
    '[ComunComponent] MOSTRAR CARGANDO',
    props<{ estado: boolean }>()
);

/* ************ Acciones para titulo de barra de navegacion ************* */
export const mostrarTituloNavBar= createAction(
    '[LayoutComponentv] MOSTRAR TITULO NAVBAR',
    props<{ titulo: string }>()
);

/* ************* Acciones paradatos de usuario ************ */
export const recuperarUsuario = createAction(
    '[LayoutComponent] RECUPERAR USUARIO DEL SISTEMA',
    props<{ usuario: Usuario }>()
);
