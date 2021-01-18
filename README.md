# Description

The ```neo4j-browser``` stores user configuration inside ```localStorage```. This makes it impossible to share it accross deployments and users.

The idea is to be able to create own ```cypher``` based quries, let them run against a ```neo4j``` instance and visualize the result either as a table or graph.

The response can contain multiple different data type, hence the tabular-visualization must be capable to adopt dynamically.

## Development

> Spin up a local webserver to serve web content. This is due to the fact that JavaScript is using the file-protocol for loading files with ```import```. This protocol is not supported and generates a cross-origin error:
<https://stackoverflow.com/questions/10752055/cross-origin-requests-are-only-supported-for-http-error-when-loading-a-local>

To spin local http server from Windows Subsystem for Linux:

```bash
python -m SimpleHTTPServer 9000
```

Alternatively with serve server:

```bash
npm instal -g serve
serve -s .
```

> We could avoid using ```import``` by letting browser import all the scripts in ```script```-tag, but that ultimately results in messy code and globally unbounded contexts:
<https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file>
