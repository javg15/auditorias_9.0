/** 
 * ==============================================================
 * Obtener el estatus previo requerido según la acción a realizar  
 * ==============================================================
 */
export function GetStatusRequerido($accion) {

    $accion = $accion.toUpperCase();
    $status_requerido = Array();
    if ($accion == "ELIMINAR") {
        $status_requerido.push("A");
        $status_requerido.push("P");
    } else if ($accion == "CANCELAR") { $status_requerido.push("A"); } else if ($accion == "DETENER") $status_requerido.push("B");
    else if ($accion == "ACTIVAR") {
        $status_requerido.push("V");
        $status_requerido.push("C");
        $status_requerido.push("D");
    } else if ($accion == "DESACTIVAR") {
        $status_requerido.push("A");
    } else if ($accion == "CONFIRMAR") {
        $status_requerido.push("A");
        $status_requerido.push("K");
    } else if ($accion == "TERMINAR") {
        $status_requerido.push("A");
        $status_requerido.push("K");
    } else if ($accion == "ENVIAR") {
        $status_requerido.push("A");
    } else if ($accion == "AUTORIZAR") {
        $status_requerido.push("A");
    } else if ($accion == "EDITAR") {
        $status_requerido.push("A");
    } else if ($accion == "PRODUCIR") {
        $status_requerido.push("A");
    } else if ($accion == "TIMBRAR") {
        $status_requerido.push("A");
    } else if ($accion == "NUEVO") {
        $status_requerido.push("P");
        $status_requerido.push("X");
    } else $status_requerido.push("X");

    return $status_requerido;
}

/** 
 * ==============================================================
 * Obtener el estatus segun accion  
 * ==============================================================
 */
export function GetStatusSegunAccion($accion) {
    $accion = $accion.toUpperCase();

    if ($accion == "ELIMINAR") return "E";
    else if ($accion == "CANCELAR") return "C";
    else if ($accion == "DETENER") return "V";
    else if ($accion == "ACTIVAR") {
        return "A";
    } else if ($accion == "DESACTIVAR") {
        return "D";
    } else if ($accion == "CONFIRMAR") {
        return "K";
    } else if ($accion == "TERMINAR") {
        return "B";
    } else if ($accion == "ENVIAR") {
        return "B";
    } else if ($accion == "AUTORIZAR") {
        return "B";
    } else if ($accion == "EDITAR") {
        return "A";
    } else if ($accion == "PRODUCIR") {
        return "K";
    } else if ($accion == "TIMBRAR") {
        return "B";
    } else if ($accion == "AGREGAR") {
        return "A";
    } else if ($accion == "NUEVO") {
        return "A";
    } else if ($accion == "PRELIMINAR") {
        return "P";
    } else if ($accion == "ACTUALIZAR") {
        return "A";
    } else return "X";
}

export function getParams(_params, _param) {
    let _resultado = "",
        _ini = 0,
        _largo = 0;

    _params = _params.replace('"', "");

    _ini = _params.indexOf("&" + _param + "=");
    if (_ini >= 0) {
        _largo = _params.substring(_ini + 1).indexOf("&");
        if (_largo <= 0) _largo = 1000;

        //RETURN concat_ws(';',_params,_ini+1,_largo);

        _resultado = _params.substring(_ini, _ini + _largo + 1).split("=")[1];
        // _resultado=SUBSTRING_INDEX(SUBSTRING(_params,_ini+1,_largo-_ini-1),'=',-1);

        if ((_resultado !== null && _resultado !== undefined ? _resultado : "") == "") _resultado = null;
    } else {
        _resultado = null;
    }
    return _resultado;
};