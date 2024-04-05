const db = require("../models")
const Invoice = db.invoice

exports.find = async (req, res) => {
    const {
        id = '',
        q = '',
        page = 1,
        perPage = 6,
        sort = 'asc',
        sortColumn = 'membershiptype'
    } = req.body
    let skip = perPage * (page - 1)
    const query = {user: id}
    let total = await Invoice.countDocuments(query);

    Invoice.find(query).skip(skip).limit(perPage).sort({[sortColumn]: sort})
    .then(data => {
        res.send({
            total: total,
            invoices: data
        })
    })
}

exports.findMe = (req, res) => {
    const query = {user: req.userId}
    Invoice.find(query)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}