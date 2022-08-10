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


Sequelize will handle the Database Table, so we don't need existing database table.
But for convenience we will create a new table and keep the existing table in db

Mongoose Handles MongoDB

connect-flash for sending data after post request

Completed Application Without REST API (View based)

