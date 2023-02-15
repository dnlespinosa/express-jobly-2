"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();


/** POST / { company } =>  { company }
 *
 * company should be { handle, name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: login
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const companies = await Company.findAll();
    const returnVal = []
    const body = req.body
    if (Object.keys(body).length > 0) {
      // nameLike
      if (Object.keys(body)[0] === 'name') {
        for (let company of companies) {
          let objKeys = Object.keys(company)
          for (let i=0; i<objKeys.length; i++) {
            if (Object.keys(body).toString() === objKeys[i]) {
              let val = Object.values(body).toString()
              if (company[objKeys[i]].includes(val)) {
                returnVal.push(company)
              }
            }
          }
        }
      }

      // minEmployees
      if (Object.keys(body[0] === 'minEmployees')) {
        for (let company of companies) {
          if (company.numEmployees > Object.values(body).toString()) {
            returnVal.push(company)
          }
        }
      }

      // maxEmployees
      if (Object.keys(body[0] === 'maxEmployees')) {
        for (let company of companies) {
          if (company.numEmployees < Object.values(body).toString()) {
            returnVal.push(company)
          }
        }
      }
    
      return res.json({ returnVal })
    }

    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/search/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: login
 */

router.patch("/:handle", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: login
 */

router.delete("/:handle", ensureLoggedIn, async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;

const companies = [
  {
    "handle": "anderson-arias-morrow",
    "name": "Anderson, Arias and Morrow",
    "description": "Somebody program how I. Face give away discussion view act inside. Your official relationship administration here.",
    "numEmployees": 245,
    "logoUrl": "/logos/logo3.png"
  },
  {
    "handle": "arnold-berger-townsend",
    "name": "Arnold, Berger and Townsend",
    "description": "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.",
    "numEmployees": 795,
    "logoUrl": null
  },
  {
    "handle": "ayala-buchanan",
    "name": "Ayala-Buchanan",
    "description": "Make radio physical southern. His white on attention kitchen market upon. Represent west open seven. Particularly subject billion much score thank bag somebody.",
    "numEmployees": 309,
    "logoUrl": null
  },
  {
    "handle": "baker-santos",
    "name": "Baker-Santos",
    "description": "Compare certain use. Writer time lay word garden. Resource task interesting voice.",
    "numEmployees": 225,
    "logoUrl": "/logos/logo3.png"
  },
  {
    "handle": "bauer-gallagher",
    "name": "Bauer-Gallagher",
    "description": "Difficult ready trip question produce produce someone.",
    "numEmployees": 862,
    "logoUrl": null
  }
]

let body = {name: 'ow'}
let returnName = []


for (let company of companies) {
  let objKeys = Object.keys(company)
  for (let i=0; i<objKeys.length; i++) {
    if (Object.keys(body).toString() === objKeys[i]) {
      let val = Object.values(body).toString()
      if (company[objKeys[i]].includes(val)) {
        returnName.push(company[objKeys[i]])
      }
    }
  }
}