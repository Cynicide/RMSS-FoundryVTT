export class RMSSItem extends Item { 

    /** @override */
    prepareData() {
        // Prepare data for the item. Calling the super version of this executes
        // the following, in order: data reset (to clear active effects),
        // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
        // prepareDerivedData().
        super.prepareData();
    }

    // Set the images for newly created images (need to fix for copied images).
    async _preCreate(data, options, userId) {
        await super._preCreate(data, options, userId);
        if (!data.img) {
            if (this.data.type == "armor") {
                await this.data.update({img: "systems/rmss/assets/default/armor.svg"});
            }
            else if (this.data.type == "weapon") {
                await this.data.update({img: "systems/rmss/assets/default/weapon.svg"});
            }
            else if (this.data.type == "skill") {
                await this.data.update({img: "systems/rmss/assets/default/skill.svg"});
            }
            else if (this.data.type == "skill_category") {
                await this.data.update({img: "systems/rmss/assets/default/skill_category.svg"});
            }
            else if (this.data.type == "spell") {
                await this.data.update({img: "systems/rmss/assets/default/spell.svg"});
            }
            else if (this.data.type == "herb_or_poison") {
                await this.data.update({img: "systems/rmss/assets/default/herb_or_poison.svg"});
            }
            else if (this.data.type == "transport") {
                await this.data.update({img: "systems/rmss/assets/default/transport.svg"});
            }
        }
    }
    
    calculateSkillCatTotalBonus(itemData) {
         // Calculate Stat Bonuses
         
         const data = itemData.data;

         itemData.data.total_bonus = Number(data.rank_bonus)+Number(data.stat_bonus)+Number(data.prof_bonus)+Number(data.special_bonus_1)+Number(data.special_bonus_2);
    }

    prepareDerivedData() {
        const itemData = this.data;
        const data = itemData.data;
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
        this.calculateSkillCatTotalBonus(itemData);
    }

    _prepareSkillData(itemData) {
        if (itemData.type !== 'skill') return;

        // Make modifications to data here. For example:
        const data = itemData.data;

        // Calculate Stat Bonuses
        itemData.data.total_bonus = Number(data.rank_bonus)+Number(data.category_bonus)+Number(data.item_bonus)+Number(data.special_bonus_1)+Number(data.special_bonus_2);
    }
}
