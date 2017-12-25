import Utils from './utils.js';
import Actions from './actions.js';
import Events from './events.js';

Utils.ready(async () => {
    const $image = () => document.getElementsByClassName('container__image-container__image')[0];
    const $background = () => document.getElementsByClassName('container__image-container__image-background')[0];
    const $description = () => document.getElementsByClassName('container__description-container')[0];
    const $descriptionMask = () => document.getElementsByClassName('container__description-container__mask')[0];
    const $reloadButton = () => document.getElementsByClassName('container__description-container__reset-button')[0];
    const $topSites = () => document.getElementsByClassName('container__topsites-wrapper__topsites-container__topsites')[0];
    const $topSitesWrapper = () => document.getElementsByClassName('container__topsites-wrapper')[0];
    const $topSitesCloseButton = () => document.getElementsByClassName('container__topsites-wrapper__topsites-container__title-container__close-button')[0];
    const $containerTabsButton = () => document.getElementsByClassName('container__tabs-button')[0];
    const $downloadButton = () => document.getElementsByClassName('container__description-container__text-container__title-container__download-button')[0];
    const $loadingIcon = () => document.getElementsByClassName('container__image-container__image__loading-icon-container')[0];

    const descriptionHoverEventHandler = Events.container__description_container__getHoverEventHandler({ 
        $container: $description, 
        $mask: $descriptionMask 
    });

    $description().addEventListener('mouseover', descriptionHoverEventHandler);

    $topSitesCloseButton().addEventListener('click', Events.container__topsitesContainer__titleContainer__closeButton__getClickEventHandler({
        $topSites,
        $topSitesWrapper
    }));

    $containerTabsButton().addEventListener('click', Events.container__tabsButton__getClickEventHandler({
        $topSitesWrapper,
        loadTopSites: Actions.getLoadTopSites({ 
            $topSites 
        })
    }));

    if (typeof browser !== 'undefined') {
        browser.storage.onChanged.addListener((changes, areaName) => {
            if (changes.backgroundChangingTimming || changes.backgroundSize) {
                let options = {};

                if (changes.backgroundChangingTimming) {
                    options.backgroundChangingTimming = changes.backgroundChangingTimming.newValue;
                }

                if (changes.backgroundSize) {
                    options.backgroundSize = changes.backgroundSize.newValue;
                }

                Actions.applyOptions({ options, $image });
            }
        });
    } else {
        console.log(`'browser' is undefined. Perhap I'm not being run as an extension.`);
    }

    let options = {};

    if (typeof browser !== 'undefined') {
        Object.assign(options, await browser.storage.local.get([
            'backgroundChangingTimming', 
            'backgroundSize'
        ]));
    } else {
        console.log(`'browser' is undefined. Perhap I'm not being run as an extension.`);
    }

    Actions.applyOptions({ options, $image });

    Actions.getLoadImage({ 
        $description, 
        $image, 
        $background, 
        $reloadButton, 
        $downloadButton, 
        $loadingIcon,
        options,
        descriptionHoverEventHandler 
    })();
});