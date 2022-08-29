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
    const actorData = this.data;
    const data = actorData.data;
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

    // Calculate Stat Bonuses in Actor
    this.prepareStatBonuses(actorData)

    // Calculate Resistance Rolls in Actor
    this.prepareResistanceRolls(actorData);

    // Iterate through and apply Stat bonuses for Skill Category Items
    this.prepareSkillCatStatBonuses();
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const data = actorData.data;
    data.xp = (data.cr * data.cr) * 100;
  }

  prepareStatBonuses(actorData) {

    const data = actorData.data;

    actorData.data.stats.agility.stat_bonus = Number(data.stats.agility.racial_bonus)+Number(data.stats.agility.special_bonus)+Number(data.stats.agility.basic_bonus);
    actorData.data.stats.constitution.stat_bonus = Number(data.stats.constitution.racial_bonus)+Number(data.stats.constitution.special_bonus)+Number(data.stats.constitution.basic_bonus);
    actorData.data.stats.memory.stat_bonus = Number(data.stats.memory.racial_bonus)+Number(data.stats.memory.special_bonus)+Number(data.stats.memory.basic_bonus);
    actorData.data.stats.reasoning.stat_bonus = Number(data.stats.reasoning.racial_bonus)+Number(data.stats.reasoning.special_bonus)+Number(data.stats.reasoning.basic_bonus);
    actorData.data.stats.self_discipline.stat_bonus = Number(data.stats.self_discipline.racial_bonus)+Number(data.stats.self_discipline.special_bonus)+Number(data.stats.self_discipline.basic_bonus);
    actorData.data.stats.empathy.stat_bonus = Number(data.stats.empathy.racial_bonus)+Number(data.stats.empathy.special_bonus)+Number(data.stats.empathy.basic_bonus);
    actorData.data.stats.intuition.stat_bonus = Number(data.stats.intuition.racial_bonus)+Number(data.stats.intuition.special_bonus)+Number(data.stats.intuition.basic_bonus);
    actorData.data.stats.presence.stat_bonus = Number(data.stats.presence.racial_bonus)+Number(data.stats.presence.special_bonus)+Number(data.stats.presence.basic_bonus);
    actorData.data.stats.quickness.stat_bonus = Number(data.stats.quickness.racial_bonus)+Number(data.stats.quickness.special_bonus)+Number(data.stats.quickness.basic_bonus);
    actorData.data.stats.strength.stat_bonus = Number(data.stats.strength.racial_bonus)+Number(data.stats.strength.special_bonus)+Number(data.stats.strength.basic_bonus);

  }

  prepareResistanceRolls(actorData) {

    const data = actorData.data;

    actorData.data.resistance_rolls.essence = Number(actorData.data.stats.empathy.stat_bonus * 3)
    actorData.data.resistance_rolls.channeling = Number(actorData.data.stats.intuition.stat_bonus * 3)
    actorData.data.resistance_rolls.mentalism = Number(actorData.data.stats.presence.stat_bonus * 3)
    actorData.data.resistance_rolls.fear = Number(actorData.data.stats.self_discipline.stat_bonus * 3)
    actorData.data.resistance_rolls.poison_disease = Number(actorData.data.stats.constitution.stat_bonus * 3)
    actorData.data.resistance_rolls.chann_ess = Number(actorData.data.stats.intuition.stat_bonus) + Number(actorData.data.stats.empathy.stat_bonus)
    actorData.data.resistance_rolls.chann_ment = Number(actorData.data.stats.intuition.stat_bonus) + Number(actorData.data.stats.presence.stat_bonus)
    actorData.data.resistance_rolls.ess_ment = Number(actorData.data.stats.empathy.stat_bonus) + Number(actorData.data.stats.presence.stat_bonus)
    actorData.data.resistance_rolls.arcane = Number(actorData.data.stats.empathy.stat_bonus) + Number(actorData.data.stats.intuition.stat_bonus) + Number(actorData.data.stats.presence.stat_bonus)
  }

  prepareSkillCatStatBonuses() {
    console.log("Getting Items");
    for (const item of this.items) {
      if (item.type === "skill_category") {

        // Get all the applicable stats for this skill category 
        var app_stat_1 = item.data.data.app_stat_1;
        var app_stat_2 = item.data.data.app_stat_2;
        var app_stat_3 = item.data.data.app_stat_3;     
        console.log(item.name + " " + app_stat_1 + " " + app_stat_2 + " " + app_stat_3);
        
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
              console.log("Found first stat: " + stat);
              app_stat_1_found = true;
              // Get the Stat Bonus
              console.log(this.data.data.stats[stat].stat_bonus);
              applicable_stat_bonus = applicable_stat_bonus + this.data.data.stats[stat].stat_bonus
              //console.log("New Applicable Stat Bonus: " + applicable_stat_bonus)
            }
            if (app_stat_2 === CONFIG.rmss.stats[stat].shortname) {
              console.log("Found second stat: " + stat);
              app_stat_2_found = true;
              console.log(this.data.data.stats[stat].stat_bonus);
              applicable_stat_bonus = applicable_stat_bonus + this.data.data.stats[stat].stat_bonus
              //console.log("New Applicable Stat Bonus: " + applicable_stat_bonus)
            }
            if (app_stat_3 === CONFIG.rmss.stats[stat].shortname) {
              console.log("Found third stat: " + stat);
              app_stat_3_found = true;
              console.log(this.data.data.stats[stat].stat_bonus);
              applicable_stat_bonus = applicable_stat_bonus + this.data.data.stats[stat].stat_bonus
              //console.log("New Applicable Stat Bonus: " + applicable_stat_bonus)
            }
          }
          console.log("Applicable Stat Bonus: " + applicable_stat_bonus)
          if (app_stat_1_found === true && app_stat_2_found === true && app_stat_3_found === true) {
            // Apply the update if we found stat bonuses for every applicable stat
            item.data.data.stat_bonus = applicable_stat_bonus;
            
            // Update the total in the Item
            item.calculateSkillCatTotalBonus(item.data);
          }
        }
      }
    }
  }

}