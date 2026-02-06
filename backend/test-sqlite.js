const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    entities: [], // No entities for basic test
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
        process.exit(1);
    });
