import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function createEvent({ companyId, title, description, location, startDate, endDate }: ICreateEventRequest): Promise<DefaultServiceResponse> {
    try {
        const eventObj: IEventTable = {
            company_id: companyId,
            title: title,
            description: description,
            location: location,
            start_date: startDate,
            end_date: endDate,
        }
        const [event] = await dbPool<IEventTable[]>`INSERT INTO events ${dbPool(eventObj)} RETURNING *`;
        logger.silly('Event created successfully');

        return {
            message: 'Event created successfully',
            data: event
        }
    } catch (error) {
        logger.error(`Failed to create event, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to create event, please try again');
    }
}

export async function updateEvent({ id, title, description, location, startDate, endDate }: IUpdateEventRequest): Promise<DefaultServiceResponse> {
    try {
        const eventObj: IEventTable = {
            title: title,
            description: description,
            location: location,
            start_date: startDate,
            end_date: endDate,
        }

        const [event] = await dbPool<IEventTable[]>`UPDATE events SET ${dbPool(eventObj)} WHERE id = ${id} AND is_deleted = false RETURNING *`;
        logger.silly('Event updated successfully');

        return {
            message: 'Event updated successfully',
            data: event
        }
    } catch (error) {
        logger.error(`Failed to update event, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to update event, please try again');
    }
}

export async function deleteEvent({ id }: IDeleteEventRequest): Promise<DefaultServiceResponse> {
    try {
        const [event] = await dbPool<IEventTable[]>`UPDATE events SET is_deleted = true WHERE id = ${id} RETURNING *`;
        logger.silly('Event deleted successfully');

        return {
            message: 'Event deleted successfully',
            data: event
        }
    } catch (error) {
        logger.error(`Failed to delete event, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to delete event, please try again');
    }
}

export async function getEvent({ id }: IGetEventRequest): Promise<DefaultServiceResponse> {
    try {
        const [event] = await dbPool<IEventTable[]>`SELECT * FROM events WHERE id = ${id} AND is_deleted = false`;
        logger.silly('Event retrieved successfully');

        return {
            message: 'Event retrieved successfully',
            data: event
        }
    } catch (error) {
        logger.error(`Failed to retrieve event, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to retrieve event, please try again');
    }
}

export async function getEventsByCompany({ companyId }: IGetEventsByCompanyRequest): Promise<DefaultServiceResponse> {
    try {
        const events = await dbPool<IEventTable[]>`SELECT * FROM events WHERE company_id = ${companyId} AND is_deleted = false`;
        logger.silly('Events retrieved successfully');

        return {
            message: 'Events retrieved successfully',
            data: events
        }
    } catch (error) {
        logger.error(`Failed to retrieve events, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to retrieve events, please try again');
    }
}
