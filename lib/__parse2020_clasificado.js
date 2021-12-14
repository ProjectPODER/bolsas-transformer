const { dateToISOString, reverseName } = require('./util');
const laundry = require('company-laundry');

let persons = [];
let persons_index = [];
let orgs = [];
let orgs_index = [];
let memberships = [];
let memberships_index = [];

function parseCollection(collection) {
    // Crear todas las bolsas de valores de los distintos países...
    let bolsas = getBolsas();

    collection.map( (doc) => {
        let row = doc.body;
        let metadata = {
            source: [ {'id': 'mujeres2020'} ],
            sourceRun: [ {'id': 'mujeres2020-' + Date.now()} ]
        }
        if(row.Pais == '') return null;
        let pais = getCountryCode(row.Pais);
        
        if(isOrg(bolsas[pais].id, orgs_index) < 0) {
            orgs.push(bolsas[pais]);
            orgs_index.push(bolsas[pais].id);
        }

        let org = null;
        if(isOrg(laundry.simpleName(laundry.launder(row.Empresa)) + '-' + row.Pais, orgs_index) < 0) {
            org = createOrg(row, metadata);
            orgs.push(org);
            orgs_index.push(org.id + '-' + row.Pais);
        }
        else {
            org = orgs[isOrg(laundry.simpleName(laundry.launder(row.Empresa)) + '-' + row.Pais, orgs_index)];
        }

        let person = null;
        let person_name = cleanPersonName(row.Persona);
        if(isPerson(laundry.simpleName(laundry.launder(row.Persona)) + '-' + row.Pais, persons_index) < 0) {
            person = createPerson(row, metadata);
            persons.push(person);
            persons_index.push(person.id + '-' + row.Pais);
        }
        else {
            person = persons[isPerson(laundry.simpleName(laundry.launder(row.Persona)) + '-' + row.Pais, persons_index)];
        }

        let memberID = laundry.simpleName(laundry.launder(row.Empresa)) + '_' + laundry.simpleName(laundry.launder(row.Persona)) + '-bm';
        if(isMember(memberID, memberships_index) < 0) {
            let membership = createMember(memberID, row, metadata);
            memberships.push(membership);
            memberships_index.push(memberID);
        }

        let companyStockMemberID = laundry.simpleName(laundry.launder(bolsas[pais].id)) + '_' + org.id + '-se';
        if(isMember(companyStockMemberID, memberships_index) < 0) {
            let companyStockMembership = createCompanyStockMember(companyStockMemberID, org, bolsas[pais], metadata);
            memberships.push(companyStockMembership);
            memberships_index.push(companyStockMemberID);
        }

        let personStockMemberID = laundry.simpleName(laundry.launder(bolsas[pais].id)) + '_' + person.id + '-se';
        if(isMember(personStockMemberID, memberships_index) < 0) {
            let personStockMembership = createPersonStockMember(personStockMemberID, person, bolsas[pais], metadata);
            memberships.push(personStockMembership);
            memberships_index.push(personStockMemberID);
        }
    } );

    return { "persons": persons, "orgs": orgs, "memberships": memberships };
}

