const Point = require("../models/Points");
const allowedRoles = ["administrator", "moderator"]

const controller = {}

controller.getPoints = async(req, res) => {
    if ( allowedRoles.includes(req.user.role)) {
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
    const { playerId } = req.params;
    if ( allowedRoles.includes(req.user.role)) {
        if (playerId.length > 23 && playerId.length <= 24) {
            const data = Point.find({
                    'userId': playerId
                }, { __v: 0 },
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    return res.status(200).json({ status: "OK", data: result[0] || {} })
                })
        } else {
            return res.status(400).json({ status: "ERROR", message: "It's not an ID" })
        }
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }

}

controller.createPoints = async(req, res) => {
    const { userId, points } = req.body;

    if ( allowedRoles.includes(req.user.role)) {
        const point = new Point({
            userId: userId,
            points: points
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

controller.createGamePoints = async(req, res) => {
    const {playerId, game  } = req.params;
    const { points } = req.body;

    if ( allowedRoles.includes(req.user.role)) {

        const gameName = game.toString().toUpperCase()

        Point.findOne({ "userId": playerId }, async(err, data) => {
            if (err) {
                console.log(err)
            }
            if (data !== null) {
                const gamePoints = data.points[gameName];
                if (gamePoints){
                    const newElement = new Object({...points})
                    newElement.modified = new Date(Date.now())
                    newElement.created = new Date(Date.now())
                    const newPoints = [...gamePoints, newElement];
                    const result =  await Point.updateOne({ "userId": playerId }, {$set: { [`points.${gameName}`]: newPoints }})
                    if (result.modifiedCount >= 1){
                        return res.status(200).json({ status: "OK", message: "Data have been inserted" })
                    }
                    return res.status(200).json({ status: "OK", message: "Game point wasn't inserted" })
                }
                return res.status(200).json({ status: "OK", message: "Game name doesn't exist" })
            } else {
                return res.status(400).json({ status: "ERROR", message: "Data don't exist" })
            }
        })
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

controller.updatePointsById = async(req, res) => {
    const {playerId, game, pointId  } = req.params;
    const { points } = req.body;

    if ( allowedRoles.includes(req.user.role)) {

        const gameName = game.toString().toUpperCase()

        Point.findOne({ "userId": playerId }, async(err, data) => {
            if (err) {
                console.log(err)
            }
            if (data !== null) {
                const gamePoints = data.points[gameName];
                if (gamePoints){
                    const newPoints = gamePoints.map((element) =>{
                        if ( element._id.toString() === pointId ){
                            const newElement = new Object({...points})
                            newElement.created = element.created
                            newElement.modified = new Date(Date.now())
                            newElement._id = element._id
                            return newElement
                            
                        }
                        return element
                    }) 
                    const result =  await Point.updateOne({ "userId": playerId }, {$set: { [`points.${gameName}`]: newPoints }})
                    if (result.modifiedCount >= 1){
                        return res.status(200).json({ status: "OK", message: "Data have been updated" })
                    }
                    return res.status(200).json({ status: "OK", message: "Game point doesn't exist" })
                }
                return res.status(200).json({ status: "OK", message: "Game name doesn't exist" })
            } else {
                return res.status(400).json({ status: "ERROR", message: "Data don't exist" })
            }
        })
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

controller.deletePoints = async(req, res) => {
    const { pointsId } = req.params

    if ( allowedRoles.includes(req.user.role)) {

        Point.findOneAndDelete({ "_id": pointsId }, (err, data) => {
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