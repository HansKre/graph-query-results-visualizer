// subscribe for button-click to retrieve credentials
document.getElementById('submit').onclick = () => {
  const user = document.getElementById('user').value;
  const pwd = document.getElementById('pwd').value;
  var credentials = JSON.stringify({ "username": user, "password": pwd });
  // clear values
  // hide login pane
  // executeWith(credentials);
}

import { queries } from './queries.js';
import { drawTable } from './drawTable.js';
import { drawGraph } from './drawGraph.js';
import { prepareDom } from './commons.js';
import { config } from './config.js';

window.addEventListener('DOMContentLoaded', (event) => {

  const stylingDebug = false;
  if (stylingDebug) {
    [1, 2, 3].forEach(q => {
      let targetContainer = document.getElementById("visualizations");
      // add description header
      const descriptionNode = document.createElement("div");
      descriptionNode.innerText = "Foo bar " + q;
      descriptionNode.classList = ["table"];
      targetContainer.appendChild(descriptionNode);
    })
  } else {
    queries.forEach(query => {

      const targetDiv = prepareDom(query);

      if (query.viz == 'table') {
        drawTable(config, targetDiv, query);
      } else if (query.viz == 'graph') {
        drawGraph(config, targetDiv, query);
      }

    });
  }

});