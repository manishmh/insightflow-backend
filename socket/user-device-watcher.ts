import User from "../models/user"

export const UserDeviceWatcher = async (socketIO: any) => {
    User.watch().on("change", async (change) => {
        const devices =  await User.find({})
        .select("loginDevices")
        .exec()
        .catch((err) => {
            console.error(err)
        })

        socketIO.emit('userLoggedIn', {

        })
    })
}