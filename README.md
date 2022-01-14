## Debugging
> VSCode > Run > Start Debugging > Choose Environment (Node.js)

## Restart Debugger on code change
> VSCode > Run > Add Configuration... > Choose Environment (Node.js)
> Add below settings to launch.json in .vscode folder.
> Also install nodemon globally
> 
> ```javascript
> "restart": true, 
> "runtimeExecutable": "nodemon",
> "console": "integratedTerminal"
>