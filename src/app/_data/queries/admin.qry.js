const gral = require('../general.js')

exports.getAdmin = (__Q, _parametros, connection) => {

    let _modo = gral.getParams(_parametros, 'modo') !== null && gral.getParams(_parametros, 'modo') !== undefined ? gral.getParams(_parametros, 'modo') : 0,
        _id = gral.getParams(_parametros, 'id') !== null && gral.getParams(_parametros, 'id') !== undefined ? gral.getParams(_parametros, 'id') : 0,
        _fkey = gral.getParams(_parametros, 'fkey') !== null && gral.getParams(_parametros, 'fkey') !== undefined ? gral.getParams(_parametros, 'fkey') : 0,
        _fkeyvalue = gral.getParams(_parametros, 'fkeyvalue') !== null && gral.getParams(_parametros, 'fkeyvalue') !== undefined ? gral.getParams(_parametros, 'fkeyvalue') : 0,
        _codigo = gral.getParams(_parametros, 'codigo') !== null && gral.getParams(_parametros, 'codigo') !== undefined ? gral.getParams(_parametros, 'codigo') : '',
        _state = gral.getParams(_parametros, 'state') !== null && gral.getParams(_parametros, 'state') !== undefined ? gral.getParams(_parametros, 'state') : 'A',
        _scampos = gral.getParams(_parametros, 'scampo') !== null && gral.getParams(_parametros, 'scampo') !== undefined ? gral.getParams(_parametros, 'scampo') : '',
        _soperadores = gral.getParams(_parametros, 'soperador') !== null && gral.getParams(_parametros, 'soperador') !== undefined ? gral.getParams(_parametros, 'soperador') : '',
        _sdatos = gral.getParams(_parametros, 'sdato') !== null && gral.getParams(_parametros, 'sdato') !== undefined ? gral.getParams(_parametros, 'sdato') : '',
        _fecini = gral.getParams(_parametros, 'fecini') !== null && gral.getParams(_parametros, 'fecini') !== undefined ? gral.getParams(_parametros, 'fecini') : '',
        _fecfin = gral.getParams(_parametros, 'fecfin') !== null && gral.getParams(_parametros, 'fecfin') !== undefined ? gral.getParams(_parametros, 'fecfin') : '',
        _ordencampo = gral.getParams(_parametros, 'ordencampo') !== null && gral.getParams(_parametros, 'ordencampo') !== undefined ? gral.getParams(_parametros, 'ordencampo') : '',
        _ordensentido = gral.getParams(_parametros, 'ordensentido') !== null && gral.getParams(_parametros, 'ordensentido') !== undefined ? gral.getParams(_parametros, 'ordensentido') : '',
        _inicio = gral.getParams(_parametros, 'inicio') !== null && gral.getParams(_parametros, 'inicio') !== undefined ? gral.getParams(_parametros, 'inicio') : '0',
        _largo = gral.getParams(_parametros, 'largo') !== null && gral.getParams(_parametros, 'largo') !== undefined ? gral.getParams(_parametros, 'largo') : '1',
        _id_usuario = gral.getParams(_parametros, 'id_usuario') !== null && gral.getParams(_parametros, 'id_usuario') !== undefined ? gral.getParams(_parametros, 'id_usuario') : 0,
        _id_permgrupos = gral.getParams(_parametros, 'id_permgrupos') !== null && gral.getParams(_parametros, 'id_permgrupos') !== undefined ? gral.getParams(_parametros, 'id_permgrupos') : 0,
        _id_maquina = gral.getParams(_parametros, 'id_maquina') !== null && gral.getParams(_parametros, 'id_maquina') !== undefined ? gral.getParams(_parametros, 'id_maquina') : 0,
        _id_departamento = gral.getParams(_parametros, 'id_departamento') !== null && gral.getParams(_parametros, 'id_departamento') !== undefined ? gral.getParams(_parametros, 'id_departamento') : 0;

    let _headers = __Q,
        __CQ = '', // CONDITION QUERY
        __CS = '', // CONDITION SEARCH
        __CSE = '', // CONDITION SUBSTATE
        __CD = '', // CONDITION DEPARTAMENTOS  
        __soperador = '',
        __scampo = '';

    switch (_modo) {
        case -1: // BUSQUEDA POR FILTRO
            __CQ = ' WHERE TRUE ';
            break;
        case 0: // MANAGER FULL MODE
            __CQ = ' WHERE INSTR("' + _state + '",CASE a.state WHEN "" THEN "?" ELSE a.state END)>0 ';
            break;
        case 1: //  LINK ID
            __CQ = ' WHERE a.id=' + _id + ' AND INSTR("A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",CASE a.state WHEN "" THEN "?" ELSE a.state END)>0';
            break;
        case 2: //  FK ID
            __CQ = ' WHERE (a.' + _fkey + '=' + _fkeyvalue + ') AND INSTR("' + _state + '",CASE a.state WHEN "" THEN "?" ELSE a.state END)>0';
            break;
        default:
            __CQ = '';
    }

    //recorrer las cadena de busqueda
    _i = 1;
    while (_i <= 5) {
        _scampo = _scampos.split('|')[_i - 1] != '' ? _scampos.split('|')[_i - 1] : 0;
        _soperador = _soperadores.split('|')[_i - 1] != '' ? _soperadores.split('|')[_i - 1] : 0;
        _sdato = _sdatos.split('|')[_i - 1];

        if (_scampo > 0 && _sdato != '') {
            //__scampo = await connection.query(`SELECT a.campo FROM searchcampos as a WHERE a.id = ?`, _scampo);
            //__soperador = await connection.query(`SELECT a.operador FROM searchoperador as a WHERE a.id = ?`, _soperador);

            // SET _CS=CONCAT(' AND (a.',__scampo,' ',REPLACE(__soperador,'$data',_sdato),')');

            if (__soperador.indexOf('POSITION') >= 0)
                __CS = __CS + ' AND (' + __soperador.replace('$field', __scampo).replace('$data', _sdato) + ')';
            else if (__scampo.indexOf('fn_idesc') >= 0) // funciones
                __CS = __CS + ' AND (' + __scampo.replace('$value', _sdato) + ' ' + __soperador.replace('$data', _sdato) + ')';
            else if (__scampo.indexOf('fn_') >= 0) // funciones
                __CS = __CS + ' AND (' + __scampo.replace('$value', _sdato) + ')';
            else if (__scampo.indexOf('.') >= 0) // si contiene un punto, entonces es de una tabla anexa (join)
                __CS = __CS + ' AND (' + __scampo + ' ' + __soperador.replace('$data', _sdato) + ')';
            else
                __CS = __CS + ' AND (a.' + __scampo, ' ', __soperador.replace('$data', _sdato), ')';

        }

        _i = _i + 1;
    }


    // poner comillas y mayusuculas a las que traigan acentos
    //if (_ordencampo != '')  select fn_campo_primeromayuscula(_ordencampo) into _ordencampo; end if;
    _ordencampo = _ordencampo == '' ? '' : ' ORDER BY ' + _ordencampo + ' '; // Sort Field
    if (_ordensentido == '') _ordensentido = ''
    else if (_ordensentido == 'asc') _ordensentido = ''
    else _ordensentido = ' ' + _ordensentido // Sort Direction

    _largo = _largo == '' ? '' : ' LIMIT ' + _largo + ' '; // limit start
    _inicio = _largo == '' ? '' : ' OFFSET ' + _inicio; // limit length

    // cabeceras
    __res = selectCabeceras(_headers);
    __cabeceras = __res.split(';')[0];
    __align_rigth = __res.split(';')[1];
    //__agregar = (_permisos.indexOf('agregar') >= 0 || _permisos.indexOf('todo') >= 0) ? 1 : 0;
    __agregar = 1;

    // RETURN QUERY EXECUTE concat('SELECT 0,'"' + '"' + 0, '"' +  '''' , '''' , ''''');

    if (_modo == 10) { //solo cabeceras
        __QC = 'SELECT *, count(*) OVER() AS total_count,' + '\'' + __cabeceras + '\'' + ' AS cabeceras,' + '"' + __align_rigth + '"' + ' AS align_rigth,' + '"' + _state + '"' + ' AS stateparametro,' + '"' + __agregar + '"' + ' AS agregar ' + ' FROM (' + __Q + __CQ + __CS + __CSE + __CD + ') AS A' + _ordencampo + _ordensentido + _largo + _inicio;
    } else {
        __QC = __Q.split('FROM ')[0] + ', count(*) OVER() AS total_count,' + '\'' + __cabeceras + '\'' + ' AS cabeceras,' + '"' + __align_rigth + '"' + ' AS align_rigth,' + '"' + _state + '"' + ' AS stateparametro,' + '"' + __agregar + '"' + ' AS agregar ' + ' FROM ' + __Q.split('FROM ')[1] + __CQ + __CS + __CSE + __CD + _ordencampo + _ordensentido + _largo + _inicio;
    }

    return __QC;
}

