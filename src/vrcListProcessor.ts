import { IProcessor } from './urlProcessor';
import { VRCXHandler } from './vrcxHandler';
import { FavoriteManager } from './favoriteManager';
// @ts-ignore
import { waitForKeyElements } from "./waitForKeyElements";

export class VRCListProcessor implements IProcessor {
    worldCards: Array<JQuery<HTMLElement>>;
    favoriteManager: FavoriteManager;
    interval: NodeJS.Timeout | undefined;
    constructor(private vrcx: VRCXHandler) {
        this.worldCards = new Array();
        this.favoriteManager = this.vrcx.favoriteManager;
     }

    public load() {
        console.log('VRChatProcessor loaded');

        console.log("Detouring attachShadow");
        let originalAttachShadow = Element.prototype.attachShadow;

        let self = this
        Element.prototype.attachShadow = function (opts) {
            let name: string = this.tagName;

            if (name.toLowerCase() === "world-card" || name.toLowerCase() === "world-card-ron" || (name.toLowerCase() === "div" && this.getAttribute("id") === "world")) {
                // @ts-ignore
                self.worldCards.push($(this));
            }

            return originalAttachShadow.call(this, opts);
        };

        this.interval = setInterval(() => {
            if (self.worldCards.length > 0) {
                self.doWorldCardButtons(self);
            }
        }, 500)
    }

    public processUrl(url: URL): void {
        if (url.pathname.startsWith('/world')) {
            waitForKeyElements('world-page', () => { setTimeout(() => this.addWorldBtn_VrcList(), 1000) }, true);
        }
    }


    public addWorldBtn_VrcList() {
        let page = $("world-page")[0];
        let shadow = page.shadowRoot
        let link = $("a#world-link", shadow);
        let newLink = link.clone();

        console.log("Adding button to vrclist page", shadow, link, newLink)

        // Get the world ID from the existing link href
        console.log("Current href", link.attr("href"))
        let worldId = link.attr("href").split('/').pop()
        newLink.attr('href', this.vrcx.constructWorldDialogURL(worldId));
        newLink.attr('id', 'vrcx-world-link')
        newLink.attr('target', '_self');
        newLink.text('Open with VRCX');

        this.processWorldCard($(page), worldId)

        link.after(newLink);
    }

    public doWorldCardButtons(self: VRCListProcessor, card?: Element, id?: string) {
        if (self.worldCards.length === 0) {
            return;
        }

        console.log(`Adding VRCX buttons to ${self.worldCards.length} world cards`);

        self.worldCards.forEach(function (element, idx) {
            self.processWorldCard(element)
        })

        self.worldCards = new Array();
    }

    public processWorldCard(element: JQuery<Element>, id?: string) {
        let card = $(element);
        let worldId = id ?? card.children("span[slot='world-id']").text();

        //console.log(`Adding VRCX button to world card ${idx} with ID ${worldId}`, card)

        if (worldId === undefined)
            return;
        
        let favManager = this.favoriteManager;

        let visitedButton = $("button#visited-circle", card[0].shadowRoot)
        let newButton = visitedButton.clone();
        newButton.attr("id", "vrcx-circle");
        newButton.attr("title", `Open with VRCX (Shift-Click to local favorite to '${favManager.getFavoriteList()}' list)`);

        // copy css from old button
        let style = getComputedStyle(visitedButton[0]);
        let left = parseFloat(style.left) + 32;
        // Copy styles from getComputedStyle to new button
        let styles = {};
        let btn = newButton[0]
        switch (style.constructor.name) {
            // Fix for firefox
            case 'CSS2Properties':
                Object.values(style).forEach((prop: string) => {
                    var val = style.getPropertyValue(prop);
                    if (val === "" || val === undefined || val === null) return;

                    // @ts-ignore
                    btn.style[prop] = val;
                });
                break;
            case 'CSSStyleDeclaration':
                Object.assign(btn.style, style);
                break;
            default:
                console.error('Unknown style object prototype');
                break;
        }
        newButton.css("left", left + "px");

        newButton.on("mouseover", function () {
            newButton.css("cursor", "pointer");
            newButton.css("transform", "scale(1.1)");
        })

        newButton.on("mouseout", function () {
            newButton.css("cursor", "default");
            newButton.css("transform", "scale(1)");
        })

        let icon = newButton.children("img");
        icon.attr("id", "vrcx-icon");
        icon.attr("src", "https://raw.githubusercontent.com/vrcx-team/VRCX/master/VRCX.ico");
        // limit img size to 24x24px
        icon.attr("style", "width: 24px; height: 24px;");

        let vrcx = this.vrcx;
        newButton.on("click", function (event) {
            // Check if shift is being held down
            if (event.shiftKey) {
                // Prompt user for list name
                favManager.promptFavoriteList(true)

                let list = favManager.getFavoriteList();
                console.log("Favoriting world in VRCX", worldId, list);

                favManager.addLocalFavorite(worldId);
            }

            vrcx.openWorldDialog(worldId);
        })

        visitedButton.after(newButton);
    }
}