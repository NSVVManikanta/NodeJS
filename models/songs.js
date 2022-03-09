const Sequelize = require('sequelize');
const sequelize= require('../util/database');
const song= sequelize.define('songs',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey : true,
    },
    title:{
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    },
    length:{
        type : Sequelize.TIME,
        allowNull : false,
    },
    composers:{
        type : Sequelize.STRING,
        allowNull : false,
       
    },
    singers:{
        type : Sequelize.STRING,
        allowNull : false,
    },
    lyricists:{
        type : Sequelize.STRING,
        allowNull : false,
    },
   
});


module.exports=song;