function getBolsas() {
    let bolsas = [];

    bolsas['AR'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Comercio de Buenos Aires')),
        name: 'Bolsa de Comercio de Buenos Aires',
        other_names: [{name:'BOLSAR'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'ar',
            name: 'AR',
            classification: 'country'
        }],
        links: [{id:'https://www.bolsar.com'}]
    }
    bolsas['BO'] = {
        id: laundry.simpleName(laundry.launder('Bolsa Boliviana de Valores S.A.')),
        name: 'Bolsa Boliviana de Valores S.A.',
        other_names: [{name:'BBV'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'bo',
            name: 'BO',
            classification: 'country'
        }],
        links: [{id: 'https://www.bbv.com.bo'}]
    }
    bolsas['BR'] = {
        id: laundry.simpleName(laundry.launder('Brasil Bolsa Balcão')),
        name: 'Brasil Bolsa Balcão',
        other_names: [{name:'B3'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'br',
            name: 'BR',
            classification: 'country'
        }],
        links: [{id: 'http://www.b3.com.br'}]
    }
    bolsas['CL'] = {
        id: laundry.simpleName(laundry.launder('Comisión para el Mercado Financiero')),
        name: 'Comisión para el Mercado Financiero',
        other_names: [{name:'CMF'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'cl',
            name: 'CL',
            classification: 'country'
        }],
        links: [{id: 'http://www.cmfchile.cl'}]
    }
    bolsas['CO'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Colombia')),
        name: 'Bolsa de Valores de Colombia',
        other_names: [{name:'BVC'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'co',
            name: 'CO',
            classification: 'country'
        }],
        links: [{id: 'https://www.bvc.com.co'}]
    }
    bolsas['CR'] = {
        id: laundry.simpleName(laundry.launder('Bolsa Nacional de Valores')),
        name: 'Bolsa Nacional de Valores',
        other_names: [{name:'BNV'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'cr',
            name: 'CR',
            classification: 'country'
        }],
        links: [{id: 'https://www.bolsacr.com'}]
    }
    bolsas['SV'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de El Salvador S.A. de C.V.')),
        name: 'Bolsa de Valores de El Salvador S.A. de C.V.',
        other_names: [{name:'BVES'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'sv',
            name: 'SV',
            classification: 'country'
        }],
        links: [{id: 'https://www.bolsadevalores.com.sv'}]
    }
    bolsas['MX'] = {
        id: laundry.simpleName(laundry.launder('Bolsa Mexicana de Valores')),
        name: 'Bolsa Mexicana de Valores',
        other_names: [{name: 'BMV'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'mx',
            name: 'MX',
            classification: "country"
        }],
        links: [{id: 'https://www.bmv.com.mx'}]
    }
    bolsas['PA'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Panamá')),
        name: 'Bolsa de Valores de Panamá',
        other_names: [{name: 'BVPA'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'pa',
            name: 'PA',
            classification: "country"
        }],
        links: [{id: 'https://www.panabolsa.com'}]
    }
    bolsas['PY'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores y Productos de Asunción S.A.')),
        name: 'Bolsa de Valores y Productos de Asunción S.A.',
        other_names: [{name: 'BVPASA'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'py',
            name: 'PY',
            classification: "country"
        }],
        links: [{id: 'http://www.bvpasa.com.py'}]
    }
    bolsas['PE'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Lima S.A.A.')),
        name: 'Bolsa de Valores de Lima S.A.A.',
        other_names: [{name: 'BVL'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'pe',
            name: 'PE',
            classification: "country"
        }],
        links: [{id: 'https://www.bvl.com.pe'}]
    }
    bolsas['UY'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Montevideo')),
        name: 'Bolsa de Valores de Montevideo',
        other_names: [{name:'BVM'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'uy',
            name: 'UY',
            classification: 'country'
        }],
        links: [{id: 'https://www.bvm.com.uy'}]
    }
    bolsas['ES'] = {
        id: laundry.simpleName(laundry.launder('Comisión Nacional del Mercado de Valores')),
        name: 'Comisión Nacional del Mercado de Valores',
        other_names: [{name:'CNMV'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'es',
            name: 'ES',
            classification: 'country'
        }],
        links: [{id: 'https://www.cnmv.es'}]
    }
    bolsas['EC'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Guayaquil')),
        name: 'Bolsa de Valores de Guayaquil',
        other_names: [{name:'BVG'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'ec',
            name: 'EC',
            classification: 'country'
        }],
        links: [{id: 'https://www.bolsadevaloresguayaquil.com'}]
    }
    bolsas['NI'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores de Nicaragua')),
        name: 'Bolsa de Valores de Nicaragua',
        other_names: [{name:'BVN'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'ni',
            name: 'NI',
            classification: 'country'
        }],
        links: [{id: 'https://www.bolsanic.com'}]
    }
    bolsas['GT'] = {
        id: laundry.simpleName(laundry.launder('Bolsa de Valores Nacional de Guatemala')),
        name: 'Bolsa de Valores Nacional de Guatemala',
        other_names: [{name:'BVN'}],
        classification: 'company',
        subclassification: 'stock-exchange',
        area: [{
            id: 'gt',
            name: 'GT',
            classification: 'country'
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
            .replace(/-/, '')
            .replace(/^sr\.?\s/i, '')
            .replace(/^don\s/i, '')
            .replace(/^doña\s/i, '')
            .replace(/ingeniero/i, '')
            .replace(/arquitecto/i, '')
            .replace(/contador publico/i, '')
            .replace(/actuario/i, '')
            .replace(/^ing\.?\s/i, '')
            .replace(/\s\./, '')
            .replace(/^\.\s/, '')
            .replace(/^señor/i, '')
            .trim();
}

function isOrg(org_id, index) {
    return index.indexOf(org_id);
}

function createOrg(row, metadata) {
    let country = getCountryCode(row.Pais);
    let org = {
        "id": laundry.simpleName(laundry.launder(row.Empresa)),
        "name": row.Empresa,
        "classification": "company",
        "area": [{
            "id": laundry.simpleName(country),
            "name": country,
            "classification": "country"
        }]
    };

    Object.assign(org, metadata);
    return org;
}

function isMember(member_id, index) {
    return index.indexOf(member_id);
}

function createMember(id, row, metadata) {
    let membership = {
        id: id,
        role: row.Rol,
        organization_id: laundry.simpleName(laundry.launder(row.Empresa)),
        organization_name: row.Empresa,
        organization_class: 'company',
        parent_id: laundry.simpleName(laundry.launder(row.Persona)),
        parent_name: row.Persona,
        parent_class: 'person',
        title: row.Cargo
    };

    Object.assign(membership, metadata);

    return membership;
}

function createCompanyStockMember(id, org, bolsa, metadata) {
    // Membership de empresa a bolsa
    let companyStockMemberID = bolsa.id + '_' + org.id + '-se';
    let companyStockMembership = {
        id: companyStockMemberID,
        role: "Emisor de Acciones",
        organization_id: org.id,
        organization_name: org.name,
        organization_class: "company",
        parent_id: bolsa.id,
        parent_name: bolsa.name,
        parent_class: "company",
        parent_subclass: "stock-exchange"
    }

    Object.assign(companyStockMembership, metadata);
    return companyStockMembership;
}

function createPersonStockMember(id, person, bolsa, metadata) {
    // Memberships de persona a bolsa
    let personStockMemberID = bolsa.id + '_' + person.id + '-se';
    let personStockMembership = {
        id: personStockMemberID,
        role: "Consejero de Emisor de Acciones",
        person_id: person.id,
        person_name: person.name,
        parent_id: bolsa.id,
        parent_name: bolsa.name,
        parent_class: "company",
        parent_subclass: "stock-exchange"
    }

    Object.assign(personStockMembership, metadata);
    return personStockMembership;
}

function createPerson(row, metadata) {
    let country = getCountryCode(row.Pais);
    let person = {
        "id": laundry.simpleName(laundry.launder(row.Persona)),
        "name": row.Persona,
        "classification": "person",
        "gender": row.Genero,
        "area": [{
            "id": laundry.simpleName(country),
            "name": country,
            "classification": "country"
        }]
    };

    Object.assign(person, metadata);

    return person;
}

function isPerson(person_id, index) {
    return index.indexOf(person_id);
}

module.exports = parseCollection;
