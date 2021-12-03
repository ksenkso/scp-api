import {AdminController} from '../controllers/AdminController.js';

export default [{
    url: '/pull',
    method: 'GET',
    handler: AdminController.pull,
}]
