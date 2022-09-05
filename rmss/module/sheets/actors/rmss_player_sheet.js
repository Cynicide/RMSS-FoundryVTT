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
        
        if (itemData.type === "skill_category" || itemData.type === "skill"){

            // Get the already owned Items from the actor and push into an array
            const owneditems = this.object.getOwnedSkillCategories();
            
            console.log(owneditems);

            var owneditemslist = Object.values(owneditems);
         
            // Check if the dragged item is not in the array and not owned
            if (!owneditemslist.includes(itemData.name)) {
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
        // Initialize containers.
        const gear = [];
        const playerskill= [];
        const skillcat = [];
        
        // Iterate through items, allocating to containers
        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;
            // Append to gear.
            if (i.type === 'item' || i.type === 'armor' || i.type === 'weapon' || i.type === 'herb_or_poison') {
                gear.push(i);
            }
            // Append to skill categories.
            else if (i.type === 'skill_category') {
                skillcat.push(i);
            }
            // Append to playerskill
            else if (i.type === 'skill') {
                playerskill.push(i);
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
    }
    
    activateListeners(html) {
        super.activateListeners(html);
        
        // NOTE: Can you do skill/item favorites this way?
        
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
            const item = this.actor.items.get(ev.currentTarget.getAttribute("data-item-id"));
            //console.log(ev.currentTarget.getAttribute("data-item-id"));
            item.delete();
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
        //delete itemData.data["type"];
        delete itemData.data.type;
        // Finally, create the item!
        return await Item.create(itemData, {parent: this.actor});
    }
}