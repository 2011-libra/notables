
// The purpose of this module is to bring your Sequelize instance (`db`) together with your models

const db = require('./database')
// const Project = require('./project')
// const Robot = require('./robot')
// const RobotProject = require('./robotproject')

// This is a great place to establish associations between your models
// (https://sequelize-guides.netlify.com/association-types/).
// Example:
//
// Puppy.belongsTo(Owner)

// Robot.belongsToMany(Project, {through: RobotProject})
// Project.belongsToMany(Robot, {through: RobotProject})

module.exports = {
  // Include your models in this exports object as well!
  db,
  // Project,
  // Robot,
  // RobotProject
}
