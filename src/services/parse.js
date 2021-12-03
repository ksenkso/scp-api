import request from "request-promise-native";
import jsdom from "jsdom";
import debug from "debug";

const links = [
    'http://scpfoundation.net/scp-series',
    'http://scpfoundation.net/scp-series-2',
    'http://scpfoundation.net/scp-series-3',
    'http://scpfoundation.net/scp-series-4',
    'http://scpfoundation.net/scp-series-5',
];

const OBJECT_TYPES = ['keter', 'euclid', 'safe', 'na', 'thaumiel', 'nonstandard'];
const ELEMENTS_SELECTOR = OBJECT_TYPES.map(type => `img[alt^="${type}"]`).join(',');
const IMAGES_TO_SKIP = 6;

const log = debug('App:ParseService');

export const ParseService = {
    async * parseAllPages() {
        for (const link of links) {
            yield await this.parseObjects(link);
        }
    },

    async parseObjects(url) {
        const html = await request(url);
        log(`${url} loaded`);
        const dom = new jsdom.JSDOM(html);
        return Array.from(
            dom
                .window
                .document
                .querySelectorAll(ELEMENTS_SELECTOR),
        )
            .slice(IMAGES_TO_SKIP)
            .map(image => {
                return {
                    number: getNumber(image),
                    name: getName(image),
                    link: getLink(image),
                    class: getClass(image),
                };
            });
    }
}

function getAnchor(image) {
    return image.nextElementSibling.tagName === 'A'
        ? image.nextElementSibling
        : image.nextElementSibling.querySelector('a');
}

/**
 *
 * @param image
 * @return {null|number}
 */
function getNumber(image) {
    const link = getAnchor(image);
    if (!link) {
        return null;
    }
    let match = link.textContent.match(/(\d+)/);
    if (match) {
        return +match[1];
    } else {
        match = link.href.match(/scp-(\d+)/);
        if (match) {
            return +match[1];
        } else {
            return null;
        }
    }
}

/**
 *
 * @param image
 * @return {null|string}
 */
function getName(image) {
    const link = getAnchor(image);
    if (link === null) {
        return null;
    }
    const content = link.nextSibling ? link.nextSibling.textContent : link.textContent;
    if (content.startsWith(' — ')) {
        return content.substring(3)
    } else {
        return content;
    }
}

/**
 *
 * @param image
 * @return {string|null}
 */
function getLink(image) {
    const link = getAnchor(image);
    if (link === null) {
        return null;
    }
    if (link.href.match(/\/scp-\d+/)) {
        return 'http://scpfoundation.net' + link.href;
    } else {
        const number = getNumber(image);
        if (number !== null) {
            return 'http://scpfoundation.net/scp-' + number.toString().padStart(3, '0');
        } else {
            return null;
        }
    }
}

/**
 *
 * @param image
 * @return {string}
 */
function getClass(image) {
    return image.alt.match(/keter|euclid|safe|na|thaumiel|nonstandard/)[0];
}
