module.exports = (err, req, res, next) => {
    console.log(err.message, err);
    console.log("this is a test!");
    res.status(500).send("Internal error!");
}