// uses http://tabulator.info/
// import * as neo4j from './dependencies/neo4j-web_4.2.1.js';
// we cannot specify any imports, since there are no exports (it's not structured as a module)
import './dependencies/neo4j-web_4.2.1.js'; //neo4j driver
import Tabulator from './dependencies/tabulator.es2015.min.js';

export const drawTable = (config, targetDiv, query) => {
    // create driver & session
    const driver = neo4j.driver(config.DB_URL, neo4j.auth.basic(config.DB_USER, config.DB_PWD));
    // create own session for each query, otherwise we'll receive following error:
    // Neo4jError: Queries cannot be run directly on a session with an open transaction; either run from within the transaction or use a different session.
    const session = driver.session({ database: config.DB_NAME });
    session
        // run query
        .run(query.cypher)
        // visualize result
        .then(function (result) {
            // visualize result
            const rows = result.records.map(record => {
                let row = {};
                if (config.DEBUG) console.log(record);
                record.keys.forEach(key => {
                    const val = record.get(key);
                    if (config.DEBUG) console.log('key:', key, 'Type:', key.constructor.name, 'val:', val, 'Type:', val && val.constructor.name);
                    if (val === null) {
                        row[replaceDots(key)] = 'null';
                    } else if (val.constructor.name == 'Node') {
                        let labels = '';
                        // join labels if configured to show
                        if (config.NODE_SHOW_LABELS)
                            labels = val.labels.join(' , ');
                        // extract url before stringifying the object
                        if (val.properties.hasOwnProperty(config.NODE_URL_PROPERTY)) {
                            row[config.NODE_URL_PROPERTY] = val.properties[config.NODE_URL_PROPERTY];
                            delete val.properties[config.NODE_URL_PROPERTY]; + JSON.stringify(val.properties);
                        }
                        // remove key if there is only one property
                        let propertiesStr;
                        if (Object.keys(val.properties).length === 1) {
                            propertiesStr = Object.values(val.properties)[0];
                        } else {
                            propertiesStr = JSON.stringify(val.properties).replace('{', '').replace('}', '').replace('","', '" , "');
                        }
                        row[replaceDots(key)] = labels + propertiesStr;
                    } else if (val.constructor.name == 'Relationship') {
                        row[replaceDots(key)] = val.type + ' , ' + JSON.stringify(val.properties);
                    } else if (val.constructor.name == 'String') {
                        row[replaceDots(key)] = val;
                    } else if (val.constructor.name == 'Array') {
                        row[replaceDots(key)] = (val.length != 0) ? val : '[]';
                    } else if (val.constructor.name == 'Integer') {
                        row[replaceDots(key)] = val.toString();
                    }
                    else {
                        console.log('unsupported type', key, val, val.constructor.name);
                    }
                });
                return row;
            });
            // close session as soon as we have the data
            session.close();
            // populate with http://tabulator.info/docs/4.9/data
            const table = new Tabulator(targetDiv, {
                data: rows,
                layout: "fitDataFill",
                autoColumns: true,
                autoColumnsDefinitions: function (definitions) {
                    // http://tabulator.info/docs/4.9/columns#autocolumns

                    const urlColumn = definitions.find(column => {
                        return column.field == config.NODE_URL_PROPERTY;
                    });

                    if (urlColumn) {

                        urlColumn.visible = false;

                        const firstColumn = definitions.find(column => column.field != config.NODE_URL_PROPERTY);
                        if (firstColumn) {
                            firstColumn.formatter = "link";
                            firstColumn.formatterParams = {
                                urlField: config.NODE_URL_PROPERTY,
                                target: "_blank",
                            }
                        }
                    }

                    return definitions;
                },
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

const replaceDots = (key) => {
    // keys are used as column names in the table
    // replace dots otherwise table breaks
    return key.replace('.', '#');
}