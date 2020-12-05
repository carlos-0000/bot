/* DEPENDENCIAS NODE */
const format = require('date-format');

/* MODULOS REQUERIDOS */
// const db = require('../../db/db');
const db = require('./db/db');
//const CambioPrecio = require('../modulosGenerales/CambioPrecio');
const CierreTurnoPDF = require('/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/botticketsoft/modulos/CierreTurnoPDF');
//const CierreTurnoExcel = require('../modulosGenerales/CierreTurnoExcel');

module.exports = class ConsecutivoTurnoCierre {

    constructor(data) {
        console.log(data);
        console.log('CLASE CONSECUTIVO CIERRE DE TURNO:');
        this.data = data;
        this.data.fechaActual = format.asString('yyyy-MM-dd', new Date());
        this.data.horaActual = format.asString('hh:mm:ss', new Date());
        this.obtenerNumeroDispensador();
       
    }

    writeScreen(txt = "") { //global.equipo.write(txt + '\n'); 
        }

    err(txt, err) { console.log("Consecutivo Cierre " + txt + " Err: " + err); }

    obtenerNumeroDispensador() {
        console.log('\tConsecutivo Cierre obtenerNumeroDispensador');
        try {
            let sql = 'SELECT valor_parametros FROM parametros WHERE nombre_parametros = ? OR nombre_parametros = ?';
            db.execute(sql, ["NUMERO SURTIDOR", "MARCA DISPENSADOR"], (err, row) => {
                if (err) console.log(err);
                if (row) if (row.length > 0) {
                    this.data.numDisp = row[1].valor_parametros;
                    this.data.marcaDispensador = row[0].valor_parametros;
                    this.productoManguera();
                } else this.writeScreen("No se obtuvo datos en obtenerNumeroDispensador");
            });
        } catch (err) { this.err("\t\tobtenerNumeroDispensador", err); }
    }

    puntoGalon(g) {
       
        let gr = 0;
        if (this.data.marcaDispensador == 'G' || this.data.marcaDispensador == 'S' || this.data.marcaDispensador == 'W')
            gr = parseFloat(parseFloat(g).toFixed(2));
        if (this.data.marcaDispensador == 'T')
            gr = parseFloat(parseFloat(g).toFixed(3));
        return gr;
    }

    calcular_desborde(Pesos_apertura, Pesos_cierre) {
        let pesos = 0;

        if (parseInt(Pesos_cierre) >= parseInt(Pesos_apertura)) {
            return parseInt(Pesos_cierre) - parseInt(Pesos_apertura);
        } else {
            if (this.data.marcaDispensador == 'G' || this.data.marcaDispensador == 'S' || this.data.marcaDispensador == 'W') {
                return parseInt(Pesos_cierre + 100000000) - parseInt(Pesos_apertura);
            }
            if (this.data.marcaDispensador == 'T') {
                return parseInt(Pesos_cierre + 1000000000) - parseInt(Pesos_apertura);
            }
        }
    }

    calcular_desborde_galones(Galones_apertura, Galones_cierre) {


        let galones = 0;

        if (parseFloat(Galones_cierre) >= parseFloat(Galones_apertura)) {

            if (this.data.marcaDispensador == 'G' || this.data.marcaDispensador == 'S' || this.data.marcaDispensador == 'W') {
                galones = parseFloat(Galones_cierre) - parseFloat(Galones_apertura);
                return parseFloat(galones).toFixed(2);
            }
            if (this.data.marcaDispensador == 'T') {
                galones = parseFloat(Galones_cierre) - parseFloat(Galones_apertura);
                return parseFloat(galones).toFixed(3);
            }

        } else {
            if (this.data.marcaDispensador == 'G' || this.data.marcaDispensador == 'S' || this.data.marcaDispensador == 'W') {
                galones = parseFloat(parseFloat(Galones_cierre) + parseFloat(1000000)) - parseFloat(Galones_apertura);
                return parseFloat(galones).toFixed(2);
            }
            if (this.data.marcaDispensador == 'T') {
                galones = parseFloat(parseFloat(Galones_cierre) + parseFloat(10000000)) - parseFloat(Galones_apertura);
                return parseFloat(galones).toFixed(3);
            }
        }
    }

    productoManguera() {
        console.log('\tConsecutivo Cierre productoManguera');
        try {
            let sql = `SELECT m.id_caras, m.posicion, p.nom_producto, p.precio_venta_producto
                        FROM mangueras AS m
                        INNER JOIN producto AS p ON p.id = m.id_producto`;
            db.execute(sql, (err, row) => {
                if (err) console.log(err);
                if (row) if (row.length > 0) {
                    this.data.producMAnguera = row;
                    this.recorrerProductoManguera();
                } else this.writeScreen("No se encontraron datos en productoManguera");
            });
        } catch (err) { this.err("\t\tproductoManguera", err); }
    }

    recorrerProductoManguera() {
        console.log("\tConsecutivo Cierre recorrerProductoManguera");
        let cant = this.data.producMAnguera.length - 1;
        this.data.producMAng = { cara1: [], cara2: [], cara3: [], cara4: [] };
        this.data.producMAnguera.forEach((element, index) => {
            if (element.id_caras == 1) {
                if (element.posicion == 1) {
                    this.data.producMAng.cara1[0] = element.nom_producto;
                    this.data.producMAng.cara1[1] = element.precio_venta_producto;
                }
                if (element.posicion == 2) {
                    this.data.producMAng.cara1[2] = element.nom_producto;
                    this.data.producMAng.cara1[3] = element.precio_venta_producto;
                }
                if (element.posicion == 3) {
                    this.data.producMAng.cara1[4] = element.nom_producto;
                    this.data.producMAng.cara1[5] = element.precio_venta_producto;
                }
                if (element.posicion == 4) {
                    this.data.producMAng.cara1[6] = element.nom_producto;
                    this.data.producMAng.cara1[7] = element.precio_venta_producto;
                }
            }
            if (element.id_caras == 2) {
                if (element.posicion == 1) {
                    this.data.producMAng.cara2[0] = element.nom_producto;
                    this.data.producMAng.cara2[1] = element.precio_venta_producto;
                }
                if (element.posicion == 2) {
                    this.data.producMAng.cara2[2] = element.nom_producto;
                    this.data.producMAng.cara2[3] = element.precio_venta_producto;
                }
                if (element.posicion == 3) {
                    this.data.producMAng.cara2[4] = element.nom_producto;
                    this.data.producMAng.cara2[5] = element.precio_venta_producto;
                }
                if (element.posicion == 4) {
                    this.data.producMAng.cara2[6] = element.nom_producto;
                    this.data.producMAng.cara2[7] = element.precio_venta_producto;
                }
            }
            if (element.id_caras == 3) {
                if (element.posicion == 1) {
                    this.data.producMAng.cara3[0] = element.nom_producto;
                    this.data.producMAng.cara3[1] = element.precio_venta_producto;
                }
                if (element.posicion == 2) {
                    this.data.producMAng.cara3[2] = element.nom_producto;
                    this.data.producMAng.cara3[3] = element.precio_venta_producto;
                }
                if (element.posicion == 3) {
                    this.data.producMAng.cara3[4] = element.nom_producto;
                    this.data.producMAng.cara3[5] = element.precio_venta_producto;
                }
                if (element.posicion == 4) {
                    this.data.producMAng.cara3[6] = element.nom_producto;
                    this.data.producMAng.cara3[7] = element.precio_venta_producto;
                }
            }
            if (element.id_caras == 4) {
                if (element.posicion == 1) {
                    this.data.producMAng.cara4[0] = element.nom_producto;
                    this.data.producMAng.cara4[1] = element.precio_venta_producto;
                }
                if (element.posicion == 2) {
                    this.data.producMAng.cara4[2] = element.nom_producto;
                    this.data.producMAng.cara4[3] = element.precio_venta_producto;
                }
                if (element.posicion == 3) {
                    this.data.producMAng.cara4[4] = element.nom_producto;
                    this.data.producMAng.cara4[5] = element.precio_venta_producto;
                }
                if (element.posicion == 4) {
                    this.data.producMAng.cara4[6] = element.nom_producto;
                    this.data.producMAng.cara4[7] = element.precio_venta_producto;
                }
            }
            if (index == cant) this.turnoCorte();
        });
    }

    turnoCorte() {
        
        console.log('\tConsecutivo Cierre escojer si es corte o arqueo');
        
        if(this.data.tipo=='arqueo'){
            
            try {

                let sql = `SELECT IFNULL(CONCAT(usuario.nom_usuario,' ', COALESCE(usuario.ape_usuario,"")),"") AS islero,
                            turno_corte_venta.cara_equipo AS cara,
                            turno_corte_venta.cara_equipo AS cara,
                            AVT.g1_venta_total AS g1a, CVT.g1_venta_total AS g1c, 
                            APT.p1_venta_total AS p1a, CPT.p1_venta_total AS p1c,
                                                            
                            AVT.g2_venta_total AS g2a, CVT.g2_venta_total AS g2c, 
                            APT.p2_venta_total AS p2a, CPT.p2_venta_total AS p2c,
                                                            
                            AVT.g3_venta_total AS g3a, CVT.g3_venta_total AS g3c,
                            APT.p3_venta_total AS p3a, CPT.p3_venta_total AS p3c,
                            
                            turno_corte.fecha_cierre, turno_corte.fecha_apertura

                            FROM turno_corte
                            INNER JOIN usuario ON usuario.id = turno_corte.id_usuario_turno_corte
                            INNER JOIN turno_corte_venta ON turno_corte_venta.id_turno_corte = turno_corte.id

                            INNER JOIN venta_total AS AVT ON AVT.id = turno_corte_venta.id_apertura_venta_total
                            INNER JOIN venta_total AS APT ON APT.id = turno_corte_venta.id_apertura_venta_total
                            JOIN venta_total AS CVT ON CVT.id =  (SELECT id FROM venta_total where turno_corte_venta.cara_equipo = cara_venta_total order by id desc limit 1)
                            JOIN venta_total AS CPT on CPT.id =  (SELECT id FROM venta_total where turno_corte_venta.cara_equipo = cara_venta_total order by id desc limit 1)
                            WHERE turno_corte.id = ?`;

            
                db.execute(sql, [this.data.turno], (err, row) => {
                    if (err) console.log(err);
                    if (row) if (row.length > 0) {
                        this.data.tipo = 'ARQUEO';
                        this.data.turnoCorte = row;
                        this.data.fechaApertura = row[0].fecha_apertura;
                        this.data.fechaCierre = row[0].fecha_cierre;
                        this.getConsignacion(this.data.turno);
                        this.getVentasPorTipo_efectivo(this.data.turno);
                        this.getVentasPorTipo_credito(this.data.turno);
                        this.getVentasPorTipo_control(this.data.turno);
                        this.getVentasPorTipo_prepago(this.data.turno);
                        this.getVentasPorTipo_datafono(this.data.turno);
                        this.getTipoImpresora();
                        this.getTipoCuentaVentas();

                    } else this.writeScreen("No se encontro cierre en turno_corte");
                });
            } catch (err) { this.err("\t\tConsecutivo Cierre escojer si arqueo", err); }

        }else{
        
            try {

                let sql = `SELECT
                                IFNULL(CONCAT(usuario.nom_usuario,' ', COALESCE(usuario.ape_usuario,"")),"") AS islero,
                                turno_corte_venta.cara_equipo AS cara,
                                turno_corte_venta.cara_equipo AS cara,
                                AVT.g1_venta_total AS g1a, CVT.g1_venta_total AS g1c, 
                                APT.p1_venta_total AS p1a, CPT.p1_venta_total AS p1c,
                                
                                AVT.g2_venta_total AS g2a, CVT.g2_venta_total AS g2c, 
                                APT.p2_venta_total AS p2a, CPT.p2_venta_total AS p2c,
                                
                                AVT.g3_venta_total AS g3a, CVT.g3_venta_total AS g3c,
                                APT.p3_venta_total AS p3a, CPT.p3_venta_total AS p3c,
                                turno_corte.fecha_cierre, turno_corte.fecha_apertura
                            FROM turno_corte
                            INNER JOIN usuario ON usuario.id = turno_corte.id_usuario_turno_corte
                            INNER JOIN turno_corte_venta ON turno_corte_venta.id_turno_corte = turno_corte.id
                            INNER JOIN venta_total AS AVT ON AVT.id = turno_corte_venta.id_apertura_venta_total
                            INNER JOIN venta_total AS CVT ON CVT.id = turno_corte_venta.id_cierre_venta_total
                            INNER JOIN venta_total AS APT ON APT.id = turno_corte_venta.id_apertura_venta_total
                            INNER JOIN venta_total AS CPT ON CPT.id = turno_corte_venta.id_cierre_venta_total
                            WHERE turno_corte.id = ?`;

            
                db.execute(sql, [this.data.turno], (err, row) => {
                    if (err) console.log(err);
                    if (row) if (row.length > 0) {
                        this.data.tipo = 'CIERRE';
                        this.data.turnoCorte = row;
                        this.data.fechaApertura = row[0].fecha_apertura;
                        this.data.fechaCierre = row[0].fecha_cierre;
                        this.getConsignacion(this.data.turno);
                        this.getVentasPorTipo_efectivo(this.data.turno);
                        this.getVentasPorTipo_credito(this.data.turno);
                        this.getVentasPorTipo_control(this.data.turno);
                        this.getVentasPorTipo_prepago(this.data.turno);
                        this.getVentasPorTipo_datafono(this.data.turno);
                        this.getVentasPorTipo_calibracion(this.data.turno);
                        this.getVentasPorTipo_sinformapago(this.data.turno);
                        this.getCantidadCaras();
                        this.getNombreEDS();
                        this.getCantidadmangueras();
                        this.getTipoImpresora();
                        this.getTipoCuentaVentas();

                    } else this.writeScreen("No se encontro cierre en turno_corte");
                });
            } catch (err) { this.err("\t\tConsecutivo Cierre escojer si arqueo", err); }
        }
    }

    /**
     * Obtener el tipo de pago de una venta
     * 
     */
    getTipoCuentaVentas() {
        console.log('\tConsecutivo Cierre tipo cuenta ventas');
        try {
            const sql = 'SELECT tipo_cuenta_ventas, sum(precio_ventas) AS precio_ventas '
                + 'FROM ventas WHERE fecha_ventas > ? AND fecha_ventas < ? GROUP BY tipo_cuenta_ventas';

            db.execute(sql, [this.data.fechaApertura, this.data.fechaCierre], (err, row) => {
                if (err) console.log(err);
                if (row.length > 0) {
                    this.discriminarVentas(row);
                }else{
                    this.discriminarVentas(row);
                }
            });
        } catch (err) { this.err("\t\tObtener tipo cuenta ventas ", err); }
    }

    discriminarVentas(ventas) {
        
        this.armarMensaje();
        
    }

    /**
     * Obtiene las consignaciones de la base de datos y agrega una key consignaciones 
     * a la variable golobal data de esta clase con las consignacioes.
     * @param {*} turno_id 
     */

    
    getVentasPorTipo_efectivo(turno_id){
        
    console.log('\tConsecutivo Cierre obtener ventas efectivo');    
    try {
            const sql = 'SELECT  sum(precio_ventas) AS precio_ventas FROM ventas where id_turno = ? and (tipo_cuenta_ventas = ? OR tipo_cuenta_ventas = ? or tipo_cuenta_ventas = ?)'

            db.execute(sql, [turno_id,"EFECTIVO","","SIN FORMA DE PAGO"], (err, row) => {
                if (err) console.log(err);
                if (row) {

                    this.data.ventaefectivo = row.map(c => {
                
                        const valor = parseInt(c.precio_ventas);
                        
                        return {
                            valor,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tVentas tipo EFECTIVO", err); }
    
    }
    

    
    
    getVentasPorTipo_credito(turno_id){
        
    console.log('\tConsecutivo Cierre obtener ventas credito');    
    
    try {
            const sql = 
            `SELECT  ventas.id, fecha_ventas,IFNULL(CONCAT(usuario.nom_usuario," ", COALESCE(usuario.ape_usuario,"")),"") as cliente, placa_ventas, ventas.galones_ventas, pagar_venta
            FROM ventas 
            inner join vehiculo on ventas.id_vehiculo = vehiculo.id 
            inner join usuario on usuario.identificacion = vehiculo.propietario_vehiculo 
            WHERE id_turno = ? and tipo_cuenta_ventas = ?`;
            

            db.execute(sql, [turno_id,"CREDITO"], (err, row) => {
                if (err) console.log(err);
                if (row) {

                    this.data.ventacredito = row.map(c => {
                        let f = format.asString('yyyy/MM/dd hh:mm', c.fecha_ventas);
                        let fSplit = f.split(" ");
                        const ticket = c.id;
                        const fecha_v  = f;
                        const cliente = c.cliente;
                        const placa = c.placa_ventas;
                        const cantidad = c.galones_ventas;
                        const valor = parseInt(c.pagar_venta);
                        return {
                            ticket,
                            fecha_v,
                            cliente,
                            placa,
                            cantidad,
                            valor,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tVentas tipo Credito", err); }
    
    }
    
    getVentasPorTipo_control(turno_id){
        
    console.log('\tConsecutivo Cierre obtener ventas control');    
    try {
            const sql = 
            `SELECT  ventas.id, fecha_ventas,IFNULL(CONCAT(usuario.nom_usuario," ", COALESCE(usuario.ape_usuario,"")),"") as cliente, placa_ventas, ventas.galones_ventas, pagar_venta
            FROM ventas 
            inner join vehiculo on ventas.id_vehiculo = vehiculo.id 
            inner join usuario on usuario.identificacion = vehiculo.propietario_vehiculo 
            WHERE id_turno = ? and tipo_cuenta_ventas = ?`;

            db.execute(sql, [turno_id,"CONTROL"], (err, row) => {
                if (err) console.log(err);
                if (row) {

                    this.data.ventacontrol = row.map(c => {
                        let f = format.asString('yyyy/MM/dd hh:mm', c.fecha_ventas);
                        let fSplit = f.split(" ");
                        const ticket = c.id;
                        const fecha_v  = f;
                        const cliente = c.cliente;
                        const placa = c.placa_ventas;
                        const cantidad = c.galones_ventas;
                        const valor = parseInt(c.pagar_venta);
                        return {
                            ticket,
                            fecha_v,
                            cliente,
                            placa,
                            cantidad,
                            valor,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tVentas tipo CONTROL", err); }
    
    }
    
    
    
    getVentasPorTipo_prepago(turno_id){
    console.log('\tConsecutivo Cierre obtener ventas prepago');
    try {
            const sql = 
            `SELECT  ventas.id, fecha_ventas,IFNULL(CONCAT(usuario.nom_usuario," ", COALESCE(usuario.ape_usuario,"")),"") as cliente, placa_ventas, ventas.galones_ventas, pagar_venta 
            FROM ventas 
            inner join vehiculo on ventas.id_vehiculo = vehiculo.id 
            inner join usuario on usuario.identificacion = vehiculo.propietario_vehiculo 
            WHERE id_turno = ? and tipo_cuenta_ventas = ?`;

            db.execute(sql, [turno_id,"PREPAGO"], (err, row) => {
                if (err) console.log(err);
                if (row) {

                  this.data.ventaprepago = row.map(c => {
                        let f = format.asString('yyyy/MM/dd hh:mm', c.fecha_ventas);
                        let fSplit = f.split(" ");
                        const ticket = c.id;
                        const fecha_v  = f;
                        const cliente = c.cliente;
                        const placa = c.placa_ventas;
                        const cantidad = c.galones_ventas;
                        const valor = parseInt(c.pagar_venta);
                        return {
                            ticket,
                            fecha_v,
                            cliente,
                            placa,
                            cantidad,
                            valor,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tVentas tipo PREPAGO", err); }
    
    }
    
    getVentasPorTipo_datafono(turno_id){
    console.log('\tConsecutivo Cierre obtener ventas datafono');
    try {
            const sql = 
            `SELECT  ventas.id, fecha_ventas,IFNULL(CONCAT(usuario.nom_usuario," ", COALESCE(usuario.ape_usuario,"")),"") as cliente, placa_ventas, ventas.galones_ventas, pagar_venta
            FROM ventas 
            inner join vehiculo on ventas.id_vehiculo = vehiculo.id 
            inner join usuario on usuario.identificacion = vehiculo.propietario_vehiculo 
            WHERE id_turno = ? and tipo_cuenta_ventas = ?`;
            db.execute(sql, [turno_id,"DATAFONO"], (err, row) => {
                if (err) console.log(err);
                if (row) {

                    this.data.ventadatafono = row.map(c => {
                        let f = format.asString('yyyy/MM/dd hh:mm', c.fecha_ventas);
                        let fSplit = f.split(" ");
                        const ticket = c.id;
                        const fecha_v  = f;
                        const cliente = c.cliente;
                        const placa = c.placa_ventas;
                        const cantidad = c.galones_ventas;
                        const valor = parseInt(c.pagar_venta);
                        return {
                            ticket,
                            fecha_v,
                            cliente,
                            placa,
                            cantidad,
                            valor,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tVentas tipo DATAFONO", err); }
    }

    getVentasPorTipo_calibracion(turno_id){
    console.log('\tConsecutivo Cierre obtener ventas calibracion');
    try {
            const sql = 
            `SELECT  ventas.id, fecha_ventas,IFNULL(CONCAT(usuario.nom_usuario," ", COALESCE(usuario.ape_usuario,"")),"") as cliente, placa_ventas, ventas.galones_ventas, pagar_venta
            FROM ventas 
            inner join vehiculo on ventas.id_vehiculo = vehiculo.id 
            inner join usuario on usuario.identificacion = vehiculo.propietario_vehiculo 
            WHERE id_turno = ? and tipo_cuenta_ventas = ?`;
            db.execute(sql, [turno_id,'CALIBRACION'], (err, row) => {
                if (err) console.log(err);
                if (row) {

                    this.data.ventacalibracion = row.map(c => {
                        let f = format.asString('yyyy/MM/dd hh:mm', c.fecha_ventas);
                        let fSplit = f.split(" ");
                        const ticket = c.id;
                        const fecha_v  = f;
                        const cliente = c.cliente;
                        const placa = c.placa_ventas;
                        const cantidad = c.galones_ventas;
                        const valor = parseInt(c.pagar_venta);
                        return {
                            ticket,
                            fecha_v,
                            cliente,
                            placa,
                            cantidad,
                            valor,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tVentas tipo CALIBRACION", err); }
    }
    
    
    getVentasPorTipo_sinformapago(turno_id){
    console.log('\tConsecutivo Cierre obtener ventas sinformapago');
    try {
            const sql = 
            `SELECT  ventas.id, fecha_ventas,IFNULL(CONCAT(usuario.nom_usuario," ", COALESCE(usuario.ape_usuario,"")),"") as cliente, placa_ventas, ventas.galones_ventas, pagar_venta
            FROM ventas 
            inner join vehiculo on ventas.id_vehiculo = vehiculo.id 
            inner join usuario on usuario.identificacion = vehiculo.propietario_vehiculo 
            WHERE tipo_cuenta_ventas IN ('VALE','VOUCHER','SIN FORMA PAGO') AND id_turno = ?`;    
            //WHERE id_turno = ? and tipo_cuenta_ventas = ? and tipo_cuenta_ventas = ? and tipo_cuenta_ventas = ?`;
            db.execute(sql, [turno_id], (err, row) => {
                if (err) console.log(err);
                if (row) {

                    this.data.ventasinformapago = row.map(c => {
                        let f = format.asString('yyyy/MM/dd hh:mm', c.fecha_ventas);
                        let fSplit = f.split(" ");
                        const ticket = c.id;
                        const fecha_v  = f;
                        const cliente = c.cliente;
                        const placa = c.placa_ventas;
                        const cantidad = c.galones_ventas;
                        const valor = parseInt(c.pagar_venta);
                        return {
                            ticket,
                            fecha_v,
                            cliente,
                            placa,
                            cantidad,
                            valor,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tVentas tipo SIN FORMA PAGO", err); }
    }
    
    getNumeracionPos(turno_id){
    console.log('\tget numeracion POS');
    try {
            const sql = 
            `SELECT  ventas.id, fecha_ventas,IFNULL(CONCAT(usuario.nom_usuario," ", COALESCE(usuario.ape_usuario,"")),"") as cliente, placa_ventas, ventas.galones_ventas, pagar_venta
            FROM ventas 
            inner join vehiculo on ventas.id_vehiculo = vehiculo.id 
            inner join usuario on usuario.identificacion = vehiculo.propietario_vehiculo 
            WHERE id_turno = ? and tipo_cuenta_ventas = ?`;
            db.execute(sql, [turno_id,'CALIBRACION'], (err, row) => {
                if (err) console.log(err);
                if (row) {

                    this.data.ventacalibracion = row.map(c => {
                        let f = format.asString('yyyy/MM/dd hh:mm', c.fecha_ventas);
                        let fSplit = f.split(" ");
                        const ticket = c.id;
                        const fecha_v  = f;
                        const cliente = c.cliente;
                        const placa = c.placa_ventas;
                        const cantidad = c.galones_ventas;
                        const valor = parseInt(c.pagar_venta);
                        return {
                            ticket,
                            fecha_v,
                            cliente,
                            placa,
                            cantidad,
                            valor,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tVentas tipo CALIBRACION", err); }
    }
    
    
    getConsignacion(turno_id) {
    console.log('\tConsecutivo Cierre obtener ventas consignaciones');
        try {
            const sql = 'SELECT * FROM consignaciones WHERE id_turno = ?'

            db.execute(sql, [turno_id], (err, row) => {
                if (err) console.log(err);
                if (row) {

                    this.data.consignaciones = row.map(c => {
                        const f = (c.fecha_consignacion.toString()).split(' ');
                        const fecha = `${f[1]}-${f[2]}-${f[3]} ${f[4]}`;
                        const valor = parseInt(c.valor_consignacion);
                        const anuladas = parseInt(c.anuladas);
                        const id = parseInt(c.id);
                        return {
                            id,
                            valor,
                            fecha,
                            anuladas,
                        };
                    });

                }
            });
        } catch (err) { this.err("\t\tObtener consignación", err); }
    }
    
    getCantidadCaras(){
		console.log('\tcantidad de Caras');
		try{
			let sql = "SELECT COUNT(*) AS cant FROM caras";
			db.execute(sql, (err, rows)=>{
				if(err) console.log(err);
				if(rows) if(rows.length > 0){
                    this.data.cantCaras=parseInt(rows[0].cant);
				}else this.writeScreen("No se encontro cantidad caras");
			});
		}catch(err){ this.err("cantCaras", err); }
	}
    
    getTipoImpresora(){
         console.log('\tobtenerTipoImpresora');
        try{
            let sql = 'SELECT valor_parametros FROM parametros WHERE nombre_parametros = ?';
            db.execute(sql, ["TIPO_IMPRESORA"], (err, row)=>{
                if(err) console.log(err);
                if(row) if(row.length > 0){
                    this.data.tipo_impresora = row[0].valor_parametros;                   
                }else this.writeScreen("No se obtuvo datos en parametro CONTRIBUYENTE");
            });
        }catch(err){ this.err("obtenerNumeroDispensador", err); }
    }
    
    getNombreEDS(){
        console.log("\tconsultar nombre de la estacion");
        try{
             let sql = "SELECT valor_parametros FROM parametros WHERE nombre_parametros = ?";
             db.execute(sql, ['NOMBRE ESTACION'], (err, row)=>{
                if(err) console.log(err);
                if(row) if(row.length > 0){
                   
                    this.data.nombreEDS = row[0].valor_parametros
                  
                }else console.log("\t\tNo se encontraro el nombre de la estacion");
            });
        }catch(e){this.err("consultarnombreEDS", e); }
    }
    
    getCantidadmangueras(){
		console.log('\tcantidad de mangueras');
		try{
			let sql = "SELECT COUNT(*) AS cant FROM mangueras";
			db.execute(sql, (err, rows)=>{
				if(err) console.log(err);
				if(rows) if(rows.length > 0){
                    this.data.cantmangueras=parseInt(rows[0].cant/2);
				}else this.writeScreen("No se encontro cantidad mancueras");
			});
		}catch(err){ this.err("cantmangueras", err); }
	}
    
    armarMensaje() {
        console.log('\tConsecutivo Cierre armando mensaje');
        
        let f = format.asString('yyyy/MM/dd hh:mm', this.data.turnoCorte[0].fecha_cierre);
        let fSplit = f.split(" ");
        
        let fa = format.asString('yyyy/MM/dd hh:mm', this.data.turnoCorte[0].fecha_apertura);
        let faSplit = fa.split(" ");
        console.log('asdfasdfdsf'+ this.data.tipo_impresora);

        this.data.ticketCierre = {

            fechaImp: fSplit[0],
            horaImp: fSplit[1],
            corteVenta: this.data.turno,
            fecha: this.data.fechaActual,
            fechaApe: faSplit[0],
            horaApe: faSplit[1],
            hora: this.data.horaActual,
            surtidor: this.data.numDisp,
            islero: this.data.turnoCorte[0].islero,
            caras: [],
            totalProducto: [],
            consignaciones: this.data.consignaciones || [],
            ventaefectivo: this.data.ventaefectivo || [],
            ventacredito: this.data.ventacredito || [],
            ventaprepago: this.data.ventaprepago || [],
            ventacontrol: this.data.ventacontrol || [],
            ventadatafono: this.data.ventadatafono || [],
            ventacalibracion: this.data.ventacalibracion || [],
            ventasinformapago: this.data.ventasinformapago || [],
            ventasDis: this.data.ventas || [],
            tipo: this.data.tipo,
            cantcaras: this.data.cantCaras,
            nombreeds: this.data.nombreEDS,
            cantmangueras: this.data.cantmangueras,
            tipo_impresora: this.data.tipo_impresora
        }

        let m1 = 0, m2 = 0, m3 = 0, g1 = 0, g2 = 0, g3 = 0, v1 = 0, v2 = 0, v3 = 0;

        this.data.turnoCorte.forEach(element => {

            let obj = { cara: element.cara, mangueras: [] };

            if (element.cara == 1) {

                if (parseFloat(element.g1a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara1[0], this.data.producMAng.cara1[1],
                        this.puntoGalon(element.g1a), this.puntoGalon(element.g1c),
                        element.p1a, element.p1c,
                        this.calcular_desborde(parseInt(element.p1a), parseInt(element.p1c)),
                        this.calcular_desborde_galones(element.g1a, element.g1c)
                    ]);
                    g1 = parseFloat(g1) + parseFloat(this.calcular_desborde_galones(element.g1a, element.g1c));
                    v1 = v1 + this.calcular_desborde(parseInt(element.p1a), parseInt(element.p1c));
                    m1 = this.data.producMAng.cara1[0];
                }
                if (parseFloat(element.g2a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara1[2], this.data.producMAng.cara1[3],
                        this.puntoGalon(element.g2a), this.puntoGalon(element.g2c),
                        element.p2a, element.p2c,
                        this.calcular_desborde(parseInt(element.p2a), parseInt(element.p2c)),
                        this.calcular_desborde_galones(element.g2a, element.g2c)
                    ]);
                    g2 = parseFloat(g2) + parseFloat(this.calcular_desborde_galones(element.g2a, element.g2c));
                    v2 = v2 + this.calcular_desborde(parseInt(element.p2a), parseInt(element.p2c));
                    m2 = this.data.producMAng.cara2[2];
                }
                if (parseFloat(element.g3a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara1[4], this.data.producMAng.cara1[5],
                        this.puntoGalon(element.g3a), this.puntoGalon(element.g3c),
                        element.p3a, element.p3c,
                        this.calcular_desborde(parseInt(element.p3a), parseInt(element.p3c)),
                        this.calcular_desborde_galones(element.g3a, element.g3c)
                    ]);
                    g3 = parseFloat(g3) + parseFloat(this.calcular_desborde_galones(element.g3a, element.g3c));
                    v3 = v3 + this.calcular_desborde(parseInt(element.p3a), parseInt(element.p3c));
                    m3 = this.data.producMAng.cara3[4];
                }
                this.data.ticketCierre.caras.push(obj);
            }

            if (element.cara == 2) {
                if (parseFloat(element.g1a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara1[0], this.data.producMAng.cara1[1],
                        this.puntoGalon(element.g1a), this.puntoGalon(element.g1c),
                        element.p1a, element.p1c,
                        this.calcular_desborde(parseInt(element.p1a), parseInt(element.p1c)),
                        this.calcular_desborde_galones(element.g1a, element.g1c)
                    ]);
                    g1 = parseFloat(g1) + parseFloat(this.calcular_desborde_galones(element.g1a, element.g1c));
                    v1 = v1 + this.calcular_desborde(parseInt(element.p1a), parseInt(element.p1c));
                    m1 = this.data.producMAng.cara1[0];
                }
                if (parseFloat(element.g2a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara1[2], this.data.producMAng.cara1[3],
                        this.puntoGalon(element.g2a), this.puntoGalon(element.g2c),
                        element.p2a, element.p2c,
                        this.calcular_desborde(parseInt(element.p2a), parseInt(element.p2c)),
                        this.calcular_desborde_galones(element.g2a, element.g2c)
                    ]);
                    g2 = parseFloat(g2) + parseFloat(this.calcular_desborde_galones(element.g2a, element.g2c));
                    v2 = v2 + this.calcular_desborde(parseInt(element.p2a), parseInt(element.p2c));
                    m2 = this.data.producMAng.cara2[2];
                }
                if (parseFloat(element.g3a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara1[4], this.data.producMAng.cara1[5],
                        this.puntoGalon(element.g3a), this.puntoGalon(element.g3c),
                        element.p3a, element.p3c,
                        this.calcular_desborde(parseInt(element.p3a), parseInt(element.p3c)),
                        this.calcular_desborde_galones(element.g3a, element.g3c)
                    ]);
                    g3 = parseFloat(g3) + parseFloat(this.calcular_desborde_galones(element.g3a, element.g3c));
                    v3 = v3 + this.calcular_desborde(parseInt(element.p3a), parseInt(element.p3c));
                    m3 = this.data.producMAng.cara3[4];
                }
                this.data.ticketCierre.caras.push(obj);
            }

            if (element.cara == 3) {
                if (parseFloat(element.g1a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara3[0], this.data.producMAng.cara3[1],
                        this.puntoGalon(element.g1a), this.puntoGalon(element.g1c),
                        element.p1a, element.p1c,
                        this.calcular_desborde(parseInt(element.p1a), parseInt(element.p1c)),
                        this.calcular_desborde_galones(element.g1a, element.g1c)
                    ]);
                    g2 = parseFloat(g2) + parseFloat(this.calcular_desborde_galones(element.g1a, element.g1c));
                    v2 = v2 + this.calcular_desborde(parseInt(element.p1a), parseInt(element.p1c));
                    m2 = this.data.producMAng.cara3[0];
                }
                if (parseFloat(element.g2a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara3[2], this.data.producMAng.cara3[3],
                        this.puntoGalon(element.g2a), this.puntoGalon(element.g2c),
                        element.p2a, element.p2c,
                        this.calcular_desborde(parseInt(element.p2a), parseInt(element.p2c)),
                        this.calcular_desborde_galones(element.g2a, element.g2c)
                    ]);
                    g2 = parseFloat(g2) + parseFloat(this.calcular_desborde_galones(element.g2a, element.g2c));
                    v2 = v2 + this.calcular_desborde(parseInt(element.p2a), parseInt(element.p2c));
                    m2 = this.data.producMAng.cara3[2];
                }
                if (parseFloat(element.g3a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara3[4], this.data.producMAng.cara3[5],
                        this.puntoGalon(element.g3a), this.puntoGalon(element.g3c),
                        element.p3a, element.p3c,
                        this.calcular_desborde(parseInt(element.p3a), parseInt(element.p3c)),
                        this.calcular_desborde_galones(element.g3a, element.g3c)
                    ]);
                    g3 = parseFloat(g3) + parseFloat(this.calcular_desborde_galones(element.g3a, element.g3c));
                    v3 = v3 + this.calcular_desborde(parseInt(element.p3a), parseInt(element.p3c));
                    m3 = this.data.producMAng.cara3[4];
                }
                this.data.ticketCierre.caras.push(obj);
            }
            if (element.cara == 4) {

                if (parseFloat(element.g1a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara4[0], this.data.producMAng.cara4[1],
                        this.puntoGalon(element.g1a), this.puntoGalon(element.g1c),
                        element.p1a, element.p1c,
                        this.calcular_desborde(parseInt(element.p1a), parseInt(element.p1c)),
                        this.calcular_desborde_galones(element.g1a, element.g1c)
                    ]);
                    g2 = parseFloat(g2) + parseFloat(this.calcular_desborde_galones(element.g1a, element.g1c));
                    v2 = v2 + this.calcular_desborde(parseInt(element.p1a), parseInt(element.p1c));
                    m2 = this.data.producMAng.cara4[0];
                }
                if (parseFloat(element.g2a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara4[2], this.data.producMAng.cara4[3],
                        this.puntoGalon(element.g2a), this.puntoGalon(element.g2c),
                        element.p2a, element.p2c,
                        this.calcular_desborde(parseInt(element.p2a), parseInt(element.p2c)),
                        this.calcular_desborde_galones(element.g2a, element.g2c)
                    ]);
                    g2 = parseFloat(g2) + parseFloat(this.calcular_desborde_galones(element.g2a, element.g2c));
                    v2 = v2 + this.calcular_desborde(parseInt(element.p2a), parseInt(element.p2c));
                    m2 = this.data.producMAng.cara4[2];
                }
                if (parseFloat(element.g3a) > 0) {
                    obj.mangueras.push([
                        this.data.producMAng.cara4[4], this.data.producMAng.cara4[5],
                        this.puntoGalon(element.g3a), this.puntoGalon(element.g3c),
                        element.p3a, element.p3c,
                        this.calcular_desborde(parseInt(element.p3a), parseInt(element.p3c)),
                        this.calcular_desborde_galones(element.g3a, element.g3c)
                    ]);
                    g3 = parseFloat(g3) + parseFloat(this.calcular_desborde_galones(element.g3a, element.g3c));
                    v3 = v3 + this.calcular_desborde(parseInt(element.p3a), parseInt(element.p3c));
                    m3 = this.data.producMAng.cara4[4];
                }
                this.data.ticketCierre.caras.push(obj);
            }
        });
       

        if (m1 != 0) this.data.ticketCierre.totalProducto.push([m1, v1, this.puntoGalon(g1)]);
        if (m2 != 0) this.data.ticketCierre.totalProducto.push([m2, v2, this.puntoGalon(g2)]);
        if (m3 != 0) this.data.ticketCierre.totalProducto.push([m3, v3, this.puntoGalon(g3)]);
        let g = this.puntoGalon(this.puntoGalon(g1) + this.puntoGalon(g2) + this.puntoGalon(g3)),
            v = v1 + v2 + v3;
        this.data.ticketCierre.total = [v, g];
        
        
        
		
        if(this.data.pdf == true) {
            new CierreTurnoPDF(this.data.ticketCierre);
            
        }
        /*
        else if(this.data.email == true) {
            //new CierreTurnoExcel(this.data.ticketCierre);
        }else{
            function espera_buffer_impresora(data) {
			
		  var miVar1 = setTimeout(function(){ myTimeout1(data) }, 500) 
          var miVar2 = setTimeout(function(){ myTimeout2(data) }, 1000) 
          var miVar3 = setTimeout(function(){ myTimeout3(data) }, 1500) 
		  var miVar4 = setTimeout(function(){ myTimeout4(data) }, 2500)  
		  var miVar5 = setTimeout(function(){ myTimeout5(data) }, 3500)  
		  var miVar6 = setTimeout(function(){ myTimeout6(data) }, 4500)  
		  var miVar7 = setTimeout(function(){ myTimeout7(data) }, 6500)	
          var miVar8 = setTimeout(function(){ myTimeout8(data) }, 7500)	
		}
            
            function myTimeout1() {
                new CambioPrecio('MM');
            }
            
            function myTimeout2() {
                new CambioPrecio('MM');
            }
            
            function myTimeout3(data) {
                global.impresora.cierre_turno_1(data);
            }
            
            function myTimeout4(data) {
                global.impresora.cierre_turno_2(data);
            }
            
            function myTimeout5(data) {
                global.impresora.cierre_turno_3(data);
            }
            
            function myTimeout6(data) {
                global.impresora.cierre_turno_4(data);
            }
            
            function myTimeout7(data) {
                global.impresora.cierre_turno_5(data);
            }
            function myTimeout8(data) {
                global.impresora.cierre_turno_6(data);
            }
            espera_buffer_impresora(this.data.ticketCierre);
            
        }
        
        
        */
        
    }
}
