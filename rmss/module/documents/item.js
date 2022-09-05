export class RMSSItem extends Item { 

    /** @override */
    prepareData() {
        // Prepare data for the item. Calling the super version of this executes
        // the following, in order: data reset (to clear active effects),
        // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
        // prepareDerivedData().
        super.prepareData();
    }

    // Set the icon images for newly created images.
    async _preCreate(data, options, userId) {
        await super._preCreate(data, options, userId);
        
        // Do not set on copied items if they have a custom Icon.
        if (!data.name.includes("(Copy)"))
        {
            if (this.type == "armor") {
                await this.updateSource({img: "systems/rmss/assets/default/armor.svg"});
            }
            else if (this.type == "weapon") {
                await this.updateSource({img: "systems/rmss/assets/default/weapon.svg"});
            }
            else if (this.type == "skill") {
                await this.updateSource({img: "systems/rmss/assets/default/skill.svg"});
            }
            else if (this.type == "skill_category") {
                await this.updateSource({img: "systems/rmss/assets/default/skill_category.svg"});
            }
            else if (this.type == "spell") {
                await this.updateSource({img: "systems/rmss/assets/default/spell.svg"});
            }
            else if (this.type == "herb_or_poison") {
                await this.updateSource({img: "systems/rmss/assets/default/herb_or_poison.svg"});
            }
            else if (this.type == "transport") {
                await this.updateSource({img: "systems/rmss/assets/default/transport.svg"});
            }
        }
    }

    calculateSkillCategoryTotalBonus(itemData) {
        if (this.type === "skill_category") {
            const systemData = itemData.system;
            itemData.system.total_bonus = Number(systemData.rank_bonus)+Number(systemData.stat_bonus)+Number(systemData.prof_bonus)+Number(systemData.special_bonus_1)+Number(systemData.special_bonus_2);   
        } 
    }

    prepareDerivedData() {
        const itemData = this;
        const systemData = itemData.system;
        const flags = itemData.flags.rmss || {};
    
        // Make separate methods for each item type to keep things organized.
        this._prepareSkillCategoryData(itemData);
        this._prepareSkillData(itemData);
      }

      _prepareSkillCategoryData(itemData) {
        if (itemData.type !== 'skill_category') return;
    
        // Make modifications to data here. For example:
        //const data = itemData.data;
    
        // Calculate Stat Bonuses        
        this.calculateSkillCategoryTotalBonus(itemData);
    }

    _prepareSkillData(itemData) {
        if (itemData.type !== 'skill') return;

        // Make modifications to data here. For example:
        const systemData = itemData.system;

        // Calculate Stat Bonuses
        itemData.system.total_bonus = Number(systemData.rank_bonus)+Number(systemData.category_bonus)+Number(systemData.item_bonus)+Number(systemData.special_bonus_1)+Number(systemData.special_bonus_2);
    }
}
