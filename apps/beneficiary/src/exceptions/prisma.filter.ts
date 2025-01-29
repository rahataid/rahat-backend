// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

export type PrismaErrorToHttpCodeMap = Record<string, StatusCodes>;

export const PRISMA_ERROR_TO_HTTP: PrismaErrorToHttpCodeMap = {
    P2001: StatusCodes.NOT_FOUND,
    P2015: StatusCodes.NOT_FOUND,
    P2018: StatusCodes.NOT_FOUND,
    P2021: StatusCodes.NOT_FOUND,
    P2022: StatusCodes.NOT_FOUND,
    P2025: StatusCodes.NOT_FOUND,
    P2002: StatusCodes.CONFLICT,
    P2003: StatusCodes.CONFLICT,
    P2000: StatusCodes.BAD_REQUEST,
    P2004: StatusCodes.BAD_REQUEST,
    P2005: StatusCodes.BAD_REQUEST,
    P2006: StatusCodes.BAD_REQUEST,
    P2007: StatusCodes.BAD_REQUEST,
    P2008: StatusCodes.BAD_REQUEST,
    P2009: StatusCodes.BAD_REQUEST,
    P2011: StatusCodes.BAD_REQUEST,
    P2012: StatusCodes.BAD_REQUEST,
    P2013: StatusCodes.BAD_REQUEST,
    P2014: StatusCodes.BAD_REQUEST,
    P2016: StatusCodes.BAD_REQUEST,
    P2017: StatusCodes.BAD_REQUEST,
    P2019: StatusCodes.BAD_REQUEST,
    P2020: StatusCodes.BAD_REQUEST,
    P2023: StatusCodes.BAD_REQUEST,
    P2026: StatusCodes.BAD_REQUEST,
    P2029: StatusCodes.BAD_REQUEST,
    P2033: StatusCodes.BAD_REQUEST,
    P2024: StatusCodes.REQUEST_TIMEOUT,
    P2010: StatusCodes.INTERNAL_SERVER_ERROR,
    P2027: StatusCodes.INTERNAL_SERVER_ERROR,
    P2028: StatusCodes.INTERNAL_SERVER_ERROR,
    P2030: StatusCodes.INTERNAL_SERVER_ERROR,
    P2031: StatusCodes.INTERNAL_SERVER_ERROR,
    P2034: StatusCodes.INTERNAL_SERVER_ERROR,
    P2035: StatusCodes.INTERNAL_SERVER_ERROR,
    P2036: StatusCodes.INTERNAL_SERVER_ERROR,
    P2037: StatusCodes.INTERNAL_SERVER_ERROR,
};


export const handleClientKnownRequestError = (
    error: Prisma.PrismaClientKnownRequestError,
): {
    statusCode: number,
    message: string
} => {
    if (PRISMA_ERROR_TO_HTTP[error.code]) {
        return {
            statusCode: PRISMA_ERROR_TO_HTTP[error.code],
            message: error.meta?.message as string || "Internal Server Error."
        }
    }

    return {
        statusCode: 500,
        message: "Internal Server Error."
    }
}

export const handleClientUnknownRequestError = (
    error: Prisma.PrismaClientUnknownRequestError
) => {
    return {
        statusCode: 'UNKNOWN',
        message: error.message || "Internal Server Error."
    }
}