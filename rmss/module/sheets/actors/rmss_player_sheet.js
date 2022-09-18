export default class RMSSPlayerSheet extends ActorSheet {
    
    // Override Default Options, Set CSS Classes, Set Default Sheet, Set up Sheet Tabs
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/rmss/templates/sheets/actors/rmss-character-sheet.html",
            classes: ["rmss", "sheet", "actor"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
        });
    }
    
    // Make the data available to the sheet template
    getData() {
        const context = super.getData();
        
        // Use a safe clone of the actor data for further operations.
        const actorData = this.actor.toObject(false);

        // Add the actor's data to context.data for easier access, as well as flags.
        context.system = actorData.system;
        context.flags = actorData.flags;
        
        // Prepare character data and items.
        if (actorData.type == 'character') {
            this._prepareItems(context);
            this._prepareCharacterData(context);
        }
        
        // Prepare NPC data and items.
        if (actorData.type == 'npc') {
            this._prepareItems(context);
        }       
        return context;
    }
    
    //Override this method to check for duplicates when things are dragged to the sheet
    // We don't want duplicate skills and skill categories.
    async _onDropItem(event, data) {
        
        // Reconstruct the item from the event
        const newitem = await Item.implementation.fromDropData(data);
        const itemData = newitem.toObject();
        
        // To Do: Seperate Skills and Skill Categories. Increment Counts for items
        if (itemData.type === "skill_category"){

            // Get the already owned Items from the actor and push into an array
            const owneditems = this.object.getOwnedItemsByType("skill_category");

            var ownedskillcatlist = Object.values(owneditems);
         
            // Check if the dragged item is not in the array and not owned
            if (!ownedskillcatlist.includes(itemData.name)) {
                console.log("Not Owned!");
                super._onDropItem(event, data);
           }
        } else if ( itemData.type === "skill") {
            // Get the already owned Items from the actor and push into an array
            const owneditems = this.object.getOwnedItemsByType("skill");

            var ownedskilllist = Object.values(owneditems);

            // Check if the dragged item is not in the array and not owned
            if (!ownedskilllist.includes(itemData.name)) {
                console.log("Not Owned!");
                super._onDropItem(event, data);
            }
        }
        else {
            super._onDropItem(event, data);
        }
    }

    _prepareCharacterData(context) {    
    }
    
    _prepareItems(context) {
        console.log("rmss | rmss_player_sheet.js | Preparing items for: "+ this.name);
        // Initialize containers.
        const gear = [];
        const playerskill= [];
        const skillcat = [];
        const weapons = [];
        const equipables = [];
        const herbs = [];
        
        // Iterate through items, allocating to containers
        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;
            // Append to gear.
            if (i.type === 'item') {
                gear.push(i);
            }
            else if (i.type === 'weapon') {
                weapons.push(i);
            }
            else if (i.type === 'herb_or_poison') {
                herbs.push(i);
            }
            // Append to skill categories.
            else if (i.type === 'skill_category') {
                skillcat.push(i);
            }
            // Append to playerskill
            else if (i.type === 'skill') {
                playerskill.push(i);
            }             
            else if (i.type === 'armor') {
                equipables.push(i);
            }
        }
        
        
        // Sort Skill/Skillcat Arrays
        skillcat.sort(function (a, b){
            if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
        });

        playerskill.sort(function (a, b){
            if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
        });


        // Assign and return
        context.gear = gear;
        context.skillcat = skillcat;
        context.playerskill = playerskill;
        context.weapons = weapons;
        context.equipables = equipables;
        context.herbs = herbs;
    }
    
    activateListeners(html) {
        super.activateListeners(html);
        
        // Render the item sheet for viewing/editing prior to the editable check.
        html.find('.item-edit').click(ev => {
            const item = this.actor.items.get(ev.currentTarget.getAttribute("data-item-id"));
            //console.log(this);
            item.sheet.render(true);
        });
        
        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;
        
        // Add Item
        html.find('.item-create').click(this._onItemCreate.bind(this));
        
        // Delete Item
        html.find('.item-delete').click(ev => {
            console.log(ev.currentTarget.getAttribute("data-item-id"));
            const item = this.actor.items.get(ev.currentTarget.getAttribute("data-item-id"));
            item.delete();
        });

        // Check/Uncheck Favorite
        html.find('.skill-favorite').click(ev => {
            const item = this.actor.items.get(ev.currentTarget.getAttribute("data-item-id"));
            console.log(item);
            console.log("Before change: " + item.system.favorite);
            if (item.system.favorite === true) {
                console.log("Setting False");
                item.update({system: {"favorite": false}});
            } else {
                console.log("Setting True");
                item.update({system: {"favorite": true}});
            }            
            console.log("After change: " + item.system.favorite);
        });

        // Equip/Unequip Item
        html.find('.equippable').click(ev => {
            const item = this.actor.items.get(ev.currentTarget.getAttribute("data-item-id"));
            console.log(item);
            console.log("Before change: " + item.system.equipped);
            if (item.system.equipped === true) {
                console.log("Setting False");
                item.update({system: {"equipped": false}});
            } else {
                console.log("Setting True");
                item.update({system: {"equipped": true}});
            }            
            console.log("After change: " + item.system.equipped);
        });
        
        // Change New Ranks value when clicked in player sheet. From 0-3.
        html.find('.skill-newrank').click(ev => {
            const item = this.actor.items.get(ev.currentTarget.getAttribute("data-item-id"));

            console.log("Firing in the Player Sheet");
            console.log(ev.currentTarget.getAttribute("value"));
            console.log(ev.currentTarget.getAttribute("data-item-id"));
            
            switch(ev.currentTarget.getAttribute("value")) {
                case "0": 
                    console.log("Skill NewRanks is 0 setting to 1");
                    item.update({system: {new_ranks:{ "value": 1 }}});
                    break;

                case "1": 
                console.log("Skill NewRanks is 1 setting to 2");
                    item.update({system: {new_ranks:{ "value": 2 }}});
                    break;

                case "2": 
                    console.log("Skill NewRanks is 2 setting to 3");
                    item.update({system: {new_ranks:{ "value": 3 }}});
                    break;

                case "3": 
                    console.log("Skill NewRanks is 3 setting to 0");
                    item.update({system: {new_ranks:{ "value": 0 }}});
                    break;
            }
        });
    }
    
    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        
        // Get the type of item to create.
        const type = header.dataset.type;
        
        // Grab any data associated with this control.
        const data = duplicate(header.dataset);
        
        // Initialize a default name.
        const name = `New ${type.capitalize()}`;
        
        // Prepare the item object.
        const itemData = {
            name: name,
            type: type,
            data: data
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.data.type;
        // Finally, create the item!
        return await Item.create(itemData, {parent: this.actor});
    }
}