# bolsas-transformer

Transforms data scraped by [scraper-bolsas](https://github.com/ProjectPODER/scraper-bolsas) into Popolo standard in JSON.

## Usage

    cat CSV_FILE | node index.js -v VERSION

## Options

    --version       -v      Selects between versions of the dataset (options are 2019 and 2020).

## Details

The input CSV file includes data previously scraped by scaper-bolsas and then processed to add information on gender. The format has 2 versions: 2019 and 2020.

The structure for the 2019 CSV file contains the following columns:

- PERSONA
- GENERO
- CARGO
- EMPRESA
- PAIS
- EmpresaPais

For 2020, the CSV contains the following columns:

- PersonaOriginal
- Rol
- Cargo
- Empresa
- Paises
- Genero
- Pais
- EmpPais
- NumFxEmp
- NombresEnMinusculas
- Persona
- NombresEmpresas

This script receives a CSV file through stdin and outputs JSON documents in Popolo format for persons, organizations, and memberships. Each collection is sent to stdout as a stream of JSON objects, one object per line, and split using a special delimiter string: **[SPLIT]**. The output order is persons, organizations, and memberships.
