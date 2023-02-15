"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require('./sql')

// await db.query(`
//     INSERT INTO companies(handle, name, num_employees, description, logo_url)
//     VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
//            ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
//            ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

describe("sqlForPartialUpdate", function () {
  

  test('returns a setCols and value', () => {
    const updateData = {
      name: "New",
      description: "New Description",
      numEmployees: 1,
      logoUrl: "http://new.img",
    }
    let res = sqlForPartialUpdate(updateData, {
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    })
    expect(Object.keys(res).length).toEqual(2)
  })

  test('returns only the values submitted', () => {
    const updateData = {
      description: "New Description",
      numEmployees: 1,
    }
    let res = sqlForPartialUpdate(updateData,{
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    })
    expect(Object.values(res).length).toEqual(2)
    expect(Object.values(res)[0].split(',').length).toEqual(2)
  })
})

