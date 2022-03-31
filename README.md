You will need to create two .env files for your project: .env.test and .env.development.
Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (nc_news, nc_news_test).

Link to a hosted version - https://news-williammason.herokuapp.com/

To clone this project fork it to your github then copy the clone link in the newly forked repo, then in vscode type git clone <URL HERE> in the terminal, then run again in your terminal npm install followed by npm run setup-dbs to set up the databases. Then finally to run the tests simply type again in your terminal npm test.
postgresql = v12.9
node.js = v17.5.0

This project is a backend project that houses a database containing articles, users, comments and topics tables each of which is interlinked and provides multiple endpoints from which you can extract useful information.
