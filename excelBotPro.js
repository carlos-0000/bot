var fonts = {
  Roboto: {
    normal: 'modulos/modulosGenerales/fonts/Roboto-Regular.ttf',
    bold: 'modulos/modulosGenerales/fonts/Roboto-Medium.ttf',
    italics: 'modulos/modulosGenerales/fonts/Roboto-Italic.ttf',
    bolditalics: 'modulos/modulosGenerales/fonts/Roboto-MediumItalic.ttf'
  }
};


/* MODULOS REQUERIDOS */
const db = require('./db/db');

//const db = require('/../../db/db');
//const db = require('./db/db');

/* DEPENDENCIAS NODE */
const xl = require('excel4node');
const format = require('date-format');

module.exports = async function excel (fecha1, fecha2) {

    return new Promise ((resolve, reject) => {

        console.log("CLASE EMAIL EXCEL");
        let wb = new xl.Workbook();
        let data = {};

        console.log('saludo2excel');

        console.log('\tGet VEntas r');
        try {
            let sql = "SELECT * FROM ticketsoft.ventas where ventas.fecha_ventas >= ? and ventas.fecha_ventas <= ?";
            db.execute(sql, [fecha1, fecha2], (err, rows) => {
                if (err) console.log(err);
                if (rows) if (rows.length > 0) {

                    data.ventas = rows;
                    console.log('object');


                    console.log("setearData");
                    data.styleHead = {
                        borderTop: wb.createStyle({font: {bold: true, size: 14, name: 'Arial', color: '#22ad39', horizontal: 'center', vertical: 'center', background: '#000000'}, border: {top: {style: 'medium', color: '#0026ff'}}}),
                        borderNone: wb.createStyle({font: {bold: true, size: 14, name: 'Arial'}}),
                        borderLeft: wb.createStyle({font: {bold: true, size: 14, name: 'Arial'}, border: {left: {style: 'medium', color: '#000000'}}}),
                        borderRight: wb.createStyle({font: {bold: true, size: 14, name: 'Arial'}, border: {right: {style: 'medium', color: '#000000'}}}),
                        borderBottom: wb.createStyle({font: {bold: true, size: 14, name: 'Arial'}, border: {bottom: {style: 'medium', color: '#000000'}}}),
                        borderTopBottom: wb.createStyle({font: {bold: true, size: 14, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}, bottom: {style: 'medium', color: '#000000'}}}),
                        borderTopLeftBottom: wb.createStyle({font: {bold: true, size: 14, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}, left: {style: 'medium', color: '#000000'}, bottom: {style: 'medium', color: '#000000'}}}),
                        borderTopRightBottom: wb.createStyle({font: {bold: true, size: 14, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}, right: {style: 'medium', color: '#000000'}, bottom: {style: 'medium', color: '#000000'}}})
                    };

                    data.styleBody = {
                        borderTop: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}}}),
                        borderNone: wb.createStyle({font: {size: 12, name: 'Arial'}}),
                        borderLeft: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {left: {style: 'medium', color: '#000000'}}}),
                        borderLeftRight: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {left: {style: 'medium', color: '#000000'}, right: {style: 'medium', color: '#000000'}}}),
                        borderLeftBottomRight: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {left: {style: 'medium', color: '#000000'}, bottom: {style: 'medium', color: '#000000'}, right: {style: 'medium', color: '#000000'}}}),
                        borderRight: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {right: {style: 'medium', color: '#000000'}}}),
                        borderBottom: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {bottom: {style: 'medium', color: '#000000'}}}),
                        borderTopBottom: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}, bottom: {style: 'medium', color: '#000000'}}}),
                        borderTopLeft: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}, left: {style: 'medium', color: '#000000'}}}),
                        borderTopRight: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}, right: {style: 'medium', color: '#000000'}}}),
                        borderBottomLeft: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {bottom: {style: 'medium', color: '#000000'}, left: {style: 'medium', color: '#000000'}}}),
                        borderBottomRight: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {bottom: {style: 'medium', color: '#000000'}, right: {style: 'medium', color: '#000000'}}}),
                        borderTopLeftBottom: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}, left: {style: 'medium', color: '#000000'}, bottom: {style: 'medium', color: '#000000'}}}),
                        borderTopRightBottom: wb.createStyle({font: {size: 12, name: 'Arial'}, border: {top: {style: 'medium', color: '#000000'}, right: {style: 'medium', color: '#000000'}, bottom: {style: 'medium', color: '#000000'}}})
                    }

                    console.log("@@  escribirHoja  @@");
                    let hoja = wb.addWorksheet('holamundo');
                    data.row = 1;


                    //Escribir cuerpo
                    console.log("   recorrerCuerpo");
                    //console.log(data)
                    //Escribir cuerpo
                    data.ventas.forEach((cuerpo, index) => {
                        //Titles
                        // hoja.row(5).setHeight(25);
                        hoja.column(1).setWidth(String(cuerpo.id).length + 8);
                        hoja.column(2).setWidth(String(cuerpo.id_productos).length + 8);
                        hoja.column(3).setWidth(String(cuerpo.cara_ventas).length + 8);
                        hoja.column(4).setWidth(String(cuerpo.manguera_ventas).length + 8);
                        hoja.column(5).setWidth(String(cuerpo.precio_ventas).length + 8);
                        hoja.column(6).setWidth(String(cuerpo.galones_ventas).length + 8);
                        hoja.column(7).setWidth(String(cuerpo.ppu_ventas).length + 8);
                        hoja.column(8).setWidth(String(cuerpo.fecha_ventas).length + 8);
                        hoja.column(9).setWidth(String(cuerpo.islero_ventas).length + 8);
                        hoja.column(10).setWidth(String(cuerpo.id_usuario).length + 8);
                        hoja.column(11).setWidth(String(cuerpo.id_vehiculo).length + 8);
                        hoja.column(12).setWidth(String(cuerpo.tipo_cuenta_ventas).length + 8);
                        hoja.column(13).setWidth(String(cuerpo.puntos_ventas).length + 8);
                        hoja.column(14).setWidth(String(cuerpo.kilometraje_ventas).length + 8);
                        hoja.column(15).setWidth(String(cuerpo.placa_ventas).length + 8);
                        hoja.column(16).setWidth(String(cuerpo.tipo_notificacion).length + 8);
                        hoja.column(17).setWidth(String(cuerpo.descuento_ventas).length + 8);
                        hoja.column(18).setWidth(String(cuerpo.tiempo_impresion_ventas).length + 8);
                        hoja.column(18).setWidth(String(cuerpo.copia_impresion_ventas).length + 8);
                        hoja.column(19).setWidth(String(cuerpo.lifemile_ventas).length + 8);
                        hoja.column(20).setWidth(String(cuerpo.estado_updata).length + 8);
                        hoja.column(21).setWidth(String(cuerpo.pagar_venta).length + 8);
                        hoja.column(22).setWidth(String(cuerpo.iva).length + 8);
                        hoja.column(23).setWidth(String(cuerpo.email).length + 8);
                        hoja.column(24).setWidth(String(cuerpo.id_turno).length + 8);
                        hoja.column(25).setWidth(String(cuerpo.prefijo).length + 8);
                        hoja.column(26).setWidth(String(cuerpo.numero_factura).length + 8);
                        hoja.column(27).setWidth(String(cuerpo.tipo_factura).length + 8);
                        hoja.column(28).setWidth(String(cuerpo.fecha).length + 8);

                        hoja.cell(1, 1).string('id').style(data.styleHead.borderTop);
                        hoja.cell(1, 2).string('id_productos').style(data.styleHead.borderTop);
                        hoja.cell(1, 3).string('cara_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 4).string('manguera_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 5).string('precio_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 6).string('galones_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 7).string('ppu_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 8).string('fecha_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 9).string('islero_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 10).string('id_usuario').style(data.styleHead.borderTop);
                        hoja.cell(1, 11).string('id_vehiculo').style(data.styleHead.borderTop);
                        hoja.cell(1, 12).string('tipo_cuenta_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 13).string('puntos_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 14).string('kilometraje_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 15).string('placa_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 16).string('tipo_notificacion').style(data.styleHead.borderTop);
                        hoja.cell(1, 17).string('descuento_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 18).string('tiempo_impresion_ventas venta').style(data.styleHead.borderTop);
                        hoja.cell(1, 19).string('copia_impresion_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 20).string('lifemile_ventas').style(data.styleHead.borderTop);
                        hoja.cell(1, 21).string('estado_updata').style(data.styleHead.borderTop);
                        hoja.cell(1, 22).string('pagar_venta').style(data.styleHead.borderTop);
                        hoja.cell(1, 23).string('iva').style(data.styleHead.borderTop);
                        hoja.cell(1, 24).string('email').style(data.styleHead.borderTop);
                        hoja.cell(1, 25).string('id_turno').style(data.styleHead.borderTop);
                        hoja.cell(1, 26).string('prefijo').style(data.styleHead.borderTop);
                        hoja.cell(1, 27).string('numero_factura').style(data.styleHead.borderTop);
                        hoja.cell(1, 28).string('tipo_factura').style(data.styleHead.borderTop);


                        //Content
                        hoja.cell(index + 1, 1).number(nullFunction(cuerpo.id, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 2).number(nullFunction(cuerpo.id_producto, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 3).number(nullFunction(cuerpo.cara_ventas, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 4).number(nullFunction(cuerpo.manguera_ventas, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 5).number(nullFunction(cuerpo.precio_ventas, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 6).number(nullFunction(parseFloat(cuerpo.galones_ventas), 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 7).number(nullFunction(cuerpo.ppu_ventas, 'number')).style(data.styleBody.borderLeft);
                        //hoja.cell(index+1, 8).string(nullFunction(format.asString('yyyy-MM-dd hh:mm:ss',cuerpo.fecha_ventas),'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 8).string(nullFunction(String(cuerpo.fecha_ventas), 'string')).style(data.styleBody.borderLeft);
                        // hoja.cell(index+1, 8).string(nullFunction('yyyy-MM-dd hh:mm:ss','string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 9).string(nullFunction(cuerpo.islero_ventas, 'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 10).string(nullFunction(String(cuerpo.id_usuario), 'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 11).string(nullFunction(String(cuerpo.id_vehiculo), 'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 12).string(nullFunction(cuerpo.tipo_cuenta_ventas, 'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 13).number(nullFunction(parseFloat(cuerpo.puntos_ventas), 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 14).string(nullFunction(String(cuerpo.kilometraje_ventas), 'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 15).string(nullFunction(String(cuerpo.placa_ventas), 'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 16).number(nullFunction(cuerpo.tipo_notificacion, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 17).number(nullFunction(parseFloat(cuerpo.descuento_ventas), 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 18).number(nullFunction(cuerpo.tiempo_impresion_ventas, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 19).number(nullFunction(cuerpo.copia_impresion_ventas, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 20).number(nullFunction(cuerpo.lifemile_ventas, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 21).number(nullFunction(cuerpo.estado_updata, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 22).number(nullFunction(parseFloat(cuerpo.pagar_venta), 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 23).number(nullFunction(cuerpo.iva, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 24).string(nullFunction(String(cuerpo.email), 'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 25).number(nullFunction(cuerpo.id_turno, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 26).string(nullFunction(cuerpo.prefijo, 'string')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 27).number(nullFunction(cuerpo.numero_factura, 'number')).style(data.styleBody.borderLeft);
                        hoja.cell(index + 1, 28).number(nullFunction(cuerpo.tipo_factura, 'number')).style(data.styleBody.borderLeft);

                        //tipo_cuenta_ventas,islero_ventas,fecha_ventas
                        //Crear fichero
                    });


                    let tempName = `cierre_${Date.now()}.xlsx`

                    //wb.write(`./documentos/${tempName}`, err => resolve(err?false:tempName));
                    //console.log('archivo creado');
                    // cierre_1601412934885.xlsl
                    
                     wb.write(`/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/botticketsoft/archivos/excel/${tempName}`, err => err ? reject(false):resolve(tempName));
                    console.log('archivo creado');

                } else {
                    console.log('nada de nadaaaaaaaaaaaaaaaaaaaaaaaaa');
                    //  this.writeScreen("No se encontraron Ventas");
                }
            });
        } catch (err) {
            // this.err("\t\tGet Ventas", err);
            console.log(err);
        }

        function nullFunction(campo, type) {
            if (campo) {

                if (campo === 'null') {
                    return '';
                } else {
                    return campo;
                }

            } else if (type === 'number') {
                return 0;
            } else if (type === 'string' || campo === 'null') {
                return " ";
            }
        }

    })
}

