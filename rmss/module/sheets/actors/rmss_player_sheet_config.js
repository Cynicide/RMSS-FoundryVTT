export default class RMSSActorSheetConfig extends FormApplication {

  constructor(selectOptions, character) {
    super();
    this.selectOptions = selectOptions;
    this.character = character;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["form"],
      popOut: true,
      template: "systems/rmss/templates/sheets/actors/apps/actor-settings.html"
    });
  }

  getData() {
    // Send data to the template
    return {
      selectOptions: this.selectOptions
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _updateObject(event, formData) {
    console.log("Deleting Old Skill Categories.");
    for (const item of this.character.items) {
      if (item.type === "skill_category") {
        item.delete();
      }
    }

    const pack = game.packs.get(formData.selectOptions);
    const skillCategoryData = await pack.getIndex();

    console.log("Importing New Skill Categories.");

    for (const sc of skillCategoryData) {
      const newitem = await pack.getDocument(sc._id);

      let newDocuments = [];
      if (newitem.type === "skill_category") {
        console.log(newitem);
        newDocuments.push(newitem);
      }
      if (newDocuments.length > 0) {
        await Item.createDocuments(newDocuments, {parent: this.character});
      }
    }
  }
}

