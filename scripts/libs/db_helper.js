const eventWatchBlockColl = 'event_watch_block';
const eventColl = 'event';

module.exports = {

    getWatchFromBlock: (db, eventName) => {
        return new Promise((resolve, reject) => {
            db.collection(eventWatchBlockColl).findOne({ _id: eventName }, (error, doc) => {
                if (error != null) {
                    reject(error)
                    return;
                }
                resolve(doc ? doc.fromBlock : 0);
            })
        })
    },
    saveWatchFromBlock: (db, eventName, from) => {

        return new Promise((resolve, reject) => {

            db.collection(eventWatchBlockColl)
                .updateOne({ _id: eventName }, { $set: { fromBlock: from } }, { upsert: 1 }, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                })
        })
    },
    findsertEvent: (db, transactionHash, logIndex, event) => {

        return new Promise((resolve, reject) => {

            let coll = db.collection(eventColl);

            coll.findOne({ transactionHash: transactionHash, logIndex: logIndex, event: event }, (err, doc) => {

                if (err != null) {
                    reject(err);
                    return;
                }

                if (doc) {
                    resolve(doc);
                    return;
                }
                let e = { transactionHash: transactionHash, logIndex: logIndex, event: event, status: 'pending' };
                coll.insertOne(e, (err, doc) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(doc.ops[0]);
                })

            })
        })
    },
    updateEventStatus: (db, id, status) => {

        return new Promise((resolve, reject) => {

            db.collection(eventColl)
                .updateOne({ _id: id }, { $set: { status: status } }, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                })
        })
    }
}