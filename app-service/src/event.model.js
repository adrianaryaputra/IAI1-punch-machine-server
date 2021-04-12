module.exports = function(db){

    stateSchema = new db.Schema({
        NAMA_MESIN: String,
        EVENT: String,
        VALUE: String
    });

    return db.model('machine-event', stateSchema)

}