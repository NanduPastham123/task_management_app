import { should, use } from 'chai';
import chaiHttp from 'chai-http';
import server from '../index.js';
import Task from '../models/task.js';
import { createUser, getUsers } from '../controllers/userController.js';
should();
use(chaiHttp);

describe('Task API', () => {
    let token;
    let userId;

    // Setup before tests
    before(async () => {
        const user = await createUser({ username: 'testuser', email: 'test@example.com', password: 'testpass' });
        userId = user._id;
        token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    });

    it('Should create a task', (done) => {
        request(server)
            .post('/tasks')
            .set('Authorization', token)
            .send({
                title: 'Test Task',
                description: 'Task description',
                dueDate: '2024-12-31',
                priority: 'Medium',
                createdBy: userId,
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('title').eq('Test Task');
                done();
            });
    });

    it('Should get all tasks', (done) => {
        request(server)
            .get('/tasks')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    // Add more test cases for update and delete as needed.
});
