const _ = require("lodash");

const commands = require("./db/commands.json");
const feeds    = require("./db/feeds.json");
const roles    = require("./db/roles.json");

const bot = require("./csso-bot.js");

exports.table = {
  "commands":commands,
  "feeds":feeds,
  "roles":roles
}

/**
*   @function hasPermission()
*   Check if user role has permission to use a command
*   @return:boolean
*/
exports.hasPermission = (role_id, command) => {
  var role = exports.getRole(role_id);
  if(role != false){
    for (var i = 0; i < role.commands.length; i++) {
      if(command == role.commands[i] || role.commands[i] == "all"){
        console.log("User had permission to use "+command);
        return true;
      }
    }
  }
  console.error("User did not have permission to use "+command);
  return false;
}

/**
*   @function rolesWithPermission()
*   Check what roles are able to use a command
*   @return roles_with_permission:array Array of Role objects
*/
exports.rolesWithPermission = (command) => {
  var roles_with_permission = [];
  // console.log("Checking for roles with permission to use "+command+".")
  // If a role has the desired command in their commands list,
  // Add them to the list of roles with permission to use this command
  for (var i = 0; i < roles.length; i++) {
    for (var j = 0; j < roles[i].commands.length; j++) {
      if(roles[i].commands[j] == command || roles[i].commands[j] == "all"){
        roles_with_permission.push(roles[i]);
        // console.log("Adding role "+roles[i].role);
      }
    }
  }
  // console.log("These roles have permission: "+roles_with_permission);
  return roles_with_permission;
}

/**
*   @function getRole()
*   Get a single role by ID
*   @return role:object
*/
exports.getRole = (role_id) => {
  for (var i = 0; i < roles.length; i++) {
    if(role_id == roles[i].id){
      return roles[i];
    }
  }
  console.error("Searched for the role "+role_id+" but none was found.");
  return false;
}

/**
*   @function getCommand()
*   Get a single command by name
*   @return command:object
*/
exports.getCommand = (command_name) => {
  for (var i = 0; i < commands.length; i++) {
    if(command_name == commands[i].command){
      return commands[i];
    }
  }
  console.error("Tried to find the command "+command_name+" but none was found.");
  return false;
}

/**
*   @function getCommands()
*   @input role_ids:array An array of role IDs
*   @return command_list:array An array command objects
*/
exports.getCommands = (role_ids) => {
  var these_roles = [];
  // Get all roles requested
  for (var i = 0; i < role_ids.length; i++) {
    these_roles.push(exports.getRole(role_ids[i]));
  }
  var command_list = [];
  // Get all commands these roles have
  these_roles.forEach(function(this_role){
    if(this_role !=false && this_role.commands.length > 0){
      for (var i = 0; i < this_role.commands.length; i++) {
        if(exports.hasPermission(this_role.id, this_role.commands[i])){
          // Just add all commands
          if(this_role.commands[i] == "all"){
            command_list = commands;
          }
          // Add just the ones they have permission for
          else{
            var new_command = exports.getCommand(this_role.commands[i]);
            if(new_command != false && new_command.command != undefined){ // If it exists
              command_list.push(new_command);
            }
          }
        }
      }
    }
  });
  // Remove any duplicate commands
  command_list = _.uniqBy(command_list, "command");

  return command_list;
}
