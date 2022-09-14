// Our Item Sheet extends the default
export default class RMSSSkillSheet extends ItemSheet {

    // Set the height and width
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 440,
            template: "systems/rmss/templates/sheets/skills/rmss-skill-sheet.html",
            classes: ["rmss", "sheet", "item"]
        });
    }
    
    // If our sheet is called here it is.
    get template() {
        return `systems/rmss/templates/sheets/skills/rmss-skill-sheet.html`;
    }

    // Make the data available to the sheet template
    async getData() {
        const baseData = await super.getData();

        var enrichedDescription = await TextEditor.enrichHTML(this.item.system.description, {async: true});

        // Get a list of stats that can be used as applicable stats
        var designations = this.getSkillDesignations(CONFIG);

        // Get a list of the parent item's skill categories for the dropdown
        var owned_skillcats = this.prepareSkillCategoryValues();

        // Figure out if a valid Skill Category is already selected
        var selected_skillcat = this.prepareSelectedSkillCategory(owned_skillcats, this.object.system.category);

        //this.prepareSelectedSkillCategoryBonus(selected_skillcat);

        let sheetData = {
            owner: this.item.isOwner,
            editable :this.isEditable,
            item: baseData.item,
            system: baseData.item.system,
            config: CONFIG.rmss,
            owned_skillcats: owned_skillcats,
            enrichedDescription: enrichedDescription,
            selected_skillcat: selected_skillcat,
            designations: designations
        };

        return sheetData;
        }

    prepareSkillCategoryValues() {            
        // If there is no player owning this Skill then we cannot assign a category.
        var skillcat_list = {None: "Skill Has No Owner", };

        if (this.item.isEmbedded === null) {
            return(skillcat_list);
        } 
        else
        {
            const skillcats = this.item.parent.getOwnedSkillCategories();
            return(skillcats);
        }
    }

    getSkillDesignations(CONFIG) {
        var designations = {};

        // Get a list of designations from the config
        for (const item in CONFIG.rmss.skill_designations) {
            designations[CONFIG.rmss.skill_designations[item]] = CONFIG.rmss.skill_designations[item];
        }
        return designations;
    }

    // Determine which Stat is selected and test that it is in the current list of categories.
    prepareSelectedSkillCategory(ownedskillcats, selected_category) {
        
        // Start By setting the owned category to None, if nothing happens this will be the default
        var default_selected_category = "None";

        // Get a list of keys from the currently owned skill categories and compare to the current value
        if (Object.keys(ownedskillcats).includes(selected_category)) {
            return(selected_category);
        } else {
            return(default_selected_category);
        }
    }

    prepareSelectedSkillCategoryBonus(selected_skillcat) {
        if (this.item.isEmbedded === null) {
            console.log("Skill has no owner");
            } 
        else 
            {
            const items = this.object.parent.items;

            for (const item of items) {
                if (item.type === "skill_category" && item._id === selected_skillcat) {
                    console.log("rmss | rmss_skill_sheet | Calculating Skill Category bonus for skill: " + this.object.name);
                    this.object.system.category_bonus = item.system.total_bonus;
                }
            }
        }
    }
}