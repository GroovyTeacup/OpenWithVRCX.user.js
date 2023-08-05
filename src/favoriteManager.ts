import { VRCXHandler } from "./vrcxHandler";

export class FavoriteManager {
    favoriteList: string;
    vrcx: VRCXHandler;
    
    constructor(vrcx: VRCXHandler, defaultFavoriteList: string) {
        this.favoriteList = localStorage.getItem("vrcx_favoriteList") ?? defaultFavoriteList;
        this.vrcx = vrcx;
    }

    public getFavoriteList() : string {
        return this.favoriteList;
    }

    /**
     * Sets the favorite list and saves it to the local storage for the current website.
     * @param favoriteList - The new favorite list to set.
     */
    public setFavoriteList(favoriteList: string) : void {
        this.favoriteList = favoriteList;
        localStorage.setItem("vrcx_favoriteList", favoriteList);
    }

    /**
     * Prompts the user to enter a favorite list to save to.
     * @param save - A boolean indicating whether to save the favorite list.
     * @returns The entered favorite list if the user did not cancel the prompt, otherwise null.
     */
    public promptFavoriteList(save: boolean) : string | null {
        let favoriteList = prompt("Enter a favorite list to save to. You can separate names by commas to add to multiple.", this.favoriteList);
        if (favoriteList === null) {
            return null;
        }

        if (save) 
            this.setFavoriteList(favoriteList);

        return favoriteList;
    }

    /**
     * Adds a local favorite to VRCX for the specified world ID.
     * @param worldId The ID of the world to add as a favorite.
     */
    public addLocalFavorite(worldId: string) : void {
        let list = this.favoriteList.split(",");

        for (let i = 0; i < list.length; i++) {
            let name = list[i].trim();

            this.vrcx.sendVRCXRequest("local-world-favorite", `${worldId}:${name}`);
        }
    }
}