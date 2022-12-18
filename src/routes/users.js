import express from "express";
import UserDao from "../data/UserDao.js";
import { factory } from "../debug.js";
import { decodeToken } from "../token.js";
import { UserRole } from "../model/UserRole.js";
import ApiError from "../model/ApiError.js";

const debug = factory(import.meta.url);
const router = express.Router();
export const userDao = new UserDao();
const endpoint = "/users";

// pre: user is a Mongoose object
const hidePassword = (user) => {
  const { password, __v, ...rest } = user._doc;
  return rest;
};

const checkPermission = (req, res, next) => {
  try {
    if (req.method === "POST") {
      return next();
    }

    const bearerHeader = req.headers["authorization"];
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    const { id, role } = decodeToken(token);
    if (role === UserRole.Instructor) {
      return next();
    }

    if (req.method === "GET" && id === req.params.id) {
      return next();
    } else if (req.method === "PUT" && id === req.params.id) {
      return next();
    } else if (req.method === "DELETE" && id === req.params.id) {
      return next();
    }

    next(new ApiError(403, "Forbidden"));
  } catch (err) {
    next(new ApiError(401, "Unauthorized"));
  }
};

router.get(`${endpoint}`, checkPermission, async (req, res, next) => {
  debug(`${req.method} ${req.path} called...`);

  try {
    const { name, email, role } = req.query;
    const users = await userDao.readAll({ name, email, role });
    debug(`Preparing the response payload...`);
    res.json({
      status: 200,
      message: `Successfully retrieved ${users.length} users!`,
      data: users.map((user) => hidePassword(user)),
    });
    debug(`Done with ${req.method} ${req.path}`);
  } catch (err) {
    debug(`There was an error processing ${req.method} ${req.path} `);
    next(err);
  }
});

router.get(`${endpoint}/:id`, checkPermission, async (req, res, next) => {
  debug(`${req.method} ${req.path} called...`);
  try {
    const { id } = req.params;
    const user = await userDao.read(id);
    debug(`Preparing the response payload...`);
    res.json({
      status: 200,
      message: `Successfully retrieved the following user!`,
      data: hidePassword(user),
    });
    debug(`Done with ${req.method} ${req.path}`);
  } catch (err) {
    debug(`There was an error processing ${req.method} ${req.path} `);
    next(err);
  }
});

router.post(`${endpoint}`, checkPermission, async (req, res, next) => {
  debug(`${req.method} ${req.path} called...`);
  try {
    const { name, email, password, role } = req.body;
    const user = await userDao.create({ name, email, password, role });
    debug(`Preparing the response payload...`);
    res.status(201).json({
      status: 201,
      message: `Successfully created the following user!`,
      data: hidePassword(user),
    });
    debug(`Done with ${req.method} ${req.path}`);
  } catch (err) {
    debug(`There was an error processing ${req.method} ${req.path} `);
    next(err);
  }
});

router.put(`${endpoint}/:id`, checkPermission, async (req, res, next) => {
  debug(`${req.method} ${req.path} called...`);
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await userDao.update({ id, name, email, password, role });
    debug(`Preparing the response payload...`);
    res.json({
      status: 200,
      message: `Successfully updated the following bookmark!`,
      data: hidePassword(user),
    });
    debug(`Done with ${req.method} ${req.path}`);
  } catch (err) {
    debug(`There was an error processing ${req.method} ${req.path} `);
    next(err);
  }
});

router.delete(`${endpoint}/:id`, checkPermission, async (req, res, next) => {
  debug(`${req.method} ${req.path} called...`);
  try {
    debug(`Read ID received as request parameter...`);
    const { id } = req.params;
    const user = await userDao.delete(id);
    debug(`Preparing the response payload...`);
    res.json({
      status: 200,
      message: `Successfully deleted the following user!`,
      data: hidePassword(user),
    });
    debug(`Done with ${req.method} ${req.path} `);
  } catch (err) {
    debug(`There was an error processing ${req.method} ${req.path} `);
    next(err);
  }
});

export default router;
