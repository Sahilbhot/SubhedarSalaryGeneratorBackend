'use strict';

// Request handlers for employee endpoints. Validation + response shaping only;
// all persistence is delegated to employee.service.
const employeeService = require('../services/employee.service');
const { sendSuccess, sendError } = require('../utils/response');

async function list(request, reply) {
  const { data, error } = await employeeService.findAll();
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

async function getOne(request, reply) {
  const { data, error } = await employeeService.findById(request.params.id);
  if (error) return sendError(reply, 'Employee not found', 404);
  return sendSuccess(reply, data);
}

async function create(request, reply) {
  const { employee_name, phone_number, joining_date, salary } = request.body || {};

  if (!employee_name || !joining_date || salary === undefined) {
    return sendError(reply, 'employee_name, joining_date, and salary are required', 400);
  }

  const { data, error } = await employeeService.create({
    employee_name,
    phone_number,
    joining_date,
    salary,
  });
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data, 201);
}

async function update(request, reply) {
  const { employee_name, phone_number, joining_date, salary } = request.body || {};

  const updates = {};
  if (employee_name !== undefined) updates.employee_name = employee_name;
  if (phone_number !== undefined) updates.phone_number = phone_number;
  if (joining_date !== undefined) updates.joining_date = joining_date;
  if (salary !== undefined) updates.salary = salary;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await employeeService.update(request.params.id, updates);
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

async function remove(request, reply) {
  const { error } = await employeeService.remove(request.params.id);
  if (error) return sendError(reply, error);
  return sendSuccess(reply, { message: 'Employee deleted successfully' });
}

module.exports = { list, getOne, create, update, remove };
