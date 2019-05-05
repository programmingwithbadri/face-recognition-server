const getUserProfile = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(userProfile => {
        console.log(userProfile)
        if (userProfile.length) {
            res.json(userProfile[0])
        } else {
            res.status('404').json("User profile not found");
        }
    }).catch(() => res.status('500').json("Error getting the user profile"));
}

const getUserEntries = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(() => res.status('400').json('Error getting user entries'));
}

const getUsers = (req, res, db) => {
    db.select('*').from('users').returning('*')
        .then(users => res.json(users))
        .catch(() => res.status(404).json("No users exists!"))
}

module.exports = { getUserProfile, getUserEntries, getUsers };