function selectCabeceras(_texto) {
    let _resultado = '',
        __q = '',
        __align_right = '',
        __hidden = '',
        __i = 0,
        __campo = '',
        __campofuente = '',
        __pos = 0,
        __campoaliascompleto = '',
        __render = '',
        __estilo = '',
        __titulo = '';

    _texto = _texto.replace('SELECT', '');
    //__q=TRIM(REPLACE(REPLACE(_texto,chr(9),''),chr(10),''));
    __q = _texto.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚ]/, '').replace(String.fromCharCode(9), '').replace(String.fromCharCode(10), '').trim();

    __align_right = '';
    __hidden = '';
    __i = 1;
    __q = __q.split(' FROM ')[0]; //obtiene la parte izquierda del sql FROM
    __campo = 'x';
    __campofuente = '';

    while (__campo != '' && __pos >= 0) {
        __pos = __q.indexOf(' AS '); //encuentra el campo

        __campo = __q.substring(__pos, __q.length).split(' AS ')[1].split(',')[0]; //obtiene la parte derecha de AS
        __campoaliascompleto = __campo;
        __campofuente = __q.substring(0, __pos).replace('.', '_').replace(',', ''); //obtiene la parte izquierda de AS


        //si tiene parentesis, entonces, es una función
        if (__campofuente.indexOf('(') >= 0 || __campofuente.indexOf(')') >= 0) {
            if (__campo.indexOf('|') >= 0) {
                __campofuente = __campo.split('|')[1].replace('.', '_'); //obtener el superalias
                __campo = __campo.split('|')[0]; //quitar del texto el superalias
            } else
                __campofuente = __campo;
        }
        if (__campo != '') {
            __render = '';
            if (__campo.indexOf('<') >= 0) { //si es que tiene estilos
                __estilo = __campo.split('<')[1];
                __estilo = __estilo.substring(0, __estilo.indexOf('>') - 1);
                __campo = __campo.split('<')[0];
                if (__estilo.trim() == 'moneda') {
                    __render = ',"render":"moneda"';
                    __align_right = __align_right + ',' + __i;
                } else if (__estilo.trim() == 'hidden')
                    __hidden = __hidden + ',' + __i;
                else
                    __render = ',"render":"' + __estilo + '"';

            }
            __titulo = __campo.trim().substring(0, __campo.indexOf('|') >= 0 ? __campo.indexOf('|') - 1 : 1000);
            _resultado = _resultado + ',{"data":"' + __titulo.replace(/[^a-zA-Z0-9_áéíóúÁÉÍÓÚ]/, '').trim().toLowerCase().replace('"', '') + '","name":"' +
                __campofuente.replace('"', '').replace( // quitar apostrofes
                    /[^a-zA-Z0-9_áéíóúÁÉÍÓÚ]/, '').trim() +
                '","title":"' + __titulo.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚ_]/, '').replace('_', ' ').replace('"', '').trim() +
                '"' + __render.trim() + '}'; //concatena

            // +4= AS ;__campoaliascompleto = campo recien extraido
            __pos = __pos + 4 + __campoaliascompleto.length; //avanza la posicion despues del campo obtenido

            __q = __q.substring(__pos, 1000); //substrae la cadena segun la posicion avanzada
            __i = __i + 1;

            __pos = __q.indexOf(' AS '); //para evaluar la condición de while
        }


    }; //hasta que ya no encuentra un AS

    return '[' + _resultado.substring(1, _resultado.length) + ']' + ';' +
        __align_right.substring(1, 1000) + ';' +
        __hidden.substring(1, 1000);
}