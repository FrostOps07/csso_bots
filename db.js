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
  for (var j = 0; j < commands.length; j++) {
    if(command_name == commands[i].command){
      return commands[i].command;
    }
  }
  console.error("Tried to find the command "+command_name+" but none was found.");
  return false;
}

/**
*   @function getCommands()
*
*   @return command_list:string A message containing a user's allowed commands
*/
exports.getCommands = (role_id) => {
  var role = exports.getRole(role_id);

  if(role !=false && role.commands.length > 0){
    var command_list = "*Here are the commands you are able to use:*\n\n";

    for (var i = 0; i < role.commands.length; i++) {
      // Return all commands if user is set for "all"
      if(role.commands[i] == "all"){
        for (var j = 0; j < commands.length; j++) {
          command_list += "**"+commands[j].command+":** "+commands[j].description+"\n\n";
        }
      } else if(hasPermission(role.id, role.commands[i])){
        var command = exports.getCommand(role.commands[i]);
        command_list += "**"+command.command+":** "+command.description+"\n\n";
      }
    }
    return command_list;
  } else {
    return "You are not allowed to use any commands. ";
  }
}
