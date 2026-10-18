chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open KOSMOS Sidebar",
    contexts: ["all"]
  });
  console.log("KOSMOS Extension v1.3 Installed");
});

// Handle Context Menu Click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "OPEN_SIDEBAR") {
    // Find the active tab to ensure the side panel opens correctly
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.sidePanel.open({ tabId: tabs[0].id });
        sendResponse({ status: "success" });
      }
    });
    return true; // Keep the message channel open for the async response
  }
});

// We removed openPanelOnActionClick: true to allow the popup to open by default
// Users can now:
// 1. Click icon -> Opens POPUP
// 2. Right click page -> Open KOSMOS SIDEBAR
