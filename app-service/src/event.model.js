module.exports = function(db){

    stateSchema = new db.Schema({
        NAMA_MESIN: String,
        EVENT: String,
        VALUE: String,
        TIMESTAMP: Date,
    });

    return db.model('machine-event', stateSchema)

}