/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode: JQuery) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
    https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
*/
function waitForKeyElements (
    selectorTxt: string,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction: (jNode: JQuery<HTMLElement>) => boolean | void, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce?: boolean,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector?: string  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    let targetNodes: JQuery, btargetsFound: boolean;

    if (typeof iframeSelector === "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
                                       .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function () {
            let jThis = $(this);
            let alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                let cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    // @ts-ignore
    let controlObj = waitForKeyElements.controlObj || {};
    let controlKey = selectorTxt.replace(/[^\w]/g, "_");
    let timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector);
            }, 300);
            controlObj[controlKey] = timeControl;
        }
    }

    // @ts-ignore
    waitForKeyElements.controlObj = controlObj;
}

export { waitForKeyElements }