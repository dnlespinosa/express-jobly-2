"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('create', function () {
    const newJob = {
        id: 2, 
        title: 'Test2', 
        salary: 200, 
        equity: '1.0', 
        company_handle: 'c1'
    }
    test('works', async function () {
        let job = await Job.create(newJob);
        expect(job).toEqual(newJob);
    })
})

describe('findAll', function()  {
    test('works', async () => {
        let jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                title: 'testTitle', 
                salary: 100, 
                equity: '1.0', 
                company_handle: 'c1'
            }
        ])
    })
})

describe('get', () => {
    test('works', async () => {
        let jobs = await Job.get(1);
        expect(jobs).toEqual(
            {
                title: 'testTitle', 
                salary: 100, 
                equity: '1.0', 
                company_handle: 'c1'
            }
        )
    })
})

describe('update', () => {
    const updateJob = {
        title: 'testTitle2',
        salary: 300, 
        equity: '1.0', 
        company_handle: 'c2'
    }
    test('works', async () => {
        let job = await Job.update(1, updateJob.title, updateJob.salary, updateJob.equity, updateJob.company_handle)
        expect(job).toEqual({ 
            ...updateJob
        })
    })
})

describe('remove', () => {
    test('works', async () => {
        await Job.remvoe(1)
        const res = await db.query('SELECT id FROM jobs WHERE id=1')
        expect(res.rows.length).toEqual(0)
    })
})