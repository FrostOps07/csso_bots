const _ = require("lodash");

const commands = require("./db/commands.json");
const feeds    = require("./db/feeds.json");
const roles    = require("./db/roles.json");
const dyk      = require("./db/dyk.json");

const bot = require("./bot.js");

exports.table = {
  "commands": commands,
  "feeds":    feeds,
  "roles":    roles
}

/**
 *   @function    hasPermission()
 *   @description Check if user role has permission to use a command
 *   @return      hasPermission:boolean
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
 *   @function    rolesWithPermission()
 *   @description Check what roles are able to use a command
 *   @return      roles_with_permission:array
 */
exports.rolesWithPermission = (command) => {
  var roles_with_permission = [];
  // If a role has the desired command in their commands list,
  // Add them to the list of roles with permission to use this command
  for (var i = 0; i < roles.length; i++) {
    for (var j = 0; j < roles[i].commands.length; j++) {
      if(roles[i].commands[j] == command || roles[i].commands[j] == "all"){
        roles_with_permission.push(roles[i]);
      }
    }
  }
  return roles_with_permission;
}

/**
 *   @function    getRole()
 *   @description Get a single role by ID
 *   @return      role:object
 */
exports.getRole = (role_id) => {
  for (let r of roles) {
    if(role_id == r.id) return r;
  }
  console.error("Searched for the role "+role_id+" but none was found.");
  return false;
}

/**
 *   @function    getCommand()
 *   @description Get a single command by name
 *   @return      command:object
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
*   @input    role_ids:array An array of role IDs
*   @return   command_list:array An array command objects
*/
exports.getCommands = (role_ids) => {
  var these_roles = [];
  // Get all roles requested
  for (let r of role_ids) {
    these_roles.push(exports.getRole(r));
  }
  var command_list = [];
  // Get all commands these roles have
  these_roles.forEach(function(this_role){
    if(this_role != false && this_role.commands.length > 0){
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

/**
 *   @function getFeedFromURL()
 *   @input    feed_url:string A feed URL
 *   @return   feed_item:object
 */
exports.getFeedFromURL = (feed_url) => {
  for (var i = 0; i < feeds.length; i++) {
    if(feed_url == feeds[i].feed_url){
      console.log(feeds[i].name);
      return feeds[i];
    }
  }
  return false;
}

/**
 *   @function    compareFeeds()
 *   @description Determines if multiple feeds are for the same show or not
 *   @input       feed_urls:array
 *   @return      boolean
 */
exports.compareFeeds = (feed_urls) => {
  var compared_feeds = [];
  for (var i = 0; i < feed_urls.length; i++) {
    var new_feed = exports.getFeedFromURL(feed_urls[i]);
    if(new_feed != false){ // If it exists
      compared_feeds.push();
    }
  }
  return compared_feeds.allSameName = function() {
      for(var i = 1; i < this.length; i++)
      {
          if(this.name[i] !== this.name[0]){
            console.log("feeds have different names");
            return false;
          }
      }
      console.log("feeds have the same name", this.name[0])
      return true;
  }
}

/**
*   @function    getDYK()
*   @description Returns a random "But Did You Know??" fact from Movies with Mikey.
*   @return      dyk_fact:object
*/
exports.getDYK = () => {
  return _.sample(dyk);
}

/**
*   @function    getDykStats()
*   @description Returns fun statistics about our DYK database.
*   @return      dyk_stats:object
*/
exports.getDykStats = () => {
  var this_dyk = dyk.slice();
  // Sort dyk by episodes so we have a list of episodes with facts
  var uniq_episodes = [];
      uniq_episodes = _.uniqBy(this_dyk, 'title');
  // Get the fact count for each episode
  for (var i = 0; i < uniq_episodes.length; i++) {
    var ep_title   = uniq_episodes[i].title;
    var fact_count = 0;
    for (var j = 0; j < dyk.length; j++) {
      // increment fact count if there's a fact
      if(ep_title == dyk[j].title){
        fact_count++;
      }
    }
    uniq_episodes[i].fact_count = fact_count;
  }
  // Get the episode with the highest DYK count
  var most_facts = [];
      most_facts = _.maxBy(uniq_episodes, 'fact_count');

  // Check if there are other episodes that tie for the same fact count
  var most_facts_array = [];
  for (var i = 0; i < uniq_episodes.length; i++) {
    if(uniq_episodes[i].fact_count == most_facts.fact_count){
      most_facts_array.push(uniq_episodes[i]);
    }
  }
  // Build stats object
  var dyk_stats = {
    "total_facts":         dyk.length,
    "episodes_with_facts": uniq_episodes.length,
    "most_facts":          most_facts_array
  }
  return dyk_stats;
}
