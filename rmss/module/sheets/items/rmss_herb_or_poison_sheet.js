// Our Item Sheet extends the default
export default class RMSSHerbAndPoisonSheet extends ItemSheet {

    // Set the height and width
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 440,
            template: "systems/rmss/templates/sheets/items/rmss-herb-or-poison-sheet.html",
            classes: ["rmss", "sheet", "item"]
        });
    }
    
    // If our sheet is called here it is.
    get template() {
        return `systems/rmss/templates/sheets/items/rmss-herb-or-poison-sheet.html`;
    }

    // Make the data available to the sheet template
    getData() {
        const baseData = super.getData();

        let sheetData = {
            owner: this.item.isOwner,
            editable :this.isEditable,
            item: baseData.item,
            data: baseData.item.data.data,
            config: CONFIG.rmss
        };

        return sheetData;
        }
}