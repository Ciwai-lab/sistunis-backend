// middleware/validate.js
module.exports = schema => (req, res, next) => {
    const toValidate = {};
    if (schema.body) toValidate.body = req.body;
    if (schema.params) toValidate.params = req.params;
    if (schema.query) toValidate.query = req.query;

    const { error } = schema.validate(req.body, { abortEarly: false }); // simple body-only usage
    if (error) {
        return res.status(400).json({ status: 'fail', message: error.details.map(d => d.message).join(', ') });
    }
    next();
};
