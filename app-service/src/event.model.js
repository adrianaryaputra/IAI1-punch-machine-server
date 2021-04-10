module.exports = function(db){

    stateSchema = new db.Schema({
        NAMA_MESIN: String,
        STATS_NAMA_PELANGGAN: String,
        STATS_TEBAL_BAHAN: Number,
        STATS_UKURAN_BAHAN: Number,
        STATS_TOTAL_COUNT: Number,
        DRIVE_SPEED: Number,
    });

    return db.model('machine-event', stateSchema)

}