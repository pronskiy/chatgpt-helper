chrome.commands.onCommand.addListener(async command => {
  if (command === "new-tab") {
    const win = await chrome.windows.getCurrent();
    await chrome.windows.update(win.id, { focused: true });
    const new_tab = await chrome.tabs.create({
        url: 'https://chat.openai.com/'
    });
    await sleep(1500);
    await chrome.tabs.sendMessage(
        new_tab.id, 
        {prompt: 'proofread'},
    )
  }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
