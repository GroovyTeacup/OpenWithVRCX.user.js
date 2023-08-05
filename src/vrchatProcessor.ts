import { IProcessor } from './urlProcessor';
import { VRCXHandler } from './vrcxHandler';

export class VRChatProcessor implements IProcessor {
    constructor(private vrcx: VRCXHandler) {}

    public load() {
        console.log('VRChatProcessor loaded');
    }

    public processUrl(url: URL) : void {
        let id = url.pathname.split('/').pop();
        if (url.pathname.startsWith('/home/world/')) {
            this.addWorldBtn();
        } else if (url.pathname.startsWith('/home/launch')) {
            this.addInstanceBtn();
        } else if (url.pathname.startsWith('/home/user/')) {
            this.addUserBtn();
        } else {
            console.log('No button to add on this page');
        }
    }

    /**
     * Adds a VRCX button to the user page.
     * @returns void
     */
    public addUserBtn() : void {
        console.log('Adding VRCX button to user page');
        
        let userId = this.vrcx.url.pathname.split('/').pop();
        let newHref = this.vrcx.constructUserDialogURL(userId ?? "0");
    
        // Get the last social icon in the sheet
        var socialIcon = $('a.social-icon').last();
        var buttonParent = socialIcon.parent();
        var newButton = buttonParent.clone();
        var newButtonLink = newButton.children('a');
        newButtonLink.attr('href', newHref);
        // Make button open link without opening a whole new tab
        newButtonLink.attr('target', '_self');
    
        // get social-svg child
        var container = newButtonLink.children('.social-container');
        var socialSvg = container.children('svg.social-svg');
        socialSvg.attr('viewBox', '0 0 64 64');
        socialSvg.attr("preserveAspectRatio", "xMidYMid meet");
    
        // Create scuffed vrcx icon
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(0.000000,64.000000) scale(0.100000,-0.100000)');
        g.setAttribute('fill', '#000000');
        g.setAttribute('stroke', 'none');
        g.setAttribute("class", "social-svg-mask");
        g.setAttribute("style", "transition: fill 170ms ease-in-out 0s; fill: rgb(0, 0, 0);");
        var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M0 320 l0 -320 320 0 320 0 0 320 0 320 -320 0 -320 0 0 -320z m582 273 c16 -14 18 -34 18 -193 0 -185 -4 -205 -45 -212 -18 -3 -20 -12 -23 -81 -2 -52 -7 -77 -15 -76 -7 0 -39 35 -72 77 l-60 77 -160 3 c-96 1 -164 7 -172 13 -18 15 -19 379 -1 397 9 9 81 12 262 12 218 0 252 -2 268 -17z');
        g.appendChild(path1);
        var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M187 528 c4 -7 24 -37 45 -67 21 -30 38 -58 38 -63 0 -5 -20 -38 -45 -72 -25 -35 -45 -66 -45 -70 0 -3 16 -6 35 -6 31 0 40 6 67 45 18 25 34 45 37 45 3 0 19 -20 34 -45 26 -41 32 -45 68 -45 21 0 39 3 39 8 0 4 -20 36 -45 71 -25 36 -45 68 -45 73 0 5 17 32 38 61 59 80 58 77 14 77 -35 0 -43 -5 -67 -40 -15 -22 -31 -40 -34 -40 -3 0 -17 18 -31 40 -23 37 -28 40 -68 40 -32 0 -41 -3 -35 -12z');
        g.appendChild(path2);
    
        // Remove old icon, add new one
        socialSvg.children('g').remove();
        socialSvg.append(g);
    
        // Add the new link after the last social icon
        buttonParent.after(newButton);
    }

    /**
     * Adds a VRCX button to the instance page.
     * @returns void
     */
    public addInstanceBtn() : void {
        console.log('Adding VRCX button to instance page');
        let btn = $('button:contains("INVITE ME")');
        let h2 = btn.parent()
        let newButton = h2.clone();
        let newButtonLink = newButton.children('button');
    
        let url = this.vrcx.url;
        let worldId = url.searchParams.get('worldId');
        let instanceId = url.searchParams.get('instanceId');
        let shortName = url.searchParams.get('shortName') ?? url.searchParams.get('secureName');
    
        let vrcx = this.vrcx
    
        newButton.on('click', function () {
            if (worldId == null) 
                return console.error('World ID is null');
            if (instanceId == null)
                return console.error('Instance ID is null');

            vrcx.openInstanceDialog(worldId, instanceId, shortName)
        })
    
        newButtonLink.text('Open with VRCX');
    
        // Add the new link after the old one
        h2.after(newButton);
    }
    
    /**
     * Adds a VRCX button to the world page.
     * @returns void
     */
    public addWorldBtn() : void {
        console.log('Adding VRCX button to world page');
        // We're just gonna copy this lol
        var link = $('a:contains("Public Link")');

        let worldId = this.vrcx.url.pathname.split('/').pop();
        if (worldId == null)
            return console.error('World ID is null');
        
        let newHref = this.vrcx.constructWorldDialogURL(worldId);
    
        var newLink = link.clone();
        newLink.attr('href', newHref);
        newLink.text('Open with VRCX');
        // make button open link without opening a whole new tab (i thought this one already didn't do that..)
        newLink.attr('target', '_self');
    
        // Add the new link after the old one
        link.after(newLink);
    }
}