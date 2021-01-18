// Reset DB
// The ; waits for the command to finish before script execution continues
MATCH (n) DETACH DELETE n;

//********************************//
//*********** ENTITIES ***********//
//********************************//

// Application Components
CREATE (xyz:ApplicationComponent {name: 'XYZ'})

// APIs
CREATE (myApi:API {name: 'My API', description: 'https://...'})

// API Interfaces (Endpoints)
CREATE (someIf:Endpoint {name: 'Some Interface', endpoint: '...', description: '...'})

// Data Objects
CREATE (offerPrice:Data {name: 'Price'})
CREATE (locale:Data {name: 'Locale'})
CREATE (pictures:Data {name: 'Pictures'})

// Countries
CREATE (germany:Country {name: 'Germany'})
CREATE (uk:Country {name: 'UK'})
CREATE (france:Country {name: 'France'})

//*************************************//
//*********** RELATIONSHIPS ***********//
//*************************************//

// APIs Relationships
CREATE (myApi)-[:PROVIDED_BY]->(xyz)

//*********************************//
//*********** Use Cases ***********//
//*********************************//

// Take-in
CREATE (take_in:UseCase {name: 'Take-in', description: 'https://...'}),
    (take_in)-[:FULFILLS]->(stockImport)

    // Take-in Steps
    CREATE (getSomeDataStep:Step {name: 'Get Some Data'}),
        (take_in)-[:STARTS_WITH {for: take_in.name}]->(getSomeDataStep),
        (getSomeDataStep)-[:SENDS {for: take_in.name + ' , ' + getSomeDataStep.name}]->(vin)-[:SENDS {for: take_in.name + ' , ' + getSomeDataStep.name}]->(enrichVehicleIf),
        (getSomeDataStep)-[:SENDS {for: take_in.name + ' , ' + getSomeDataStep.name}]->(locale)-[:SENDS {for: take_in.name + ' , ' + getSomeDataStep.name}]->(enrichVehicleIf),
        (enrichVehicleIf)-[:RECEIVES {for: take_in.name + ' , ' + getSomeDataStep.name}]->(myObj)-[:RECEIVES {for: take_in.name + ' , ' + getSomeDataStep.name}]->(getSomeDataStep)
    CREATE (saveStep:Step {name: 'Save Some'}),
        (getSomeDataStep)-[:THEN]->(saveStep),
        (saveStep)-[:SENDS {for: saveStep.name}]->(vin)-[:SENDS {for: saveStep.name}]->(saveIf),
        (saveStep)-[:SENDS {for: saveStep.name}]->(myObj)-[:SENDS {for: saveStep.name}]->(saveIf),
        (saveStep)-[:SENDS {for: saveStep.name}]->(companyId)-[:SENDS {for: saveStep.name}]->(saveIf),
        (saveStep)-[:SENDS {for: saveStep.name}]->(outletId)-[:SENDS {for: saveStep.name}]->(saveIf),
        (saveStep)-[:SENDS {for: saveStep.name}]->(condition)-[:SENDS {for: saveStep.name}]->(saveIf),
        (saveStep)-[:SENDS {for: saveStep.name}]->(offerPrice)-[:SENDS {for: saveStep.name}]->(saveIf),
        (saveStep)-[:SENDS {for: saveStep.name}]->(milage)-[:SENDS {for: saveStep.name}]->(saveIf),
        (saveIf)-[:RECEIVES {for: saveStep.name}]->(successFailure)-[:RECEIVES {for: saveStep.name}]->(saveStep)
    CREATE (addPicturesStep:Step {name: 'Add Pictures'}),
        (saveStep)-[:THEN]->(addPicturesStep)
// End script execution
;