export class RMSSItem extends Item {

  /** @override */
  prepareData() {
    // Prepare data for the item. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    console.log(`rmss | item.js | prepareData for:  ${this.name}`);
    super.prepareData();
  }

  // Set the icon images for newly created images.
  async _preCreate(data, options, userId) {
    await super._preCreate(data, options, userId);

    // Do not set on copied items if they have a custom Icon.
    if (!data.name.includes("(Copy)"))
    {
      if (this.type === "armor") {
        await this.updateSource({img: "systems/rmss/assets/default/armor.svg"});
      }
      else if (this.type === "weapon") {
        await this.updateSource({img: "systems/rmss/assets/default/weapon.svg"});
      }
      else if (this.type === "skill") {
        await this.updateSource({img: "systems/rmss/assets/default/skill.svg"});
      }
      else if (this.type === "skill_category") {
        await this.updateSource({img: "systems/rmss/assets/default/skill_category.svg"});
      }
      else if (this.type === "spell") {
        await this.updateSource({img: "systems/rmss/assets/default/spell.svg"});
      }
      else if (this.type === "herb_or_poison") {
        await this.updateSource({img: "systems/rmss/assets/default/herb_or_poison.svg"});
      }
      else if (this.type === "transport") {
        await this.updateSource({img: "systems/rmss/assets/default/transport.svg"});
      }
    }
  }

  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;
    const flags = itemData.flags.rmss || {};

    // Make separate methods for each item type to keep things organized.

    if (itemData.type === "skill") {
      this._prepareSkillCategoryData(itemData);
    }

    if (itemData.type === "skill") {
      this._prepareSkillData(itemData);
    }
  }

  _prepareSkillCategoryData(itemData) {
    if (itemData.type !== "skill_category") return;
    console.log(`rmss | item.js | Preparing Skill Category Data for: ${itemData.name}`);
    // Calculate Skill Category Total Bonus
    this.calculateSkillCategoryTotalBonus(itemData);
  }

  _prepareSkillData(itemData) {
    if (itemData.type !== "skill") return;
    console.log(`rmss | item.js | Preparing Skill Data for: ${itemData.name}`);
    // Make modifications to data here. For example:
    // const systemData = itemData.system;
    // Calculate Skill Category Bonus
    this.calculateSelectedSkillCategoryBonus(itemData);
    // Calculate Skill Total Bonus
    this.calculateSkillTotalBonus(itemData);
  }

  calculateSkillCategoryTotalBonus(itemData) {
    if (this.type === "skill_category") {
      console.log(`rmss | item.js | Calculating Skill Category Total Bonus for:  ${itemData.name}`);
      const systemData = itemData.system;
      itemData.system.total_bonus = Number(systemData.rank_bonus)
                                  + Number(systemData.stat_bonus)
                                  + Number(systemData.prof_bonus)
                                  + Number(systemData.special_bonus_1)
                                  + Number(systemData.special_bonus_2);
    }
  }

  calculateSkillTotalBonus(itemData) {
    if (this.type === "skill") {
      const systemData = itemData.system;
      console.log(`rmss | item.js | Calculating Skill Total Bonus for: ${itemData.name}`);
      itemData.system.total_bonus = Number(systemData.rank_bonus)
                                  + Number(systemData.category_bonus)
                                  + Number(systemData.item_bonus)
                                  + Number(systemData.special_bonus_1)
                                  + Number(systemData.special_bonus_2);
    }
  }

  calculateSelectedSkillCategoryBonus(itemData) {
    if (this.isEmbedded === null) {
      console.log(`rmss | item.js | Skill ${this.name} has no owner. Not calculating Skill Category bonus`);
    }
    else
    {
      const items = this.parent.items;
      console.log(`rmss | item.js | Skill ${this.name} has owner, calculating skill category bonus.`);
      for (const item of items) {
        if (item.type === "skill_category" && item._id === itemData.system.category) {
          console.log(`rmss | item.js | Calculating Skill Category bonus for skill: ${this.name}`);
          this.system.category_bonus = item.system.total_bonus;
        }
      }
    }
  }
}
