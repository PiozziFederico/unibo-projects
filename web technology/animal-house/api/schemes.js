const yup = require('yup');

// Utility schemes
const stringScheme = yup.string().trim().required();
const indexScheme = yup.number().required().integer().min(0);
const dateScheme = yup.string().test(
    "DateTest",
    "Error", // Generic error message, it isn't used anyway
    async (value, testContext) => {
        let date = Date.parse(value);
        if (isNaN(date) || date < Date.now())
            return false;
        date = new Date(date);
        return date.toISOString() === value && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0;
    },
);

// https://github.com/jquense/yup/tree/pre-v1#api

const animalScheme = yup.object({
    type: yup.string().trim().required(),
    gender: yup.string().trim().optional().min(1),
    age: yup.number().optional().integer().min(0),
    breed: yup.string().trim().optional().min(1),
    description: yup.string().trim().optional().min(1),
    image: yup.string().trim().optional().min(1),
}).noUnknown().required();

const userSchema = yup.object({
    name: yup.string().trim().required(), // required doesn't allow empty strings
    surname: yup.string().trim().defined(), // defined allows empty strings
    //username: yup.string().required(), // username cannot be changed
    password: yup.string().trim().required(),
    admin: yup.boolean().default(false),
    animals: subObjectScheme(animalScheme).default({}),
}).noUnknown().required();

const animalSchemePatch = yup.object({
    type: yup.string().trim().optional().min(1),
    gender: yup.string().trim().optional().nullable(),
    age: yup.number().optional().nullable().integer().min(0),
    breed: yup.string().trim().optional().nullable(),
    description: yup.string().trim().optional().nullable(),
    image: yup.string().trim().optional().nullable(),
}).noUnknown().defined();

const userSchemaPatch = yup.object({
    name: yup.string().optional().trim().min(1), // min(1) disallows empty strings
    surname: yup.string().optional().trim(), // allow empty strings
    //username: yup.string().optional(), // username cannot be changed
    password: yup.string().optional().trim().min(1),
    admin: yup.boolean().optional(),
    animals: subObjectScheme(animalSchemePatch).optional(),
}).noUnknown().required();

const pointsScheme = yup.object({
    points: yup.number().required().integer().min(0),
}).noUnknown().required();

const loginBodySchema = yup.object({
    username: yup.string().trim().required(),
    password: yup.string().trim().required(),
}).noUnknown().required();

const locationSchema = yup.object({
    address: yup.string().trim().required(),
    city: yup.string().trim().required(),
    hasShop: yup.boolean().required(),
    services: yup.array().of(yup.string().trim().required()).default([]),
}).noUnknown().required();

const productSchema = yup.object({
    price: yup.number().required().min(0),
    description: yup.string().trim().required(),
    amount: yup.number().required().integer().min(0),
    category: yup.string().trim().required(),
    image: yup.string().trim().required(),
}).noUnknown().required();

const productSchemaPatch = yup.object({
    price: yup.number().optional().min(0),
    description: yup.string().optional().trim().min(0),
    amount: yup.number().optional().integer().min(0),
    category: yup.string().optional().trim().min(0),
    image: yup.string().optional().trim().min(0),
}).noUnknown().required();

const buyAmountSchema = yup.number().required().integer().min(1);

const buySchema = subObjectScheme(yup.number().required().integer().min(1)).required();

const cartSchemaPatch = subObjectScheme(yup.number().defined().nullable().integer().min(1)).required();

const boardPostSchema = yup.object({
    title: yup.string().trim().required(),
    description: yup.string().trim().defined(),
    image: yup.string().trim().optional().min(1),
}).noUnknown().required();

const boardCommentSchema = yup.object({
    description: yup.string().trim().required(),
}).noUnknown().required();

const serviceLocationSchema = yup.object({
    name: yup.string().trim().optional().nullable().min(1),
}).noUnknown().required();

const serviceTypeSchema = yup.string().trim().matches(/(Veterinario|Dog Sitter|Toelettatura|Psicologo|Visita a domicilio per animali soli)/);
const dateArraySchema = uniqueElements(yup.array().of(dateScheme).default([]));

