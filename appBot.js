const Telegraf = require('telegraf');
const excel = require("./excelBotPro");
const db = require('./db/db');
const ConsecutivoTurnoCierre = require('/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/botticketsoft/modulos/ConsecutivoTurnoCierreBOT');
const format = require('date-format');




const bot =  new Telegraf('1482118762:AAG8Wmi1yxrN8f0SdjC5xufWu-Qp7bJMNmI');

let fecha1 = "";
let fecha2 = "";
let fechasLimites = {};
let dispensador = 0;
let array = new Array();

const exec = require('child_process').exec;

        //


module.exports = class TelegrafON {
  constructor() {
    console.log("-- CLASE TELEGRAF --");
    this.obtenerNumeroDispensador();
  }

  obtenerNumeroDispensador() {
    console.log("\tGet Numero del dispensador");
    try {
      let sql = "SELECT valor_parametros FROM parametros WHERE nombre_parametros = ?";
      db.execute(sql, ["NUMERO SURTIDOR"], (err, row) => {
        if (err) console.log(err);
        if (row)
          if (row.length > 0) {
            dispensador = row[0].valor_parametros;
            bot.launch();
            this.iniciar_bot();
          } else
            this.writeScreen("No se obtuvo datos en obtenerNumeroDispensador");
      });
    } catch (err) {
      this.err("\t\tobtenerNumeroDispensador", err);
    }
  }

  iniciar_bot() {
    try {
      bot.command("ingreso", (ctx) => {
        const pass = ctx.update.message.text.split(" ")[1];
        console.log(pass);
        if (pass === "1234") {
          ctx.reply(`
            ### Bienvenido al bot de TicketSoft 🌐 ###
  
          `);
          this.fechaLimites();
          this.turno();
          this.fechaInicial();
        } else {
          ctx.reply(`
          ⚠️ ❗️❗️ numero de session invalido, vuelva a escribirlo ❗️❗️ ⚠️
          `);
        }
      });
    } catch (error) {
      console.log("ERROR inicar_bot :" + error);
    }
  }

  fechaLimites() {
    try {
      let sql =
        "SELECT MiN(fecha_ventas) AS minFecha ,MAX(fecha_ventas) AS maxFecha FROM ticketsoft.ventas";
      db.execute(sql, (err, rows) => {
        if (err) console.log(err);
        if (rows)
          if (rows.length > 0) {
            rows.minFecha = format.asString('yyyy-MM-dd hh:mm:ss',rows.minFecha);
            rows.maxFecha = format.asString('yyyy-MM-dd hh:mm:ss',rows.maxFecha);
            fechasLimites = rows;
            
            console.log(fechasLimites);
          } else {
            console.log("row.length > 0 ERROR");
            //  this.writeScreen("No se encontraron Ventas");
          }
      });
    } catch (err) {
      // this.err("\t\tGet Ventas", err);
      console.log(err);
    }
  }

  turno() {
    try {
      bot.command("turno", (ctx) => {
        const turno = ctx.update.message.text.split(" ")[1];
        console.log("TURNO = " + turno);
        const turnoValido = this.validarTurno(turno);
        if (turnoValido) {
          ctx.reply(`
            ✅ PERFECTO ✅
            GENERANDO PDF
            TURNO: ${turno}
            ESPERE UN MOMENTO...
            `);
          const data = { turno: turno, pdf: true };
          new ConsecutivoTurnoCierre(data);
          console.log('COMO0OO'+turno.turno)
          setTimeout(() => {
            ctx.replyWithDocument({
              source: "/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/botticketsoft/archivos/pdfs/CIERRE_DISPENSADOR_" + dispensador + "_TURNO_" + turno + ".pdf",
            });
          }, 5000);
        } else {
          ctx.reply(`
          ⚠️ ❗️❗️ Mal ingresado, Intente nuevamente ❗️❗️ ⚠️
          `);
        }
      });
    } catch (error) {
      console.log("ERROR turno: " + error);
    }
  }

  fechaInicial() {
    try {
      bot.command("desde", (ctx) => {
        array = ctx.update.message.text.split(" ");
        const fechaValida = this.validarFecha(array);
        if (fechaValida) {
          fecha1 = `${array[1]} ${array[2]}`;
          ctx.reply(`
            ✅ Ahora esciba hasta que fecha ✅
  
                /hasta AAAA-MM-DD HH:MM:SS
            `);
          this.fechaFinal();
        } else {
          ctx.reply(`
          ⚠️ ❗️❗️ Vuelva a escribir la fecha Inicial ❗️❗️ ⚠️
  
                  /desde AAAA-MM-DD HH:MM:SS
          
          `);
        }
      });
    } catch (error) {
      console.log("ERROR fecha Inicial: " + error);
    }
  }

  fechaFinal() {
    try {
      bot.command("hasta", async (ctx) => {
        array = ctx.update.message.text.split(" ");
        const valido = this.validarFecha(array);
        if (valido) {
          fecha2 = `${array[1]} ${array[2]}`;

          ctx.reply("fecha" + fecha1 + " " + fecha2);
          console.log(fecha1 && fecha2);
          if (fecha1 && fecha2) {
            ctx.reply(`
            ✅ PERFECTO ✅
            GENERANDO EXCEL 
            ( Desde ${fecha1} hasta ${fecha2} )
            ESPERE UN MOMENTO...
            `);
            //crear el Documento

            //ctx.replyWithDocument({ source: __dirname + '/../../static/excel/cierre_1.xlsx'});

            await excel(fecha1, fecha2).then((response) => {
              //ctx.replyWithDocument({source:`./documentos/${response}`});
              try {
        if (response) {
    
          //console.log("RESSSSSSPONSEEEEEEEEEEEEEEE " + response);
    
          
    
            ctx.replyWithDocument({source:`/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/botticketsoft/archivos/excel/${response}`});
    
            //ctx.replyWithDocument({ source: "/home/pi/Music/botticketsoft/documentos/"+response})
    
    
    
        } else {
    
          throw "Error al crear archivo @@@@@@@@@@@@@@@@@@@@@@";
    
        }
        
    } catch (error) {
        console.log(error);
    }
             /* if (response) {
                console.log("RESSSSSSPONSEEEEEEEEEEEEEEE " + response);
                
                  ctx.replyWithDocument({source:`/home/pi/Music/botticketsoft/documentos/${response}`});
                  ctx.replyWithDocument({ source: "/home/pi/Music/botticketsoft/documentos/"+response})

              } else {
                throw "Error al crear archivo @@@@@@@@@@@@@@@@@@@@@@";
              }*/
            });
          }
        } else {
          ctx.reply(`
          ⚠️ ❗️❗️ Vuelva a escribir la fecha Final ❗️❗️ ⚠️
  
                  /hasta AAAA-MM-DD HH:MM:SS
          `);
        }
      });
    } catch (error) {
      console.log("ERROR fecha final: " + error);
    }
  }



  validarFecha(fecha) {
    if (array.length === 3) {
     // if (condition) {
        return true;
      //}
    } else {
      return false;
    }
  }

  validarTurno(turno) {
    const turnoInt = parseInt(turno);
    if (String(turnoInt) != "NaN") {
      console.log("naN");
      return true;
    } else {
      return false;
    }
  }
};
