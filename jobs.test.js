"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// describe('POST /jobs', () => {
//     const newJob = {
//         id: 2, 
//         title: 'TestTitle2',
//         Salary: 500, 
//         Equity: 1.0, 
//         company_handle: 'c1'
//     }
//     test('ok for users', async () => {
//         const resp = await request(app).post('/jobs').send(newJob).set('authorization', `Bearer ${u1Token}`);
//         expect(resp.body).toEqual({
//             job: newJob
//         });
//     })
// })

describe('GET /jobs', () => {
    test('ok for anon', async () => {
        const resp = await request(app).get('/jobs')
        expect(resp.body).toEqual({
            jobs: {
                id: 1, 
                title: 'TestJob1', 
                salary: 500, 
                equity: 1.0, 
                company_handle: 'c1'
              }
        })
    })
})

describe('GET /jobs/:id', () => {
    test('works for anon', async function() {
        const resp = await request(app).get(`/jobs/1`);
        expect(resp.body).toEqual({
            id: 1, 
            title: 'TestJob1', 
            salary: 500, 
            equity: 1.0, 
            company_handle: 'c1'
          }
        )
    })
})

describe('PATCH /jobs/:id', () => {
    test('works for admins', async () => {
        const resp = await request(app).patch(`/jobs/1`).send({title:'TestJob3"'}).set('authorization', `Bearer ${u1Token}`)
        expect(resp.body).toEqual({
            id: 1, 
            title: 'TestJob3', 
            salary: 500, 
            equity: 1.0, 
            company_handle: 'c1'
          })
    })
})

describe('DELETE /jobs/:id', () => {
    test('works for admins', async () => {
        const resp = await request(app).delete('/jobs/1').set('authorization', `Bearer ${u1Token}`)
        expect(resp.body).toEqual({ deleted: 1});
    })
})