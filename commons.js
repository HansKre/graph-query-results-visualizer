export const prepareDom = (query, showCypther) => {
    let targetContainer = document.getElementById("visualizations");
    // add description header
    const descriptionNode = document.createElement("h3");
    descriptionNode.innerText = query.description;
    targetContainer.appendChild(descriptionNode);
    // add cypher below header
    if (showCypther) {
        const cypherQueryNode = document.createElement("p");
        cypherQueryNode.innerText = query.cypher;
        targetContainer.appendChild(cypherQueryNode);
    }
    // add table
    const vizTarget = document.createElement("div");
    vizTarget.classList.add(query.viz);
    const vizId = query.viz + Math.floor(Math.random() * 99999).toString();
    vizTarget.id = vizId;
    targetContainer.appendChild(vizTarget);
    return vizTarget;
}