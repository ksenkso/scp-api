import request from 'request-promise-native';
import jsdom from 'jsdom';
import debug from 'debug';
import {withConnection} from '../utils.js';

const log = debug('App:AdminController');

const links = [
    'http://scpfoundation.net/scp-series',
    'http://scpfoundation.net/scp-series-2',
    'http://scpfoundation.net/scp-series-3',
    'http://scpfoundation.net/scp-series-4',
    'http://scpfoundation.net/scp-series-5',
];

export async function pull(req, reply) {
    return withConnection(connection => {
        const tasks = links.map(async (link, index) => {
            log('Starting link', link, '...')
            const selector = ['keter', 'euclid', 'safe', 'na', 'thaumiel', 'nonstandard']
                .map(type => `img[alt^="${type}"]`)
                .join(',');
            try {
                const html = await request(link);
                log(`Page ${index + 1} loaded.`);
                const dom = new jsdom.JSDOM(html);
                const elements = Array.from(dom
                    .window
                    .document
                    .querySelectorAll(selector),
                )
                    .slice(6)
                    .map(image => {
                        const obj = {
                            number: getNumber(image),
                            name: getName(image),
                            link: getLink(image),
                            class: getClass(image),
                        };
                        console.log(obj.name);
                        return obj;
                    });
                return loadObjects(connection, elements);
            } catch (e) {
                console.log('Error occurred: ', e.message);
            }
        });

        return Promise.all(tasks)
            .then(() => connection.query({
                sql: `update stats set value = ? where name = 'lastPull'`,
                values: [`${+new Date / 1000 | 0}`],
            }))
            .then(() => {
                reply.code(200).send('OK');
            })
    })
}

/**
 *
 * @param {Connection} connection
 * @param {ScpObject[]} objects
 * @return {Promise<void>}
 */
async function loadObjects(connection, objects) {
    let template = [];
    let values = [];
    objects.forEach(object => {
        template.push(`(?, ?, ?, ?)`);
        values.push(object.name, object.number, object.link, object.class);
    });
    const sql = 'insert into objects (name, number, link, class) values '
        + template.join(',')
        + ' on duplicate key update name = values(name), link = values(link), class = values(class)';
    try {
        await connection.query({
            sql,
            values,
        });
    } catch (err) {
        log(err);
        // log(sql);
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

