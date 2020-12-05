
var fonts = {
  Roboto: {
    normal: '/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/modulos/modulosGenerales/fonts/Roboto-Regular.ttf',
    bold: '/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/modulos/modulosGenerales/fonts/Roboto-Medium.ttf',
    italics: '/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/modulos/modulosGenerales/fonts/Roboto-Italic.ttf',
    bolditalics: '/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/modulos/modulosGenerales/fonts/Roboto-MediumItalic.ttf'
  }
};


/* MODULOS REQUERIDOS */
// const db = require('../../db/db');
const db = require('./db/db');

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

var bodyData = [];
var dataRow = [];

module.exports = class CierreTurnoPDF{
    
    constructor(dataPDF, obj){
        console.log("CLASE PDF CIERRE DE TURNO");
        this.data = dataPDF;
        this.data.obj = obj;
        this.generar_pdf(this.data);
       
    }
    

    
  generar_pdf(data) {
      
      
      
    console.log('\tgenerando pdf' + JSON.stringify(data));

    var str1 = data.caras[0].mangueras[0];// cara 1 manguera 1
    var str2 = data.caras[0].mangueras[1];// cara 1 manguera 2
    var str3 = data.caras[1].mangueras[0];// cara 2 manguera 1
    var str4 = data.caras[1].mangueras[1];// cara 2 manguera 2
    var str5 = data.caras[0].mangueras[2];// cara 1 manguera 3
    var str6 = data.caras[1].mangueras[2];// cara 2 manguera 3

    
    var credito = data.ventacredito;
    var control = data.ventacontrol;
    var prepago = data.ventaprepago;
    var datafono = data.ventadatafono;
    var consignacion = data.consignaciones;
    
    var valorCreditos = 0;
    var valorControl = 0;
    var valorPrepago = 0;
    var valorDatafono = 0;
    var valorConsignaciones = 0;
    var valorVentaLecturas = 0;
    
    valorCreditos=0;
    data.ventacredito.forEach(c => {
        valorCreditos += parseInt(c.valor);
    });
    valorControl=0;
    data.ventacontrol.forEach(c => {
        valorControl += parseInt(c.valor);
    });
    valorPrepago=0;
    data.ventaprepago.forEach(c => {
        valorPrepago += parseInt(c.valor);
    });
    valorDatafono=0;
    data.ventadatafono.forEach(c => {
        valorDatafono += parseInt(c.valor);
    });
    valorConsignaciones = 0;
    data.consignaciones.forEach(c => {
                       
        if(c.valor > 0 ){
            valorConsignaciones += parseInt(c.valor);
        }
        if(c.anuladas > 0) {   // el dato anulado llega negativo
            valorConsignaciones -= parseInt(c.anuladas);
        }  
    });
   
    /*function save(){
        console.log('\tguardando path PDF');

        try{
            let sql = "INSERT INTO email_excel(tipo, path_excel, turno, islero, fecha, estado)VALUES(?,?,?,?,?,?)";
            let sqlArr = ['CIERRE', path, data.corteVenta, data.islero, data.fechaApe + ' ' + data.horaImp,1];
            db.execute(sql, sqlArr, err=>{ if(err) console.log(err); });
        }catch(e){ console.log(e); }
    }
 */
    function oca(c, r) {


        if(c=='ticket'){
            return r.ticket;
        } 
        if(c=='fecha'){
            return r.fecha_v;
        } 
        if(c=='fecha_c'){
            return r.fecha;
        } 
        if(c=='cliente'){
            return r.cliente.slice(0, 20);
        } 
        if(c=='placa'){
            return r.placa;
        }
        if(c=='cantidad'){
            return r.cantidad;
        }
        if(c=='valor'){
            return r.valor;
        }
        if(c=='id_C'){
            return r.id;
        }
        if(c=='anuladas'){
            return r.anuladas;
        }
    }  

    // Table body builder
    function buildTableBody(data, columns, showHeaders, headers) {
        var body = [];
        // Inserting headers
      
        if(showHeaders) {
        body.push(headers);
        } 

        // Inserting items from external data array
        data.forEach(function(row) {
            var dataRow = [];
            var i = 0 
        
             columns.forEach(function(column) { 
               
                //dataRow.push({text: '' });
                dataRow.push({text: oca(column,row) });
                i++;
            })
            body.push(dataRow);
           
        });

        return body;
    }  
     function c_produc (producto) {
         console.log("product0:" + producto)
        
        if (producto === undefined){
         console.log("Aqui!!");
         return '#3399ff';
        }
        if(producto == 'ACPM' || producto == 'DIESEL'){
         return '#f9b115';
        } 
        if(producto == 'CORRIENTE' || producto == 'MOTOR'){
         return '#e55353';
        }
        if(producto == 'EXTRA' || producto == 'SUPER'){
         return '#3399ff';
        }
        
     
     }
     
         
    // Func to return generated table
    function tabla(data, columns, witdhsDef, showHeaders, headers, layoutDef) {
        return {
            style: 'tableExample',
            fontSize: 8,
            table: {
                headerRows: 1,
                widths: witdhsDef,
                body: buildTableBody(data, columns, showHeaders, headers)
            },
            layout: layoutDef
        };
    }
      
    function tabla_totales () {
        if(data.cantcaras == 2 && data.cantmangueras == 1) {
             valorVentaLecturas=0;
             valorVentaLecturas=parseInt(str1[6]) + parseInt(str3[6]);
             return{
                style: 'tableExample',
                fontSize: 9,
                table: {
                        widths: ['11.5%', '12.5%', '14%','12.5%','14%','12.5%','11.5%','12.5%'],
                        headerRows: 1,
                    body: [
                        [{text: 'CARA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'},  {text: 'PRODUCTO', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'} ,{text: 'G. APERTURA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}  , {text: 'G. CIERRE', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$. APERTURA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$. CIERRE', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: 'G.TOTAL', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$ TOTAL', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}],
                        [{text: '1'}, str1[0]  , {text:str1[2],alignment:'right'}, {text:str1[3],alignment:'right'}, {text:str1[4],alignment:'right'}, {text:str1[5],alignment:'right'}, {text:str1[7],alignment:'right'},{text:str1[6],alignment:'right'}],
                        [{text: '2'}, str3[0]  , {text:str3[2],alignment:'right'}, {text:str3[3],alignment:'right'}, {text:str3[4],alignment:'right'}, {text:str3[5],alignment:'right'}, {text:str3[7],alignment:'right'},{text:str3[6],alignment:'right'}],
                        [{text:'TOTAL',  fillColor:c_produc(str1[0]),color:'#ffffff',bold:true,alignment:'right'},  
                         {text:str1[0],  fillColor:c_produc(str1[0]),color:'#ffffff',bold:true,alignment:'left'},
                         {border: [false, false, false, false],text:''},
                         {border: [false, false, false, false],text:''},
                         {border: [false, false, false, false],text:''},
                         {border: [false, false, false, false],text:''} ,
                         {text: 'TOTAL', style: 'tableHeader', fillColor:'#2eb85c', color: '#ffffff', alignment: 'right'},
                         {text: 'LECTURAS', style: 'tableHeader', fillColor:'#2eb85c', color: '#ffffff', alignment: 'left'},],
                         
                         
                        [{text:'G:' + parseFloat(parseFloat(str1[7])+parseFloat(str3[7])).toFixed(3), color: '#ffffff',bold:true, fillColor:c_produc(str1[0]),alignment:'right'},
                         {text:'$:' + parseInt(str1[6]+ str3[6])                                    , color: '#ffffff',bold:true, fillColor:c_produc(str1[0]),alignment:'left'}, 
                         {border: [false, false, false, false],text:''},
                         {border: [false, false, false, false],text:''}, 
                         {border: [false, false, false, false],text:''},
                         {border: [false, false, false, false],text:''},
                         {text:parseFloat(parseFloat(str1[7])+parseFloat(str3[7])).toFixed(2),color: '#ffffff',bold:true, fillColor:'#2eb85c',alignment:'right'},
                         {text:parseInt(str1[6]) + parseInt(str3[6]),color: '#ffffff',fillColor:'#2eb85c',bold:true,alignment:'left'}]]
                },layout: 'lightHorizontalLines'
            };
        }
   
         if(data.cantcaras == 2 && data.cantmangueras == 2) {
             valorVentaLecturas=0;
             valorVentaLecturas=parseInt(str2[6]) + parseInt(str4[6]) + parseInt(str1[6]) + parseInt(str3[6]);
             return{
                style: 'tableExample',
                fontSize: 9,
                table: {
                         widths: ['11.5%', '12.5%', '14%','12.5%','14%','12.5%','11.5%','12.5%'],
                        headerRows: 1,
                    body: [
                        [{text: 'CARA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'},  {text: 'PRODUCTO', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'} ,{text: 'G. APERTURA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}  , {text: 'G. CIERRE', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$. APERTURA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$. CIERRE', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: 'G.TOTAL', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$ TOTAL', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}],
                        [{rowSpan: 2, text: '1'}, str1[0]  , {text:str1[2],alignment:'right'}, {text:str1[3],alignment:'right'}, {text:str1[4],alignment:'right'}, {text:str1[5],alignment:'right'}, {text:str1[7],alignment:'right'},{text:str1[6],alignment:'right'}],
                        ['',                      str2[0]  , {text:str2[2],alignment:'right'}, {text:str2[3],alignment:'right'}, {text:str2[4],alignment:'right'}, {text:str2[5],alignment:'right'}, {text:str2[7],alignment:'right'},{text:str2[6],alignment:'right'}],
                        [{rowSpan: 2, text: '2'}, str3[0]  , {text:str3[2],alignment:'right'}, {text:str3[3],alignment:'right'}, {text:str3[4],alignment:'right'}, {text:str3[5],alignment:'right'}, {text:str3[7],alignment:'right'},{text:str3[6],alignment:'right'}],
                        ['',                      str4[0]  , {text:str4[2],alignment:'right'}, {text:str4[3],alignment:'right'}, {text:str4[4],alignment:'right'}, {text:str4[5],alignment:'right'}, {text:str4[7],alignment:'right'},{text:str4[6],alignment:'right'}],
                        [{text:'TOTAL',  fillColor:c_produc(str1[0]),color:'#ffffff',bold:true,alignment:'right'},  
                         {text:str1[0],  fillColor:c_produc(str1[0]),color:'#ffffff',bold:true,alignment:'left'},
                         {text:'TOTAL',  fillColor:c_produc(str2[0]),color:'#ffffff',bold:true,alignment:'right'},
                         {text:str2[0],  fillColor:c_produc(str2[0]),color:'#ffffff',bold:true,alignment:'left'},
                         {border: [false, false, false, false],text:''},
                         {border: [false, false, false, false],text:''} ,
                         {text: 'TOTAL', style: 'tableHeader', fillColor:'#2eb85c', color: '#ffffff', alignment: 'right'},
                         {text: 'LECTURAS', style: 'tableHeader', fillColor:'#2eb85c', color: '#ffffff', alignment: 'left'},],
                         
                         
                        [{text:'G:' + parseFloat(parseFloat(str1[7])+parseFloat(str3[7])).toFixed(3), color: '#ffffff',bold:true, fillColor:c_produc(str1[0]),alignment:'right'},
                         {text:'$:' + parseInt(str1[6]+ str3[6])                                    , color: '#ffffff',bold:true, fillColor:c_produc(str1[0]),alignment:'left'}, 
                         {text:'G:' + parseFloat(parseFloat(str2[7])+parseFloat(str4[7])).toFixed(3), color: '#ffffff',bold:true, fillColor:c_produc(str2[0]),alignment:'right'},
                         {text:'$:' + parseInt(str2[6]+str4[6]),                                      color: '#ffffff',bold:true, fillColor:c_produc(str2[0]),alignment:'left'}, 
                         {border: [false, false, false, false],text:''},
                         {border: [false, false, false, false],text:''},
                         {text:parseFloat(parseFloat(str2[7])+parseFloat(str4[7])+parseFloat(str1[7])+parseFloat(str3[7])).toFixed(2),color: '#ffffff',bold:true, fillColor:'#2eb85c',alignment:'right'},
                         {text: parseInt(str2[6]) + parseInt(str4[6]) + parseInt(str1[6]) + parseInt(str3[6]),color: '#ffffff',fillColor:'#2eb85c',bold:true,alignment:'left'}]]
                },layout: 'lightHorizontalLines'
            };
        }
        if(data.cantcaras == 2 && data.cantmangueras == 3) {
             valorVentaLecturas=0;
             valorVentaLecturas=parseInt(str2[6]) + parseInt(str4[6]) + parseInt(str1[6]) + parseInt(str3[6]) + parseInt(str5[6]) + parseInt(str6[6]);
             return{
                style: 'tableExample',
                fontSize: 9,
                table: {
                          widths: ['11.5%', '12.5%', '14%','12.5%','14%','12.5%','11.5%','12.5%'],
                        headerRows: 1,
                    body: [
                        [{text: 'CARA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'},  {text: 'PRODUCTO', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'} ,{text: 'G. APERTURA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}  , {text: 'G. CIERRE', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$. APERTURA', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$. CIERRE', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: 'G.TOTAL', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}, {text: '$ TOTAL', style: 'tableHeader', alignment: 'center',fillColor:'#636f83',color: '#FFFFFF'}],
                        [{rowSpan: 3, text: '1'}, str1[0]  , {text:str1[2],alignment:'right'}, {text:str1[3],alignment:'right'}, {text:str1[4],alignment:'right'}, {text:str1[5],alignment:'right'}, {text:str1[7],alignment:'right'},{text:str1[6],alignment:'right'}],
                        ['',                      str2[0]  , {text:str2[2],alignment:'right'}, {text:str2[3],alignment:'right'}, {text:str2[4],alignment:'right'}, {text:str2[5],alignment:'right'}, {text:str2[7],alignment:'right'},{text:str2[6],alignment:'right'}],
                        ['',                      str5[0]  , {text:str5[2],alignment:'right'}, {text:str5[3],alignment:'right'}, {text:str5[4],alignment:'right'}, {text:str5[5],alignment:'right'}, {text:str5[7],alignment:'right'},{text:str5[6],alignment:'right'}],
                        [{rowSpan: 3, text: '2'}, str3[0]  , {text:str3[2],alignment:'right'}, {text:str3[3],alignment:'right'}, {text:str3[4],alignment:'right'}, {text:str3[5],alignment:'right'}, {text:str3[7],alignment:'right'},{text:str3[6],alignment:'right'}],
                        ['',                      str4[0]  , {text:str4[2],alignment:'right'}, {text:str4[3],alignment:'right'}, {text:str4[4],alignment:'right'}, {text:str4[5],alignment:'right'}, {text:str4[7],alignment:'right'},{text:str4[6],alignment:'right'}],
                        ['',                      str6[0]  , {text:str6[2],alignment:'right'}, {text:str6[3],alignment:'right'}, {text:str6[4],alignment:'right'}, {text:str6[5],alignment:'right'}, {text:str6[7],alignment:'right'},{text:str6[6],alignment:'right'}],
                        [{text:'TOTAL',  fillColor:c_produc(str1[0]),color:'#ffffff',bold:true,alignment:'right'},  
                         {text:str1[0],  fillColor:c_produc(str1[0]),color:'#ffffff',bold:true,alignment:'left'},
                         {text:'TOTAL',  fillColor:c_produc(str2[0]),color:'#ffffff',bold:true,alignment:'right'},
                         {text:str2[0],  fillColor:c_produc(str2[0]),color:'#ffffff',bold:true,alignment:'left'},
                         {text:'TOTAL',  fillColor:c_produc(str5[0]),color:'#ffffff',bold:true,alignment:'right'},
                         {text:str5[0],  fillColor:c_produc(str5[0]),color:'#ffffff',bold:true,alignment:'left'} ,
                         {text: 'TOTAL', style: 'tableHeader', fillColor:'#2eb85c', color: '#ffffff', alignment: 'right'},
                         {text: 'LECTURAS', style: 'tableHeader', fillColor:'#2eb85c', color: '#ffffff', alignment: 'left'},],
                         
                         
                        [{text:'G:' + parseFloat(parseFloat(str1[7])+parseFloat(str3[7])).toFixed(3), color: '#ffffff',bold:true, fillColor:c_produc(str1[0]),alignment:'right'},
                         {text:'$:' + parseInt(str1[6]+ str3[6])                                    , color: '#ffffff',bold:true, fillColor:c_produc(str1[0]),alignment:'left'}, 
                         {text:'G:' + parseFloat(parseFloat(str2[7])+parseFloat(str4[7])).toFixed(3), color: '#ffffff',bold:true, fillColor:c_produc(str2[0]),alignment:'right'},
                         {text:'$:' + parseInt(str2[6]+str4[6]),                                      color: '#ffffff',bold:true, fillColor:c_produc(str2[0]),alignment:'left'}, 
                         {text:'G:' + parseFloat(parseFloat(str5[7])+parseFloat(str6[7])).toFixed(3), color: '#ffffff',bold:true, fillColor:c_produc(str5[0]),alignment:'right'},
                         {text:'$:' + parseInt(str5[6]+str6[6]),                                      color: '#ffffff',bold:true, fillColor:c_produc(str5[0]),alignment:'left'}, 
                         {text:parseFloat(parseFloat(str2[7])+parseFloat(str4[7])+parseFloat(str1[7])+parseFloat(str3[7])+parseFloat(str5[7])+parseFloat(str6[7])).toFixed(2),color: '#ffffff',bold:true, fillColor:'#2eb85c',alignment:'right'},
                         {text: parseInt(str2[6]) + parseInt(str4[6]) + parseInt(str1[6]) + parseInt(str3[6]) + parseInt(str5[6]) + parseInt(str6[6]),color: '#ffffff',fillColor:'#2eb85c',bold:true,alignment:'left'}]]
                },layout: 'lightHorizontalLines'
            };
        }
    
    }
    
    var docDefinition  = {
        
        content: [
            
            { 
			style: 'tableExample',
                table: {
                    widths: ['*', '*', 'auto','auto'],
                    heights: [30, 8, 8,20],
                    body: [
                        [{text: 'CIERRE DE TURNO DIGITAL', style: 'tableHeader', colSpan: 2, alignment: 'center',fontSize: 20}, 'Column 2', {image: 'building',width: 100, colSpan: 2,alignment: 'center'}, ''],
                        [{text: 'ATENDIO:' + data.islero.slice(0, 20), alignment: 'left'}, {text: data.nombreeds.slice(0, 20), alignment: 'center'}, {text: 'VERSION 7.5 BETA', style: 'tableHeader', colSpan: 2, alignment: 'center'}, ''],
                        ['FECHA APERTURA', 'FECHA CIERRE', {text:'EQUIPO:',alignment: 'center'}, {text:'TURNO:', alignment: 'center'}],
                        [{text:data.fechaApe + '  ' + data.horaApe,fontSize: 20}, {text:data.fechaImp + '  ' + data.horaImp,fontSize: 20}, {text: data.surtidor,alignment: 'center',fontSize: 20,bold: true,fillColor: '#0A7AFF',color: '#ffffff'}, {text: data.corteVenta,alignment: 'center',fontSize: 20,bold: true,fillColor: '#0A7AFF',color: '#ffffff'}],
                    ]
                }
            },
            {
                text: 'LECTURAS EQUIPO:', fontSize:9, bold: true, margin: [0, 10, 0, 0]
            },
        	
             tabla_totales (),

            {
                text: 'VENTAS TIPO CREDITO:', fontSize:9, bold: true, margin: [0, 10, 0, 0]
            },
            
            tabla(
                credito,['ticket','fecha','cliente', 'placa','cantidad', 'valor'],['10%', '22%','30%','14%','12%','12%'],true,
                [{text:'TICKET',    fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'FECHA',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'CLIENTE',   fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'PLACA',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'CANTIDAD',  fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'VALOR',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8}],'lightHorizontalLines'),            
            
            {
                 text: 'VENTAS TIPO CONTROL:', fontSize:9, bold: true, margin: [0, 10, 0, 0]
            },
            
            tabla(
                control,['ticket','fecha','cliente', 'placa','cantidad', 'valor'],['10%', '22%','30%','14%','12%','12%'],true,
                [{text:'TICKET',    fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'FECHA',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'CLIENTE',   fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'PLACA',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'CANTIDAD',  fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'VALOR',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8}],'lightHorizontalLines'),
                 
            {
                text: 'VENTAS TIPO PREPAGO:', fontSize:9, bold: true, margin: [0, 10, 0, 0]
            },
             
             tabla(
                prepago,['ticket','fecha','cliente', 'placa','cantidad', 'valor'],['10%', '22%','30%','14%','12%','12%'],true,
                [{text:'TICKET',    fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'FECHA',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'CLIENTE',   fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'PLACA',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'CANTIDAD',  fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'VALOR',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8}],'lightHorizontalLines'),
            
            {
                text: 'VENTAS TIPO DATAFONO:', fontSize:9, bold: true, margin: [0, 10, 0, 0]
            },
            
            tabla(
                datafono,['ticket','fecha','cliente', 'placa','cantidad', 'valor'],['10%', '22%','30%','14%','12%','12%'],true,
                [{text:'TICKET',    fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'FECHA',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'CLIENTE',   fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'PLACA',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'CANTIDAD',  fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                 {text:'VALOR',     fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8}],'lightHorizontalLines'),
            {
                text: '', fontSize:9, bold: true, margin: [0, 20, 0, 0]
            },
            {
			table: {
                widths: ['60%', '40%'],
                margin: [0, 10, 0, 0],
				body: [
					[{text:'CONSIGNACIONES',fontSize:9, bold: true, alignment: 'center'}, {text:'TOTALES',fontSize:9, bold: true, alignment: 'center'}],
					[
						  
                                tabla(
                                consignacion,['id_C','fecha_c','anuladas','valor'],['*', 'auto','*','*'],true,
                                [{text:'No',    fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                                 {text:'FECHA', fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                                 {text:'ANULADAS', fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8},
                                 {text:'VALOR', fillColor: '#636f83', color:'white', alignment: 'center',style: 'tableHeader',fontSize:8}],'lightHorizontalLines')
                        ,
						[
							
							{
                        table: {
                                  
                                    widths: ['auto', '*'],
                                    headerRows: 1,
                                    body: [
                                            [{text: 'ITEM',                         style: 'tableHeader', alignment: 'center',fontSize: 8,fillColor:'#636f83',color: '#FFFFFF'}, {text:'VALORES',style:'tableHeader',alignment:'center',fillColor:'#636f83',color:'#FFFFFF'}],
                                            [{text: 'VENTA POR LECTURAS',           style: 'tableHeader', alignment: 'left',fontSize: 8}, {text:'$:' + valorVentaLecturas, style: 'tableHeader',  alignment: 'rigth'}],
                                            [{text: 'VENTA CREDITOS',               style: 'tableHeader', alignment: 'left',fontSize: 8}, {text:'$:' + valorCreditos, style: 'tableHeader',  alignment: 'rigth'}],
                                            [{text: 'VENTA CONTROL',                style: 'tableHeader', alignment: 'left',fontSize: 8}, {text:'$:' + valorControl, style: 'tableHeader',  alignment: 'rigth'}],
                                            [{text: 'VENTA PREPAGO',                style: 'tableHeader', alignment: 'left',fontSize: 8}, {text:'$:' + valorPrepago, style: 'tableHeader',  alignment: 'rigth'}],
                                            [{text: 'VENTA DATAFONO',               style: 'tableHeader', alignment: 'left',fontSize: 8}, {text:'$:' + valorDatafono, style: 'tableHeader',  alignment: 'rigth'}],
                                            [{text: 'CONSIGNACIONES',               style: 'tableHeader', alignment: 'left',fontSize: 8}, {text:'$:' + valorConsignaciones, style: 'tableHeader',  alignment: 'rigth'}],
                                            [{text: 'TOTAL EFEECTIVO A ENTREGAR',   style: 'tableHeader', alignment: 'left',fontSize: 8,color: '#ffffff',fillColor:'#2eb85c',bold:true}, {text:'$:' +(valorVentaLecturas - valorCreditos - valorDatafono - valorConsignaciones - valorPrepago),color: '#ffffff',fillColor:'#2eb85c',bold:true, style: 'tableHeader',  alignment: 'rigth'}]],
                                
                                    },layout: 'lightHorizontalLines',
							}
						],
					]
				]
			},	layout: 'headerLineOnly'
		},
            
        ],
        styles: {
            header: {
                fontSize: 9,
                bold: true,
                margin: [0, 0, 0, 0]
            },
            subheader: {
                fontSize: 9,
                bold: true,
                margin: [0, 10, 0, 0]
            },
            tableExample: {
                margin: [0, 5, 0, 0]
            },
            tableHeader: {
                bold: true,
                fontSize: 9,
                color: 'black'
            }
        },
        defaultStyle: {
             alignment: 'justify'
        },
        images: {
                building: '/home/pi/TicketSoftConsoleGpio/puerto-serial-gpio/static/logo.png'
        }
        
    }



            
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('/home/pi/TicketSoftConsoleGpio/botticketsoft/archivos/pdfs/CIERRE_DISPENSADOR_' +data.surtidor + '_TURNO_' +data.corteVenta + '.pdf'));
    //var path = '/static/pdf/CIERRE' + data.corteVenta + '.pdf';
    pdfDoc.end();
    //save();
        
  }
}
