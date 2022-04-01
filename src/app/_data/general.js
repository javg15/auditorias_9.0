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