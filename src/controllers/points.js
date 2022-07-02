const Point = require("../models/Points");

const controller = {}

controller.getPoints = async(req, res) => {
    if (req.user.status == "admin") {
        const query = Point.find({}, { __v: 0 }, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                return res.status(200).json({ status: "OK", data })
            }
        })
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }

}

controller.getPointsById = async(req, res) => {
    const { id } = req.params;
    if (req.user.status == "admin") {
        if (id.length > 23 && id.length <= 24) {
            const data = Point.find({
                    '_id': id
                }, { __v: 0 },
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    return res.status(200).json({ status: "OK", result })
                })
        } else {
            return res.status(400).json({ status: "ERROR", message: "It's not an ID" })
        }
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }

}

controller.createPoints = async(req, res) => {
    const { userId, pointGroup } = req.body;

    if (req.user.status == "admin") {
        const point = new Point({
            userId: userId,
            pointGroup: pointGroup
        })

        const query = Point.find({ userId: userId }, null, async(err, data) => {
            if (err) {
                console.log(err)
            } else {
                if (data.length !== 0) {
                    return res.status(400).json({ status: "ERROR", message: "User's points already exist" })
                } else {
                    await point.save()
                    res.status(200).json({ status: "OK", message: "Points have been created." })
                }
            }
        })
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

controller.incrementById = async(req, res) => {
    const { id } = req.params
    const { pointGroup } = req.body;

    if (req.user.status == "admin") {
        Point.find({ "userId": id }, (err, data) => {
            if (err) {
                console.log(err)
            }
            if (data !== null) {

                Object.keys(pointGroup).map(async(field) => {
                    var pointedField = ''
                    var canIncrement = true
                    if (field == "serverPoints") {
                        pointedField = { "pointGroup.0.serverPoints": pointGroup[field] }
                    } else {
                        pointedField = { "pointGroup.0.invalid": 0 }
                        canIncrement = false
                    }

                    if (canIncrement == true) {
                        console.log(pointedField)
                        await Point.updateOne({ "userId": id }, { $inc: pointedField })
                    }
                })
                return res.status(200).json({ status: "OK", message: "Data have been incremented" })
            } else {
                return res.status(400).json({ status: "ERROR", message: "Data don't exist" })
            }
        })

    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

controller.updatePoints = async(req, res) => {
    const { id } = req.params
    const { pointGroup } = req.body;

    if (req.user.status == "admin") {

        Point.findOneAndUpdate({ "userId": id }, { $set: { pointGroup: pointGroup } }, (err, data) => {
            if (err) {
                console.log(err)
            }
            if (data !== null) {
                return res.status(200).json({ status: "OK", message: "Data have been updated" })
            } else {
                return res.status(400).json({ status: "ERROR", message: "Data don't exist" })
            }
        })
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

controller.deletePoints = async(req, res) => {
    const { id } = req.params

    if (req.user.status == "admin") {

        Point.findOneAndDelete({ "userId": id }, (err, data) => {
            if (err) {
                console.log(err)
            }
            if (data !== null) {
                return res.status(200).json({ status: "OK", message: "Data have been deleted" })
            } else {
                return res.status(400).json({ status: "ERROR", message: "Data don't exist" })
            }
        })
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

module.exports = controller