tconst es = require('event-stream');
const JSONStream = require('JSONStream');

const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'version', alias: 'v', type: String }
];

const args = commandLineArgs(optionDefinitions);
if(!args.version)
    version = '2019';
else
    version = args.version;

const parseCollection = require('./lib/parse' + version);
let collection = [];

process.stdin.setEncoding('utf8');
process.stdin
    .pipe(JSONStream.parse())
    .pipe(es.through( (data) => {
            collectObjects( data );
        },
        () => {
            const parsedObjects = parseCollection( collection );
            emitObjects(parsedObjects);
        }));

function collectObjects(data) {
    collection.push(data)
}

function emitObjects(objetos) {
    let persons_str = '';
    let orgs_str = '';
    let members_str = '';
    let areas_str = '';
    let delimiter = '[SPLIT]';

    objetos.persons.map( (person) => { persons_str += JSON.stringify(person) + '\n' } );
    objetos.orgs.map( (org) => { orgs_str += JSON.stringify(org) + '\n' } );
    objetos.memberships.map( (member) => { members_str += JSON.stringify(member) + '\n' } );
    objetos.areas.map( (area) => { areas_str += JSON.stringify(area) + '\n' } );

    process.stdout.write( persons_str + delimiter + orgs_str + delimiter + members_str + delimiter + areas_str, process.exit );
}