const serviceSchema = yup.object({
    available: dateArraySchema,
    booked: yup.object({}).noUnknown().default({}),
    type: serviceTypeSchema.required(),
}).noUnknown().required();

const servicePatchSchema = yup.object({
    available: uniqueElements(yup.array().of(dateScheme).optional()),
    type: serviceTypeSchema.optional(),
}).noUnknown().required();

const bookingServiceSchema = yup.object({
    username: yup.string().optional().min(1),
    booking: dateArraySchema,
}).noUnknown().required();

const deleteBookingServiceSchema = yup.object({
    booking: dateArraySchema,
}).noUnknown().required();

function addUtilityFunction(scheme) {
    scheme = scheme.clone(); // Clone the scheme
    scheme.validateAndCast = async object => {
        await scheme.validate(object, { strict: true });
        return await scheme.cast(object);
    };
    return scheme;
}

function addCastingUtilityFunction(scheme) {
    scheme = scheme.clone(); // Clone the scheme
    scheme.validateAndCast = async object => {
        await scheme.validate(object);
        return await scheme.cast(object);
    };
    return scheme;
}

var __i = 0;
function subObjectScheme(subScheme) {
    return yup.mixed().transform((current, original) => {
        if (current === null) {
            return null;
        }
        if (current === undefined) {
            return undefined;
        }

        let obj = {};
        for (let property in current) {
            obj[stringScheme.cast(property)] = subScheme.cast(current[property]);
        }
        return obj;
    }).test(
        "SubObjectTest" + (__i++), // Create unique test name
        "Error", // Generic error message, it isn't used anyway
        async (value, testContext) => {
            if (value != null && (typeof value !== 'object' || Array.isArray(value))) { // https://stackoverflow.com/a/8511350
                return false;
            }

            for (let property in value) {
                if (!await stringScheme.isValid(property, { strict: true }) || !await subScheme.isValid(value[property], { strict: true })) {
                    return false;
                }
            }
            return true;
        },
    );
}

function uniqueElements(arrayScheme) {
    return arrayScheme.test("arrayUniqueTest" + (__i++), // Create unique test name
        "Error", // Generic error message, it isn't used anyway
        async (value, testContext) => {
            if (value == null) {
                return true;
            }
            if (!Array.isArray(value)) {
                return false;
            }

            return value.length === new Set(value).size; // https://stackoverflow.com/a/34192063
        },
    );
}

exports.stringScheme = addUtilityFunction(stringScheme);
exports.indexScheme = addCastingUtilityFunction(indexScheme);
exports.dateScheme = addUtilityFunction(dateScheme);
exports.dateArraySchema = addUtilityFunction(dateArraySchema);

exports.userSchema = addUtilityFunction(userSchema);
exports.userSchemaPatch = addUtilityFunction(userSchemaPatch);
exports.animalScheme = addUtilityFunction(animalScheme);
exports.animalSchemePatch = addUtilityFunction(animalSchemePatch);
exports.pointsScheme = addUtilityFunction(pointsScheme);
exports.loginBodySchema = addUtilityFunction(loginBodySchema);
exports.locationSchema = addUtilityFunction(locationSchema);
exports.productSchema = addUtilityFunction(productSchema);
exports.productSchemaPatch = addUtilityFunction(productSchemaPatch);
exports.buySchema = addUtilityFunction(buySchema);
exports.cartSchema = addUtilityFunction(buySchema);
exports.cartSchemaPatch = addUtilityFunction(cartSchemaPatch);
exports.amountSchema = addUtilityFunction(buyAmountSchema);
exports.boardPostSchema = addUtilityFunction(boardPostSchema);
exports.boardCommentSchema = addUtilityFunction(boardCommentSchema);
exports.serviceLocationSchema = addUtilityFunction(serviceLocationSchema);
exports.serviceSchema = addUtilityFunction(serviceSchema);
exports.servicePatchSchema = addUtilityFunction(servicePatchSchema);
exports.bookingServiceSchema = addUtilityFunction(bookingServiceSchema);
exports.deleteBookingServiceSchema = addUtilityFunction(deleteBookingServiceSchema);
