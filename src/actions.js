import Utils from './utils.js';
import Mustache from 'mustache';

export default {
    /**
     * Return a load image action.
     * @param {*} $ Depended elements.
     */
    getLoadImage: ($) => {
        let loading = false;
        let descriptionTemplate = null;
        const apiUrl = 'https://www.reddit.com/r/Moescape/random.json';

        const newImageLoader = async () => {
            const data = await Utils.getJSON(apiUrl);
            const post = data[0].data.children[0];

            if (post.kind != 't3' || post.data.post_hint != 'image') {
                console.log(`[Moescape Art] This post is not an image. Retrying.`);
                return await newImageLoader();
            } else {
                return post.data;
            }
        };

        const dailyImageLoader = async () => { 
            let lastData = null;
            
            try {
                lastData = await browser.storage.local.get([
                    'lastPostData', 
                    'lastLoadedTime'
                ]);
            } catch(error) {
                console.log(`[Moescape Art] ${error}`);
                console.log(`[Moescape Art] Trying to load new image.`);
                return await newImageLoader();
            }

            if (lastData.lastPostData) {
                if (!lastData.lastLoadedTime 
                    || new Date().getDate() == lastData.lastLoadedTime.getDate()) 
                {
                    return lastData.lastPostData;
                } else {
                    return await newImageLoader();    
                }
            } else {
                console.log('[Moescape Art] There is no image. Trying to load new image.');
                return await newImageLoader();
            }
        }

        const loadImage = async (loader) => {
            if (loading) { 
                return 1;
            } 
            
            loading = true;
            
            $.$description().style.opacity = '0';
            $.$description().removeEventListener('mouseover', $.descriptionHoverEventHandler);
            $.$loadingIcon().style.visibility = 'visible';

            let postData = null;
            try {
                postData = await loader();
            } catch(error) {
                console.log(`[Moescape Art] ${error}`);
                return 1;
            }

            browser.storage.local.set({ 
                lastPostData: postData,
                lastLoadedTime: new Date()
            }).then(null, (error) => 
                console.log(`[Moescape Art] Can't save last post data. Error: ${error}`)
            );

            $.$image().style.backgroundImage = 'url(' + postData.thumbnail + ')';
            $.$image().style.filter = 'blur(8px)';
    
            if (!descriptionTemplate) {
                descriptionTemplate = $.$description().innerHTML;
                Mustache.parse(descriptionTemplate);
            }

            $.$description().innerHTML = Mustache.render(descriptionTemplate, { 
                sourceUrl: 'http://' + postData.domain, 
                source: postData.domain,
                titleUrl: 'http://reddit.com' + postData.permalink,
                title: postData.title,
                author: postData.author,
                authorUrl: 'http://reddit.com/user/' + postData.author
            });

            let imageUrl = null;
            try {
                imageUrl = await Utils.getImage(postData.url);
            } catch (error) {
                console.log(error.message);
                console.log('[Moescape Art] Retrying.');
                loading = false;
                return await loadImage(newImageLoader);
            }

            $.$loadingIcon().style.visibility = 'hidden';

            $.$image().style.backgroundImage = 'url(' + imageUrl + ')';            
            $.$image().style.filter = 'none';
            
            $.$description().addEventListener('mouseover', $.descriptionHoverEventHandler);
            $.$reloadButton().addEventListener('click', () => loadImage(newImageLoader));

            $.$downloadButton().addEventListener('click', () => {
                const downloading = browser.downloads.download({
                    url : postData.url,
                    filename : postData.title + '.' + Utils.getExtension(postData.url)
                });
                    
                downloading.then(
                    () => alert('Download started.'), 
                    (error) => alert(`Download failed: ${error}`)
                );
            });

            loading = false;
            return 0;
        }

        const timming = $.options.backgroundChangingTimming;
        switch (timming) {
            case 'newtab': 
                return () => loadImage(newImageLoader);
            default:
                if (timming != 'daily') {
                    console.log(`[Moescape Art] Unknow background changing timming option: ${timming}. Returning the default (daily).`);
                }
                
                return () => loadImage(dailyImageLoader);
        }
    },

    /**
     * Return a load top sites action.
     * @param {*} $ Depended elements.
     */
    getLoadTopSites: ($) => {
        let template = null;

        return () => {
            $.$topSites().style.visibility = 'hidden';
    
            browser.topSites.get().then((topSites) => {
                if (!template) {
                    template = $.$topSites().innerHTML;
                    Mustache.parse(template);
                }
    
                $.$topSites().innerHTML = Mustache.render(template, { 
                    topSites: topSites.slice(0, 12).map((e) => { 
                        e.favicon = function() {
                            return 'https://www.google.com/s2/favicons?domain=' 
                                    + Utils.httpURLGetDomain(this.url);
                        }.bind(e);
                        return e;
                    })
                });
    
                $.$topSites().style.visibility = 'visible';
            }, (err) => {
                console.log(`[Moescape Art] Can't get top sites. Error: ${err}`);
            });
        };
    },

    applyOptions: ($) => {
        const backgroundSize = $.options.backgroundSize;

        switch (backgroundSize) {
            case undefined:
                break;
            case 'cover':
                $.$image().style.backgroundSize = 'cover';
                break;
            case 'contain':
                $.$image().style.backgroundSize = 'contain';
                break;
            case 'full-width':
                $.$image().style.backgroundSize = '100% auto';
                break;
            case 'full-height':
                $.$image().style.backgroundSize = 'auto 100%';
                break;
            default:
                console.log(`[Moescape Art] Unknow background size option: ${backgroundSize}.`);
        }
    }
}