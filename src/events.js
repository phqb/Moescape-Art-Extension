export default {
    /**
     * Get an on-hover event listener of given 'container__description_container' element.
     * @param {object} $ Depended elements.
     */
    container__description_container__getHoverEventHandler: ($) => {
        let onMouseOut = null;

        return (e) => {
            $.$container().style.opacity = 1;
            $.$mask().style.visibility = 'hidden';

            if (onMouseOut) {
                clearTimeout(onMouseOut);
            }

            onMouseOut = setTimeout(() => {
                $.$container().style.opacity = 0;
                $.$mask().style.visibility = 'visible';
            }, 10000);
        };
    },

    /**
     * Get an on-click event listener of given 
     * 'container__topsitesContainer__titleContainer__closeButton__getClickEventHandler' element.
     * @param {object} $ Depended elements.
     */
    container__topsitesContainer__titleContainer__closeButton__getClickEventHandler: ($) => {
        return (e) => {
            $.$topSitesWrapper().style.visibility = 'hidden';
            $.$topSites().style.visibility = 'hidden';   
        };
    },

    /**
     * Get an on-click event listener of given 'container__tabsButton' element.
     * @param {object} $ Depended elements.
     */
    container__tabsButton__getClickEventHandler: ($) => {
        return (e) => {
            $.$topSitesWrapper().style.opacity = 0;
            $.$topSitesWrapper().style.visibility = 'visible';
            $.$topSitesWrapper().style.opacity = 1;
            $.loadTopSites();
        };
    }
}