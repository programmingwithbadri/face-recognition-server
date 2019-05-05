const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(user => res.json(user[0]))
            }).then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(() => res.status('400').json('Unable to register'))
}

module.exports = {
    handleRegister: handleRegister
};