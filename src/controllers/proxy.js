const fetch = require('node-fetch-commonjs');

const controller = {}

controller.getServersByPlaceId = async(req, res) => {
    const {placeId, sortOrder, limit} = req.query;
    const request = await fetch(`https://games.roblox.com/v1/games/${placeId || 13550916422}/servers/Public?sortOrder=${sortOrder|| "Asc"}&limit=${limit || 100}`, {method: "GET"})
    const servers = await request.json()
    res.status(200).json(servers)
}
module.exports = controller