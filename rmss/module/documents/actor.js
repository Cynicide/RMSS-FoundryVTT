export class RMSSActor extends Actor {
  
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }
  
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.rmss || {};
    
    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }
  
  /**
  * Prepare Character type specific data
  */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;
    
    // Calculate Stat Bonuses for the Actor
    this.calculateStatBonuses(actorData);
    
    // Calculate Resistance Rolls for the Actor
    this.calculateResistanceRolls(actorData);
    
    // Iterate through and apply Stat bonuses for Skill Category Items
    this.calculateSkillCategoryStatBonuses();

    // Iterate through and apply Skill Category Bonuses for Skill items
    this.calculateSkillBonuses();
  }
  
  /**
  * Prepare NPC type specific data.
  */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;
    
    // Make modifications to data here. For example:
    const data = actorData.data;
  }
  
  // Tally each stat bonus and populate the total field. 
  calculateStatBonuses(actorData) {
    const systemData = actorData.system;
    actorData.system.stats.agility.stat_bonus = Number(systemData.stats.agility.racial_bonus)+Number(systemData.stats.agility.special_bonus)+Number(systemData.stats.agility.basic_bonus);
    actorData.system.stats.constitution.stat_bonus = Number(systemData.stats.constitution.racial_bonus)+Number(systemData.stats.constitution.special_bonus)+Number(systemData.stats.constitution.basic_bonus);
    actorData.system.stats.memory.stat_bonus = Number(systemData.stats.memory.racial_bonus)+Number(systemData.stats.memory.special_bonus)+Number(systemData.stats.memory.basic_bonus);
    actorData.system.stats.reasoning.stat_bonus = Number(systemData.stats.reasoning.racial_bonus)+Number(systemData.stats.reasoning.special_bonus)+Number(systemData.stats.reasoning.basic_bonus);
    actorData.system.stats.self_discipline.stat_bonus = Number(systemData.stats.self_discipline.racial_bonus)+Number(systemData.stats.self_discipline.special_bonus)+Number(systemData.stats.self_discipline.basic_bonus);
    actorData.system.stats.empathy.stat_bonus = Number(systemData.stats.empathy.racial_bonus)+Number(systemData.stats.empathy.special_bonus)+Number(systemData.stats.empathy.basic_bonus);
    actorData.system.stats.intuition.stat_bonus = Number(systemData.stats.intuition.racial_bonus)+Number(systemData.stats.intuition.special_bonus)+Number(systemData.stats.intuition.basic_bonus);
    actorData.system.stats.presence.stat_bonus = Number(systemData.stats.presence.racial_bonus)+Number(systemData.stats.presence.special_bonus)+Number(systemData.stats.presence.basic_bonus);
    actorData.system.stats.quickness.stat_bonus = Number(systemData.stats.quickness.racial_bonus)+Number(systemData.stats.quickness.special_bonus)+Number(systemData.stats.quickness.basic_bonus);
    actorData.system.stats.strength.stat_bonus = Number(systemData.stats.strength.racial_bonus)+Number(systemData.stats.strength.special_bonus)+Number(systemData.stats.strength.basic_bonus);
  }

  // Calculate each Resistance Roll with the formula on the character sheet. 
  calculateResistanceRolls(actorData) { // TODO: Add Racial modifiers to resistance
    const systemData = actorData.system;
    actorData.system.resistance_rolls.essence = Number(systemData.stats.empathy.stat_bonus * 3);
    actorData.system.resistance_rolls.channeling = Number(systemData.stats.intuition.stat_bonus * 3);
    actorData.system.resistance_rolls.mentalism = Number(systemData.stats.presence.stat_bonus * 3);
    actorData.system.resistance_rolls.fear = Number(systemData.stats.self_discipline.stat_bonus * 3);
    actorData.system.resistance_rolls.poison_disease = Number(systemData.stats.constitution.stat_bonus * 3);
    actorData.system.resistance_rolls.chann_ess = Number(systemData.stats.intuition.stat_bonus) + Number(systemData.stats.empathy.stat_bonus);
    actorData.system.resistance_rolls.chann_ment = Number(systemData.stats.intuition.stat_bonus) + Number(systemData.stats.presence.stat_bonus);
    actorData.system.resistance_rolls.ess_ment = Number(systemData.stats.empathy.stat_bonus) + Number(systemData.stats.presence.stat_bonus);
    actorData.system.resistance_rolls.arcane = Number(systemData.stats.empathy.stat_bonus) + Number(systemData.stats.intuition.stat_bonus) + Number(systemData.stats.presence.stat_bonus);
  }

  calculateSkillBonuses() {
    for (const item of this.items) {
      if (item.type === "skill") {
        console.log("rmss | actor.js | Calculating skill bonus for Skill: " + item.name);
        console.log("rmss | actor.js | Updating Skill Category Bonus for Skill: " + item.name);
        item.calculateSelectedSkillCategoryBonus(item);
        console.log("rmss | actor.js | Updating Skill Total Bonus for Skill: " + item.name);
        item.calculateSkillTotalBonus(item);
      }
    }
  }

  // Tallys the bonus for each Stat that is applicable to the Skill Category and then updates the total
  calculateSkillCategoryStatBonuses() {
    for (const item of this.items) {
      if (item.type === "skill_category") {
        
        console.log("rmss | actor.js | Calculating Skill Category Stat Bonuses for: " + item.name);
        // Get all the applicable stats for this skill category 
        var app_stat_1 = item.system.app_stat_1;
        var app_stat_2 = item.system.app_stat_2;
        var app_stat_3 = item.system.app_stat_3;     
        
        // If the first one is None we don't need to do anything further
        if (app_stat_1 === "None") {
          continue;
        } 
        else 
        {          
          var applicable_stat_bonus = 0;
          
          var app_stat_1_found = false;
          var app_stat_2_found = false;
          var app_stat_3_found = false;          
          
          // Iterate through the applicable stats and find their full names
          for (const stat in CONFIG.rmss.stats) {
            // If the configured App Stat matches the one of the stats in config
            if (app_stat_1 === CONFIG.rmss.stats[stat].shortname) {
              app_stat_1_found = true;
              // Get the Stat Bonus
              applicable_stat_bonus = applicable_stat_bonus + this.system.stats[stat].stat_bonus;
            }
            if (app_stat_2 === CONFIG.rmss.stats[stat].shortname) {
              app_stat_2_found = true;
              applicable_stat_bonus = applicable_stat_bonus + this.system.stats[stat].stat_bonus;
            }
            if (app_stat_3 === CONFIG.rmss.stats[stat].shortname) {
              app_stat_3_found = true;
              applicable_stat_bonus = applicable_stat_bonus + this.system.stats[stat].stat_bonus;
            }
          }
          //console.log("Applicable Stat Bonus: " + applicable_stat_bonus)
          if (app_stat_1_found === true && app_stat_2_found === true && app_stat_3_found === true) {
            // Apply the update if we found stat bonuses for every applicable stat
            item.system.stat_bonus = applicable_stat_bonus;
            
            // Update the total in the Item
            item.calculateSkillCategoryTotalBonus(item);
          }
        }
      }
    }
  }

  // For each skill category return an object in this format.
  // {{ _id: "skill category name"}}
  // This is the format that the select helper on the skill sheet needs
  getOwnedSkillCategories() {
    var ownedSkillCategories = {None: "None"};
      console.log("rmss | actor.js | Getting owned skill categories for: " + this.name);
      for (const item of this.items) {
      if (item.type === "skill_category") {
        ownedSkillCategories[item._id] = item.name;
      }
    }
    return(ownedSkillCategories);
  }

  getOwnedSkills() {
    var ownedSkills = {None: "None"};
      console.log("rmss | actor.js | Getting owned skills for: " + this.name);
      for (const item of this.items) {
      if (item.type === "skill") {
        ownedSkills[item._id] = item.name;
      }
    }
    return(ownedSkills);
  }

}