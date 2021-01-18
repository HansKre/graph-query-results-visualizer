import './dependencies/neovis_1.5.0.js';

export const drawGraph = (config, targetDiv, query) => {
    const labelsCaption = (node) => {
        return node.properties.name; // + ': ' + node.labels[0];
    }

    // https://github.com/neo4j-contrib/neovis.js
    var neoVisConfig = {
        container_id: targetDiv.id,
        server_url: config.DB_URL + ':' + config.DB_PORT,
        server_user: config.DB_USER,
        server_password: config.DB_PWD,
        labels: {
            [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
                "caption": labelsCaption
            }
        },
        relationships: {
            [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
                "caption": false,
            }
        },
        arrows: true,
        initial_cypher: query.cypher
    };

    let neoVis = new NeoVis.default(neoVisConfig);
    neoVis.render();
}

// alternative graphin library: https://js.cytoscape.org/