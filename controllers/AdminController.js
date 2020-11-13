import request from 'request-promise-native';
import jsdom from 'jsdom';
import fastify from '../server.js';

const links = [
    'http://scpfoundation.net/scp-list',
    'http://scpfoundation.net/scp-list-2',
    'http://scpfoundation.net/scp-list-3',
    'http://scpfoundation.net/scp-list-4',
    'http://scpfoundation.net/scp-list-5',
];

export async function pull(req, res) {
    const connection = await fastify.mysql.getConnection();
    const tasks = links.map(async link => {
        console.log('Starting link', link, '...');
        const selector = ['keter', 'euclid', 'safe', 'na', 'thaumiel', 'nonstandard']
            .map(type => `img[alt^="${type}"]`)
            .join(',');

        const html = await request(link);
        console.log('Page loaded.');
        const dom = new jsdom.JSDOM(html);
        const objects = Array.from(dom
            .window
            .document
            .querySelectorAll(selector))
            .slice(6)
            .map(image => {
                return {
                    number: getNumber(image),
                    name: getName(image),
                    link: getLink(image),
                    class: getClass(image),
                };
            });
        console.log('Inserting to DB...');
        return loadObjects(connection, objects).then(() => {
            connection.release();
            console.log(`${link} done!`);
        });
    });

    Promise.all(tasks)
        .then(() => connection.query({
            sql: `update stats set value = ? where name = 'lastPull'`,
            values: [`${+new Date / 1000 | 0}`],
        }))
        .then(() => {
            res.code(200).send('OK');
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
    await connection.query({
        sql: 'insert into objects (name, number, link, class) values ' + template.join(','),
        values,
    });
}

function getAnchor(image) {
    return image.nextElementSibling.tagName === 'A'
        ? image.nextElementSibling
        : image.nextElementSibling.querySelector('a');
}

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

function getName(image) {
    const link = getAnchor(image);
    if (link === null) {
        return null;
    }
    const content = link.nextSibling ? link.nextSibling.textContent : link.textContent;
    if (content.startsWith(' — ')) {
        return content.slice(3)
    } else {
        return content;
    }
}

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

function getClass(image) {
    return image.alt.match(/keter|euclid|safe|na|thaumiel|nonstandard/)[0];
}
