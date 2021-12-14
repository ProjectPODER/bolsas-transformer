const { dateToISOString, reverseName, getBolsas, getCountryCode, cleanPersonName } = require('./util');
const laundry = require('company-laundry');

let persons = [];
let persons_index = [];
let orgs = [];
let orgs_index = [];
let memberships = [];
let memberships_index = [];
let areas = [];
let areas_index = [];

function parseCollection(collection) {
    // Crear todas las bolsas de valores de los distintos países...
    let bolsas = getBolsas();

    collection.map( (doc) => {
        let row = doc.body;
        let metadata = {
            source: [ {'id': 'mujeres2019'} ],
            sourceRun: [ {'id': 'mujeres2019-' + Date.now()} ]
        }
        if(row.PERSONA == '-') row.PERSONA = 'Persona sin nombre';
        if(row.PAIS == '') return null;

        let countryCode = getCountryCode(row.PAIS);
        let orgID = laundry.simpleName(laundry.launder(row.EMPRESA));
        let person_name = cleanPersonName(row.PERSONA);
        let personID = laundry.simpleName(laundry.launder(person_name));
        let bolsa = getBolsaData(bolsas, countryCode, orgID);

        if(isArea(laundry.simpleName(countryCode), areas_index) < 0) {
            let area = createArea(countryCode, row.PAIS, metadata);
            areas.push(area);
            areas_index.push(area.id);
        }

        if(isOrg(bolsa.id, orgs_index) < 0) {
            orgs.push(bolsa);
            orgs_index.push(bolsa.id);
        }

        let org = null;
        if(isOrg(orgID + '-' + countryCode, orgs_index) < 0) {
            org = createOrg(row, metadata);
            orgs.push(org);
            orgs_index.push(org.id + '-' + countryCode);
        }
        else {
            org = orgs[isOrg(orgID  + '-' + countryCode, orgs_index)];
        }

        let person = null;
        if(isPerson(personID + '-' + countryCode, persons_index) < 0) {
            person = createPerson(row, metadata);
            persons.push(person);
            persons_index.push(person.id + '-' + countryCode);
        }
        else {
            person = persons[isPerson(personID + '-' + countryCode, persons_index)];
        }

        let memberID = orgID + '_' + personID + '-bm';
        if(isMember(memberID, memberships_index) < 0) {
            let membership = createMember(memberID, row, metadata);
            memberships.push(membership);
            memberships_index.push(membership);
        }

        let companyStockMemberID = bolsa.id + '_' + org.id + '-se';
        if(isMember(companyStockMemberID, memberships_index) < 0) {
            let companyStockMembership = createCompanyStockMember(companyStockMemberID, org, bolsa, metadata);
            memberships.push(companyStockMembership);
            memberships_index.push(companyStockMemberID);
        }

        let personStockMemberID = bolsa.id + '_' + person.id + '-se';
        if(isMember(personStockMemberID, memberships_index) < 0) {
            let personStockMembership = createPersonStockMember(personStockMemberID, person, bolsa, metadata);
            memberships.push(personStockMembership);
            memberships_index.push(personStockMemberID);
        }
    } );

    return { "persons": persons, "orgs": orgs, "memberships": memberships, "areas": areas };
}

function getBolsaData(bolsas, country, companyID) {
    switch(country) {
        case 'AR':
        case 'BO':
        case 'BR':
        case 'CL':
        case 'CO':
        case 'CR':
        case 'EC':
        case 'ES':
        case 'GT':
        case 'NI':
        case 'PA':
        case 'PE':
        case 'PY':
        case 'SV':
            return bolsas[country];
        case 'MX':
            switch(companyID) {
                case 'grupo-axo-sapi-de-cv':
                case 'bbva-bancomer-sa-institucion-de-banca-multiple-grupo-financiero-bbva-bancomer':
                case 'banco-nacional-de-obras-y-servicios-publicos-sociedad-nacional-de-credito-institucion-de-banca-de-desarrollo':
                case 'comision-federal-de-electricidad':
                case 'citibanamex-casa-de-bolsa-sa-de-cv-casa-de-bolsa-integrante-del-grupo-financiero-citibanamex':
                case 'consubanco-sa-institucion-de-banca-multiple':
                case 'fondo-especial-para-financiamientos-agropecuarios':
                case 'grupo-viva-aerobus-sa-de-cv':
                case 'hsbc-mexico-sa-institucion-de-banca-multiple-grupo-financiero-hsbc':
                case 'sofoplus-sapi-de-cv-sociedad-financiera-de-objeto-multiple-entidad-regulada':
                case 'xignux-sa-de-cv':
                    return bolsas[country + '2'];
                default:
                    return bolsas[country];
            }
            break;
        case 'UY':
            switch(companyID) {
                case 'administracion-nacional-de-usinas-y-trasmisiones-electricas':
                case 'banco-hipotecario-del-uruguay':
                case 'banco-bilbao-vizcaya-argentaria-uruguay-sa':
                case 'cledinor-sa':
                case 'cooperativa-nacional-de-productores-de-leche':
                case 'hru-sa':
                case 'hsbc-bank-uruguay-sa':
                case 'puerta-del-sur-sa':
                case 'san-roque-sa':
                case 'scotiabank-uruguay-sa':
                case 'unidad-punta-de-rieles-sa':
                    return bolsas[country + '2'];
                default:
                    return bolsas[country];
            }
            break;
    }
}

function isOrg(org_id, index) {
    return index.indexOf(org_id);
}

function createOrg(row, metadata) {
    let country = getCountryCode(row.PAIS);
    let org = {
        "id": laundry.simpleName(laundry.launder(row.EMPRESA)),
        "name": row.EMPRESA,
        "classification": ["company"],
        "area": [{
            "id": laundry.simpleName(country),
            "name": row.PAIS,
            "classification": ["country"]
        }]
    };

    Object.assign(org, metadata)

    return org;
}

function isMember(member_id, index) {
    return index.indexOf(member_id);
}

function createMember(id, row, metadata) {
    let cleanName = cleanPersonName(row.PERSONA);
    let membership = {
        id: id,
        role: 'Boardmember',
        organization_id: laundry.simpleName(laundry.launder(row.EMPRESA)),
        organization_name: row.EMPRESA,
        organization_class: 'company',
        parent_id: laundry.simpleName(laundry.launder(cleanName)),
        parent_name: cleanName,
        parent_class: 'boardmember',
        title: row.CARGO
    };

    Object.assign(membership, metadata);

    return membership;
}

// Membership de empresa a bolsa
function createCompanyStockMember(id, org, bolsa, metadata) {
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

// Membership de persona a bolsa
function createPersonStockMember(id, person, bolsa, metadata) {
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
    let country = getCountryCode(row.PAIS);
    let cleanName = cleanPersonName(row.PERSONA);
    let person = {
        "id": laundry.simpleName(laundry.launder(cleanName)),
        "name": cleanName,
        "gender": row.GENERO,
        "classification": ["boardmember"],
        "area": [{
            "id": laundry.simpleName(country),
            "name": row.PAIS,
            "classification": ["country"]
        }]
    };

    Object.assign(person, metadata);

    return person;
}

function isPerson(person_id, index) {
    return index.indexOf(person_id);
}

function createArea(id, name, metadata) {
    let area = {
        "id": laundry.simpleName(id),
        "name": name,
        "classification": ["country"]
    }

    Object.assign(area, metadata);

    return area;
}

function isArea(area_id, index) {
    return index.indexOf(area_id);
}

module.exports = parseCollection;
