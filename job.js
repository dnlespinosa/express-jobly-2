'use strict'

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');

class Job {
    static async create({ id, title, salary, equity, company_handle }) {
        const duplicateCheck = await db.query(`SELECT id FROM jobs WHERE id=$1`, [id])
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError('Duplicate job posting')
        }

        const result = await db.query(`
            INSERT INTO jobs (id, title, salary, equity, company_handle) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, title, salary, equity, company_handle    
        `, [id, title, salary, equity, company_handle])

        const job = result.rows[0]
        return job;
    }

    static async findAll() {
        const jobRes = await db.query(`SELECT title, salary, equity, company_handle FROM jobs`)
        return jobRes.rows;
    }

    static async get(id) {
        const jobRes = await db.query(`SELECT title, salary, equity, company_handle FROM jobs WHERE id=$1`, [id])
        const job = jobRes.rows[0]
        if (!job) throw new NotFoundError('DIDNT FIND THE JOB')

        return job
    }

    static async update(id, title, salary, equity, company_handle) {
        const querySql = await db.query(`UPDATE jobs SET title=$1, salary=$2, equity=$3, company_handle=$4 WHERE id=$5 RETURNING title, salary, equity, company_handle`, [title, salary, equity, company_handle, id])
        const job = querySql.rows[0];

        if (!job) throw new NotFoundError('DIDNT FIND THE JOB');

        return job;
    }

    static async remvoe(id) {
        const result = await db.query(`DELETE FROM jobs WHERE id=$1 RETURNING id`, [id])
        const job = result.rows[0]
        if (!job) throw new NotFoundError('DIDNT FIND THE JOB');
    }
}

module.exports = Job;
