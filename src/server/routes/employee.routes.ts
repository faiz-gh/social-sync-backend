import * as EmployeeController from '@controllers/employee.controller.js';
import { Router } from 'express';

const router: Router = Router();

/**
 * @route POST /employee/
 * @description Route for creating new employee
 */
router.post('/', EmployeeController.createEmployee);

/**
 * @route PUT /employee/
 * @description Route for updating profile
 */
router.put('/', EmployeeController.updateEmployee);

/**
 * @route GET /employee/company/:id
 * @description Route for getting all employees by company ID
 */
router.get('/company/:id', EmployeeController.getEmployeesByCompany);

/**
 * @route GET /employee/:id
 * @description Route for getting employee by ID
 */
router.get('/:id', EmployeeController.getEmployee);


export default router;