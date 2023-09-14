console.log('content-script.js');

const PROMPTS = {
    proofread: `Proofread: 
    
$CLIPBOARD$`,
}

String.prototype.mapReplace = function(map) {
    var regex = [];
    for(var key in map)
        regex.push(key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
    return this.replace(new RegExp(regex.join('|'),"g"),function(word){
        return map[word];
    });
};

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(message)
        if (message.prompt === undefined || PROMPTS[message.prompt] === undefined) {
            return;
        }

        setTimeout(async () => {
            addPromptOnPage(await renderPrompt(message.prompt))
        }, 500);
    }
)

function addPromptOnPage(prompt) {
    const prompt_textarea = document.getElementById("prompt-textarea")
    setNativeValue(prompt_textarea, prompt)
    prompt_textarea.dispatchEvent(new Event('input', { bubbles: true }))
    prompt_textarea.parentNode.querySelector('button').click()
}

async function renderPrompt(prompt) {
    const text = await navigator.clipboard.readText();
    return PROMPTS[prompt].mapReplace({
        '$CLIPBOARD$': text,
    })
}

function setNativeValue(element, value){
    const {set: valueSetter} = Object.getOwnPropertyDescriptor(element, 'value') || {}
    const prototype = Object.getPrototypeOf(element)
    const {set: prototypeValueSetter} = Object.getOwnPropertyDescriptor(prototype, 'value') || {}

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value)
    } else if (valueSetter) {
        valueSetter.call(element, value)
    } else {
        throw new Error('The given element does not have a value setter')
    }
}
