const removeDiacritics = require('diacritics').remove;
const _ = require('lodash');
const laundry = require('company-laundry');

function repairDate(string) {
    var [ date, time ] = string.split(' ');
    var [ month, day, year ] = date.split('/');

    if(!year || !day || !month) return '';

    if(year.length == 2) year = '20' + year;
    return year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0') + ((time)? ' ' + time : '');
}

function dateToISOString(string) {
  if(string.indexOf('/') >= 0) string = repairDate(string);
  if(string == '') return string;

  if(string.length < 5) return string;
  var pattern = /[^/\w-]|_/g;
  if(string.match(pattern)) string = string.replace(pattern, '');

  const [ date, time ] = string.split(' ');
  const [ year, month, day ] = date.split('-');
  if (time) {
    const [ hour, minute, second ] = time.split(':');
    if (second) {
      return new Date(Date.UTC(year, (+month -1), day, hour, minute, second)).toISOString();
    }
    // console.log(year, (+month -1), day, hour, minute);
    return new Date(Date.UTC(year, (+month -1), day, hour, minute)).toISOString();
  }
  return new Date(Date.UTC(year, (+month -1), day)).toISOString();

}

function reverseName(string) {
    if(string.indexOf(',')) {
        let parts = string.split(',');
        parts = parts.map( part => part.trim() );
        let first_name = parts.pop();
        string = first_name + ' ' + parts.join(' ');
    }
    return string;
}

function getBolsas() {
    let bolsas = [];

    bolsas['AR'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Comercio de Buenos Aires')),
        name: 'Bolsa de Comercio de Buenos Aires',
        other_names: [{name:'BOLSAR'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'ar',
            name: 'Argentina',
            classification: ['country']
        }],
        links: [{id:'https://www.bolsar.com'}]
    }
    bolsas['BO'] = {
        id: laundry.simpleName(laundry.launder('Bolsa Boliviana de Valores S.A.')),
        name: 'Bolsa Boliviana de Valores S.A.',
        other_names: [{name:'BBV'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'bo',
            name: 'Bolivia',
            classification: ['country']
        }],
        links: [{id: 'https://www.bbv.com.bo'}]
    }
    bolsas['BR'] = {
        id: laundry.simpleName(laundry.launder('Brasil Bolsa Balcão')),
        name: 'Brasil Bolsa Balcão',
        other_names: [{name:'B3'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'br',
            name: 'Brasil',
            classification: ['country']
        }],
        links: [{id: 'http://www.b3.com.br'}]
    }
    bolsas['CL'] = {
        id: laundry.simpleName(laundry.launder('Comisión para el Mercado Financiero')),
        name: 'Comisión para el Mercado Financiero',
        other_names: [{name:'CMF'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'cl',
            name: 'Chile',
            classification: ['country']
        }],
        links: [{id: 'http://www.cmfchile.cl'}]
    }
    bolsas['CO'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Colombia')),
        name: 'Bolsa de Valores de Colombia',
        other_names: [{name:'BVC'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'co',
            name: 'Colombia',
            classification: ['country']
        }],
        links: [{id: 'https://www.bvc.com.co'}]
    }
    bolsas['CR'] = {
        id: laundry.simpleName(laundry.launder('Bolsa Nacional de Valores')),
        name: 'Bolsa Nacional de Valores',
        other_names: [{name:'BNV'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'cr',
            name: 'Costa Rica',
            classification: ['country']
        }],
        links: [{id: 'https://www.bolsacr.com'}]
    }
    bolsas['SV'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de El Salvador S.A. de C.V.')),
        name: 'Bolsa de Valores de El Salvador S.A. de C.V.',
        other_names: [{name:'BVES'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'sv',
            name: 'El Salvador',
            classification: ['country']
        }],
        links: [{id: 'https://www.bolsadevalores.com.sv'}]
    }
    bolsas['MX'] = {
        id: laundry.simpleName(laundry.launder('Bolsa Mexicana de Valores')),
        name: 'Bolsa Mexicana de Valores',
        other_names: [{name: 'BMV'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'mx',
            name: 'México',
            classification: ["country"]
        }],
        links: [{id: 'https://www.bmv.com.mx'}]
    }
    bolsas['MX2'] = {
        id: laundry.simpleName(laundry.launder('Bolsa Institucional de Valores')),
        name: 'Bolsa Institucional de Valores',
        other_names: [{name: 'BIVA'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'mx',
            name: 'México',
            classification: ["country"]
        }],
        links: [{id: 'https://www.biva.mx'}]
    }
    bolsas['PA'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Panamá')),
        name: 'Bolsa de Valores de Panamá',
        other_names: [{name: 'BVPA'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'pa',
            name: 'Panamá',
            classification: ["country"]
        }],
        links: [{id: 'https://www.panabolsa.com'}]
    }
    bolsas['PY'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores y Productos de Asunción S.A.')),
        name: 'Bolsa de Valores y Productos de Asunción S.A.',
        other_names: [{name: 'BVPASA'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'py',
            name: 'Paraguay',
            classification: ["country"]
        }],
        links: [{id: 'http://www.bvpasa.com.py'}]
    }
    bolsas['PE'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Lima S.A.A.')),
        name: 'Bolsa de Valores de Lima S.A.A.',
        other_names: [{name: 'BVL'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'pe',
            name: 'Perú',
            classification: ["country"]
        }],
        links: [{id: 'https://www.bvl.com.pe'}]
    }
    bolsas['UY'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Montevideo')),
        name: 'Bolsa de Valores de Montevideo',
        other_names: [{name:'BVM'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'uy',
            name: 'Uruguay',
            classification: ['country']
        }],
        links: [{id: 'https://www.bvm.com.uy'}]
    }
    bolsas['UY2'] = {
        id: laundry.simpleName(laundry.launder('Bolsa Electrónica de Valores del Uruguay')),
        name: 'Bolsa Electrónica de Valores del Uruguay',
        other_names: [{name:'BEVSA'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'uy',
            name: 'Uruguay',
            classification: ['country']
        }],
        links: [{id: 'https://web.bevsa.com.uy'}]
    }
    bolsas['ES'] = {
        id: laundry.simpleName(laundry.launder('Comisión Nacional del Mercado de Valores')),
        name: 'Comisión Nacional del Mercado de Valores',
        other_names: [{name:'CNMV'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'es',
            name: 'España',
            classification: ['country']
        }],
        links: [{id: 'https://www.cnmv.es'}]
    }
    bolsas['EC'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Guayaquil')),
        name: 'Bolsa de Valores de Guayaquil',
        other_names: [{name:'BVG'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'ec',
            name: 'Ecuador',
            classification: ['country']
        }],
        links: [{id: 'https://www.bolsadevaloresguayaquil.com'}]
    }
    bolsas['NI'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Nicaragua')),
        name: 'Bolsa de Valores de Nicaragua',
        other_names: [{name:'BVN'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'ni',
            name: 'Nicaragua',
            classification: ['country']
        }],
        links: [{id: 'https://www.bolsanic.com'}]
    }
    bolsas['GT'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores Nacional de Guatemala')),
        name: 'Bolsa de Valores Nacional de Guatemala',
        other_names: [{name:'BVN'}],
        classification: ['company'],
        subclassification: ['stock-exchange'],
        area: [{
            id: 'gt',
            name: 'Guatemala',
            classification: ['country']
        }],
        links: [{id: 'https://www.bvnsa.com.gt'}]
    }

    return bolsas;
}

