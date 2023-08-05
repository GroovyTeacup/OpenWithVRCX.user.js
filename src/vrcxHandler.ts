import { FavoriteManager } from './favoriteManager';
import { IProcessor } from './urlProcessor';
import { VRChatProcessor } from './vrchatProcessor';
import { VRCListProcessor } from './vrcListProcessor';

export class VRCXHandler {
    url: URL;
    currentProcessor: IProcessor;
    favoriteManager: FavoriteManager;
    autoOpen = false;

    constructor() {
        this.url = new URL(window.location.href);
        this.favoriteManager = new FavoriteManager(this, "TODO");
        this.init();
    }

    /**
     * Returns a new instance of a processor based on the provided URL's hostname.
     * @param url - The URL to get the processor for.
     * @returns A new instance of a processor, or null if no processor is available for the provided URL.
     */
    getNewProcessor(url: URL): IProcessor | null {
        switch (url.hostname) {
            case "vrchat.com":
                return new VRChatProcessor(this);
            case "vrclist.com":
                return new VRCListProcessor(this);
            default:
                return null;
        }
    }

    /**
     * Starts the process of handling the current URL by getting the processor for the URL and processing it.
     * If no valid processor is found for the URL, an error is thrown.
     * If the current processor is not set, it is set to the processor for the URL and loaded.
     */
    startProcessURL(): void {
        let processor = this.currentProcessor ?? this.getNewProcessor(this.url);
        if (processor === null) {
            throw new Error("No valid processor found for " + this.url.hostname);
        }

        if (this.currentProcessor === undefined) {
            this.currentProcessor = processor;
            processor.load();
        }

        console.log("Processing URL: " + this.url.href);
        processor.processUrl(this.url);
    }

    public constructVRCXRequestURL(type: string, arg: string) {
        return `vrcx://${type}/${arg}`;
    }

    public constructUserDialogURL(userId: string) {
        return this.constructVRCXRequestURL("user", userId);
    }

    public constructWorldDialogURL(worldId: string) {
        return this.constructVRCXRequestURL("world", worldId);
    }

    /**
     * Sends a VRCX protocol request by constructing a URL and setting the window location to it.
     * @param type - The type of the VRCX protocol request.
     * @param arg - The argument for the VRCX protocol request.
     */
    public sendVRCXRequest(type: string, arg: string) {
        let request = this.constructVRCXRequestURL(type, arg);
        console.log("Making VRCX protocol request", request)
        window.location.href = request;
    }

    /**
     * Opens the VRCX world dialog for the specified world ID.
     * @param worldId The ID of the world to open the dialog for.
     */
    public openWorldDialog(worldId: string) {
        this.sendVRCXRequest("world", worldId);
    }

    /**
     * Opens the VRCX user dialog for the specified user ID.
     * @param userId The ID of the user to open the dialog for.
     */
    public openUserDialog(userId: string) {
        this.sendVRCXRequest("user", userId);
    }
    
    /**
     * Opens the instance dialog for a given world and instance ID.
     * If a shortName/secureName is provided(for secure instances, etc), it will open the dialog for that world/instance instead. instanceID will be ignored.
     * @param {string} worldId - The ID of the world.
     * @param {string} instanceID - The ID of the instance.
     * @param {string} [shortName] - The short name of the world (optional).
     */
    public openInstanceDialog(worldId: string, instanceID?: string | null, shortName?: string | null) {
        if (shortName != null) {
            this.sendVRCXRequest("world", shortName);
            return;
        } else if (instanceID != null) {
            this.sendVRCXRequest("world", `${worldId}:${instanceID}`);
        } else {
            this.sendVRCXRequest("world", worldId);
        }
    }

    init(): void {
        this.startProcessURL()
    }
}