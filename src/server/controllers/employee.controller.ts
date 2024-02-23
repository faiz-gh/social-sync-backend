import * as EmployeeService from '@services/employee.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route POST /employee/
 * @description Create new employee
 */
export async function createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        RequestValidator(req, {
            body: Joi.object({
                companyId: Joi.string().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().required(),
            }),
        });

        const data = await EmployeeService.createEmployee(
            req.body as ICreateEmployeeRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route PUT /profile/
 * @description Update employee details
 */
export async function updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        RequestValidator(req, {
            query: Joi.object({
                id: Joi.string().required(),
                firstName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                roleId: Joi.number().optional(),
            }),
        });
        const data = await EmployeeService.updateEmployee(
            req.query as unknown as IUpdateEmployeeRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /employee/company/:id
 * @description Get all employees by company ID
 */
export async function getEmployeesByCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await EmployeeService.getEmployeesByCompany(
            { companyId: req.params.id } as IGetEmployeesByCompanyRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /employee/:id
 * @description Get employee details by ID
 */
export async function getEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await EmployeeService.getEmployee(
            { id: req.params.id } as IGetEmployeeRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}