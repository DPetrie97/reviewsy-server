const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    dialect: "postgres"
});

sequelize.authenticate().then(
    function() {
        console.log("Connected to Reviewsy postgres database!");
    },
    function(err) {
        console.log(err);
    }
);


// Setup Associations
const Users = sequelize.import('./models/User');
const Gaming = sequelize.import('./models/Gaming');

Users.hasMany(Gaming);
Gaming.belongsTo(Users)

module.exports = sequelize;