function getCountryCode(country) {
    switch(country) {
        case "Argentina": return "AR";
        case "Bolivia": return "BO";
        case "Brasil": return "BR";
        case "Chile": return "CL";
        case "Colombia": return "CO";
        case "Costa Rica": return "CR";
        case "Ecuador": return "EC";
        case "El Salvador": return "SV";
        case "España": return "ES";
        case "Guatemala": return "GT";
        case "México": return "MX";
        case "Nicaragua": return "NI";
        case "Panamá": return "PA";
        case "Paraguay": return "PY";
        case "Perú": return "PE";
        case "Uruguay": return "UY";
        default:
            console.log("Country not found!");
            return "";
    }
}

function cleanPersonName(string) {
    return string
            .replace(/^\w{2,}\.\s+/g, '')
            .replace(/^c\.?p\.?\s/i, '')
            .replace(/@/, '')
            .replace(/^lic\.?\s/i, '')
            .replace(/^sra?\.?\s/i, '')
            .replace(/^don\s/i, '')
            .replace(/^doña\s/i, '')
            .replace(/^dña\.\s/i, '')
            .replace(/^consejer(o|a)/i, '')
            .replace(/^consejo de/i, '')
            .replace(/^ingeniero/i, '')
            .replace(/^arquitecto/i, '')
            .replace(/^contador publico/i, '')
            .replace(/^director suplente/i, '')
            .replace(/^director titular/i, '')
            .replace(/^actuario/i, '')
            .replace(/^suplente/i, '')
            .replace(/^agr.?nomo/i, '')
            .replace(/^ing\.?\s/i, '')
            .replace(/^d\.\s?/i, '')
            .replace(/^\.\s/, '')
            .replace(/^señor/i, '')
            .replace(/\s(\.|,|-)$/i, '')
            .trim()
            .replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase()
            });
}

module.exports = { dateToISOString, reverseName, getBolsas, getCountryCode, cleanPersonName }
