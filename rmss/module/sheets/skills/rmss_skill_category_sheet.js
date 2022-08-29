// Our Item Sheet extends the default
export default class RMSSSkillCategorySheet extends ItemSheet {

    // Set the height and width
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 440,
            template: "systems/rmss/templates/sheets/skills/rmss-skill-category-sheet.html",
            classes: ["rmss", "sheet", "item"]
        });
    }
    
    // If our sheet is called here it is.
    get template() {
        return `systems/rmss/templates/sheets/skills/rmss-skill-category-sheet.html`;
    }

    // Make the data available to the sheet template
    getData() {
        const baseData = super.getData();

        // Get a list of stats that can be used as applicable stats
        var applicable_stat_list = this.prepareApplicableStatValues(CONFIG);
        
        //Get the currently selected value for all three applicable stats
        var applicable_stat_1_selected = this.prepareApplicableSelectedStat("app_stat_1");
        var applicable_stat_2_selected = this.prepareApplicableSelectedStat("app_stat_2");
        var applicable_stat_3_selected = this.prepareApplicableSelectedStat("app_stat_3");

        // Build the string for Applicable Stats
        var applicable_stat_text = this.buildApplicableStatsText(applicable_stat_1_selected, applicable_stat_2_selected, applicable_stat_3_selected)
        baseData.item.data.data['applicable_stats'] = applicable_stat_text


        let sheetData = {
            owner: this.item.isOwner,
            editable :this.isEditable,
            item: baseData.item,
            data: baseData.item.data.data,
            config: CONFIG.rmss,
            applicable_stat_list: applicable_stat_list,
            applicable_stat_1_selected: applicable_stat_1_selected,
            applicable_stat_2_selected: applicable_stat_2_selected,
            applicable_stat_3_selected: applicable_stat_3_selected
        };

        console.log(this.item)

        return sheetData;
        }

        async _setApplicableStat(item, ev) {            
            // Build a JSON Object from the select tag value and select name (item data attribute key) 
            var update_key = ev.currentTarget.getAttribute("name");
            var update_data = ev.target.value;
            
            // Update Item Data
            await item.update({[update_key]: update_data});
        }

        prepareApplicableStatValues(CONFIG) {
            var applicable_stat_1_list = {None: "None"}

            // Get a list of stat shortnames from the config
            for (const item in CONFIG.rmss.stats) {
                applicable_stat_1_list[CONFIG.rmss.stats[item]['shortname']] = CONFIG.rmss.stats[item]['shortname'];
            }
            return applicable_stat_1_list;
        }

        // Determine which Stat is selected for applicable stats
        prepareApplicableSelectedStat(app_stat) {
            var applicable_stat_selected = "";
            applicable_stat_selected = this.item.data.data[app_stat];
            return applicable_stat_selected;
        }

        // Build the text that is displayed in the Applicable Stats field
        buildApplicableStatsText(app_stat_1, app_stat_2, app_stat_3) {

            if (app_stat_1 === "None") {
                return("None")
            }
            else if (app_stat_1 !== "None" && app_stat_2 === "None") {
                return(app_stat_1)
            }
            else if (app_stat_1 !== "None" && app_stat_2 !== "None" && app_stat_3 === "None" ) {
                return(app_stat_1 + "/" + app_stat_2 )
            }
            else if (app_stat_1 !== "None" && app_stat_2 !== "None" && app_stat_3 !== "None" ) {
                return(app_stat_1 + "/" + app_stat_2 + "/" + app_stat_3 )
            }
            else {
                return("None")
            }
        }   

        activateListeners(html) {
            super.activateListeners(html);
            
            // -------------------------------------------------------------
            // Everything below here is only needed if the sheet is editable
            if (!this.isEditable) return;
            
                // Update Applicable Stats for Skill Categories
                html.find('.stat-selector').change(ev => {
                    this._setApplicableStat(this.item, ev);
                });
        }
}