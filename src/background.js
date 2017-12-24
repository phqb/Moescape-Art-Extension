(async () => {
    let options = {};

    Object.assign(options, await browser.storage.local.get([
        'backgroundChangingTimming', 
        'backgroundSize'
    ]));

    console.log(`[Moescape Art] Options: ${JSON.stringify(options)}`);

    browser.contextMenus.create({
        id: 'change-image-daily',
        type: 'radio',
        title: 'Change image daily',
        contexts: ['all'],
        checked: options.backgroundChangingTimming == 'daily',
        onclick: () => browser.storage.local.set({
            backgroundChangingTimming: 'daily'
        }).then(null, (error) => console.log(`[Moescape Art] ${error}`))
    });
    
    browser.contextMenus.create({
        id: 'change-image-on-newtab',
        type: 'radio',
        title: 'Change image when open a new tab',
        contexts: ['all'],
        checked: options.backgroundChangingTimming == 'newtab',
        onclick: () => browser.storage.local.set({
            backgroundChangingTimming: 'newtab'
        }).then(null, (error) => console.log(`[Moescape Art] ${error}`))
    });
    
    browser.contextMenus.create({
        id: 'separator-1',
        type: 'separator',
        contexts: ['all']
    });
    
    browser.contextMenus.create({
        id: 'background-size',
        type: 'normal',
        title: 'Background size',
        contexts: ['all']
    });
    
    browser.contextMenus.create({
        id: 'background-size-cover',
        type: 'radio',
        title: 'cover',
        contexts: ['all'],
        checked: options.backgroundSize == 'cover',
        onclick: () => browser.storage.local.set({
            backgroundSize: 'cover'
        }).then(null, (error) => console.log(`[Moescape Art] ${error}`))
    });
    
    browser.contextMenus.create({
        id: 'background-size-contain',
        type: 'radio',
        title: 'contain',
        contexts: ['all'],
        checked: options.backgroundSize == 'contain',
        onclick: () => browser.storage.local.set({
            backgroundSize: 'contain'
        }).then(null, (error) => console.log(`[Moescape Art] ${error}`))
    });
    
    browser.contextMenus.create({
        id: 'background-size-full-width',
        type: 'radio',
        title: 'full width',
        contexts: ['all'],
        checked: options.backgroundSize == 'full-width',
        onclick: () => browser.storage.local.set({
            backgroundSize: 'full-width'
        }).then(null, (error) => console.log(`[Moescape Art] ${error}`))
    });
    
    browser.contextMenus.create({
        id: 'background-size-full-height',
        type: 'radio',
        title: 'full-height',
        contexts: ['all'],
        checked: options.backgroundSize == 'full-height',
        onclick: () => browser.storage.local.set({
            backgroundSize: 'full-height'
        }).then(null, (error) => console.log(`[Moescape Art] ${error}`))
    });
})()