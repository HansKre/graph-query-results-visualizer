export const queries =
    [
        {
            'description': 'Consumers, Sales Levels, Stock, Kind of System, Countries, Use Cases',
            'cypher': 'MATCH (c:Consumer)\
                        WITH c,\
                            [(c)-[:BELONGS_TO]->(salesLevel) | salesLevel.name] AS salesLevels,\
                            [(c)-[:DEALS_WITH]->(stock) | stock.name] AS stock,\
                            [(c)-[:IS_IN]->(country) | country.name]  AS countries,\
                            [(c)-[:HAS]->(useCase) | useCase.name] AS useCases,\
                            [(c)-[:IS_A]->(kindOfSys) | kindOfSys.name ] AS kindOfSys\
                        RETURN c as consumer, salesLevels, stock, kindOfSys as KindOfSystem, countries, useCases\
                        ORDER BY consumer.name ASC',
            'viz': 'table'
        },
        {
            'description': 'Consumers, endpoints, calls, use cases, stock',
            'cypher': 'MATCH (c:Consumer)-[r1]-(e:Endpoint)\
                        OPTIONAL MATCH (c)-[r2]-(uc:UseCase)\
                        OPTIONAL MATCH (c)-[r3]-(stock:Stock)\
                        RETURN c.name, collect(DISTINCT e.name) as endpoints, r1.count as calls, collect(DISTINCT uc.name) as useCases, collect(DISTINCT stock.name) as stock',
            'viz': 'table'
        },
        {
            'description': 'All Use Cases and their steps',
            'cypher': 'MATCH (uc:UseCase)-[:STARTS_WITH]->(firstStep:Step)\
                        MATCH (firstStep)-[:THEN*0..]->(steps)\
                        RETURN uc.name, steps.name',
            'viz': 'table'
        },
        {
            'description': 'All Use Cases and their steps as list',
            'cypher': 'MATCH (uc:UseCase)-[:STARTS_WITH]->(firstStep:Step)\
                        MATCH (firstStep)-[:THEN*0..]->(steps)\
                        RETURN uc.name, collect(steps.name)',
            'viz': 'table'
        },
        {
            'description': 'Use Cases with their steps and IN/OUT',
            'cypher': 'MATCH (uc:UseCase)-[:STARTS_WITH]->(firstStep:Step)\
                        MATCH (firstStep)-[:THEN*0..]->(steps)\
                        WITH *,\
                            [(steps)-[rIn:SENDS]->(dIn:Data) | dIn.name] as sends,\
                            [(steps)<-[rOut:RECEIVES]-(dOut:Data) | dOut.name] as receives\
                        RETURN uc.name, steps.name, sends, receives',
            'viz': 'table'
        },
        {
            'description': 'Use Cases with their steps and IN/OUT and API Endpoints',
            'cypher': 'MATCH (uc:UseCase)-[:STARTS_WITH]->(firstStep:Step)\
                        MATCH (firstStep)-[:THEN*0..]->(steps)\
                        WITH *,\
                            [(steps)-[rIn:SENDS]->(dIn:Data) | dIn.name] AS sends,\
                            [(steps)<-[rOut:RECEIVES]-(dOut:Data) | dOut.name] AS receives\
                        OPTIONAL MATCH (steps)-[:SENDS]->(:Data)-[s:SENDS]->(endpoint:Endpoint)\
                            WHERE s.for CONTAINS steps.name\
                        WITH *, collect(DISTINCT endpoint.name) AS endpoints\
                        RETURN uc.name, collect(DISTINCT steps.name) as step, sends, receives, endpoints',
            'viz': 'table'
        },
        {
            'description': 'All consumers per use case',
            'cypher': 'MATCH (uc:UseCase)<-[:HAS]-(c:Consumer)\
                        RETURN uc.name, collect(DISTINCT c.name)',
            'viz': 'table'
        },
        {
            'description': 'All Consumers per SalesLevel',
            'cypher': 'MATCH (salesLevel:SalesLevel)<-[:BELONGS_TO]-(c:Consumer)\
                        RETURN salesLevel.name, collect(DISTINCT c.name)',
            'viz': 'table'
        },
        {
            'description': 'APIs, their Endpoints and consumers with calls as table',
            'cypher': 'MATCH (endpoint:Endpoint)-[belongs:BELONGS_TO]->(api:API)\
                        OPTIONAL MATCH (endpoint)<-[consumes:CONSUMES]-(c:Consumer)\
                        RETURN api.name, endpoint.name, c.name, consumes.count',
            'viz': 'table'
        },
        {
            'description': 'APIs aggregates with consumers and calls as table',
            'cypher': 'MATCH (endpoint:Endpoint)-[belongs:BELONGS_TO]->(api:API)\
                        MATCH (endpoint)<-[consumes:CONSUMES]-(c:Consumer)\
                        RETURN api.name, collect(DISTINCT c.name), reduce(totalConsumption = 0, n IN [()<-[consumes]-(c) | consumes] | totalConsumption + n.count) AS totalCalls',
            'viz': 'table'
        },
        {
            'description': 'All steps of Take-in use case as graph',
            'cypher': 'MATCH (uc:UseCase {name:\'Take-in\'})-[r1:STARTS_WITH]->(firstStep:Step)\
                        MATCH (firstStep)-[rn:THEN*0..]->(steps)\
                        RETURN *',
            'viz': 'graph'
        },
        {
            'description': 'Use-Cases as graph without Capabilities and Business Processes',
            'cypher': 'MATCH p = (uc:UseCase)-[*0..3]->(t)\
                        WITH *, labels(t) as ls, relationships(p) as r\
                        WHERE NOT \'Capability\' IN ls AND NOT \'BusinessProcess\' IN ls\
                        RETURN *',
            'viz': 'graph'
        },
        {
            'description': 'APIs and their Endpoints as graph',
            'cypher': 'MATCH (api:API)<-[r]-(t)\
                        RETURN *',
            'viz': 'graph'
        },
        {
            'description': 'APIs, their Endpoints and consumers as graph',
            'cypher': 'MATCH (api:API)<-[r]-(t)<-[consumes:CONSUMES]-(c:Consumer), (endpoints:Endpoint)-[belongs:BELONGS_TO]-(api)\
                        RETURN *',
            'viz': 'graph'
        },
    ];