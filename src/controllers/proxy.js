const controller = {}

controller.getServersByPlaceId = async(req, res) => {
    const {placeId, sortOrder, limit} = req.params;
    const request = await fetch(`https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=${sortOrder}&limit=${limit}`, {method: "GET"})
    const servers = await request.json()
    res.status(200).json(servers)
}
module.exports = controller