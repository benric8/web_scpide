import { createAction, props } from "@ngrx/store";
import { UsuarioWebModel } from "src/app/domain/dto/UsuarioWebResponse.dto";

/* ************* Acciones para cargar detalle usuario web ************** */
export const cargarDetalleUsuarioWeb = createAction(
    '[LayoutComponent] CARGAR DETALLE USUARIO WEB',
    props<{ detalle: UsuarioWebModel }>()
);

