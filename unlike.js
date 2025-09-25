(function autoUnlike() {
    console.log("🚀 Auto-Unlike script started");

    // ==============================
    // 🔧 CONFIGURABLE SELECTORS
    // ==============================
    const SELECT_BUTTON_TEXT = "Select"; // button text to start multi-select
    const CONTAINER_SELECTOR = 'div[data-bloks-name="bk.components.Collection"]';
    const SELECTED_COUNT_SELECTOR = 'span[data-bloks-name="bk.components.Text"][style*="color: rgb(142, 142, 142)"]';
    const UNLIKE_TEXT_SELECTOR = 'div[data-bloks-name="bk.components.RichText"] span[data-bloks-name="bk.components.TextSpan"][style*="color: rgb(237, 73, 86)"]';
    const UNLIKE_CONFIRM_SELECTOR = 'button._a9--._ap36._a9_1 div._ap3a._aacp._aacw._aac-._aad6';
    const SELECTABLE_BTN_SELECTOR = 'div[style*="circle__outline__24-4x.png"]'; // circle button

    // ==============================
    // ⏱️ CONFIGURABLE DELAYS
    // ==============================
    const DELAY_CLICK = 300;     // between item clicks
    const DELAY_UNLIKE = 300;    // wait before confirming unlike
    const LOOP_INTERVAL = 10000; // restart safety interval

    // Step 0: Click the "Select" button if available
    let selectBtn = Array.from(document.querySelectorAll('div'))
        .find(el => el.textContent.trim() === SELECT_BUTTON_TEXT);
    if (selectBtn) {
        console.log("✅ Clicking 'Select' button");
        selectBtn.click();
    }

    let container = document.querySelector(CONTAINER_SELECTOR);
    if (!container) {
        console.warn("⚠️ Container not found, retrying...");
        setTimeout(autoUnlike, 2000);
        return;
    }

    function clickNext() {
        // Step 1: Check if 30 are already selected
        let selectedSpan = document.querySelector(SELECTED_COUNT_SELECTOR);

        if (selectedSpan) {
            let selectedCount = parseInt(selectedSpan.textContent) || 0;
            if (selectedCount >= 30) {
                console.log("🛑 30 items selected, attempting to unlike...");
                let unlikeDiv = document.querySelector(UNLIKE_TEXT_SELECTOR);

                if (unlikeDiv) {
                    unlikeDiv.click();
                    console.log("👉 Clicked 'Unlike' text");

                    setTimeout(() => {
                        let unlikeBtn = document.querySelector(UNLIKE_CONFIRM_SELECTOR);
                        if (unlikeBtn) {
                            unlikeBtn.click();
                            console.log("💔 Unlike confirmed!");
                        } else {
                            console.warn("⚠️ Unlike confirm button not found");
                        }
                    }, DELAY_UNLIKE);
                }
                return;
            }
        }

        // Step 2: Find next unclicked button
        let btn = container.querySelector(`${SELECTABLE_BTN_SELECTOR}:not(.clicked)`);

        if (!btn) {
            console.log("✅ No more selectable items found in current view");
            return;
        }

        // Step 3: Click button
        btn.click();
        btn.classList.add('clicked');
        console.log("✅ Selected one more item");

        setTimeout(clickNext, DELAY_CLICK);
    }

    // Watch for new items added to container
    const observer = new MutationObserver(() => {
        let newBtns = container.querySelectorAll(`${SELECTABLE_BTN_SELECTOR}:not(.clicked)`);
        if (newBtns.length > 0) {
            console.log(`🔎 Found ${newBtns.length} new selectable items`);
        }
    });
    observer.observe(container, { childList: true, subtree: true });

    // Start clicking
    clickNext();

    // Restart loop every 10s to avoid freeze
    setTimeout(autoUnlike, LOOP_INTERVAL);
})();
