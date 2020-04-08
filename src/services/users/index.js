const createUser = knex => (email, password, first_name, last_name, mobile) => {
    try {
        return knex('users').insert({
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name,
            mobile: mobile
        }).then(resp => resp);

    } catch (error) {
        console.log(error);
        throw new Error('Something has went wrong when saving user');

    }
};

const findUser = knex => (email) =>{
    try {
        return knex('users').where('email', email).then(resp => resp);
    } catch (error) {
        console.log(error);
        throw new Error('No user found');
    }
}

module.exports = {
    createUser,
    findUser,
}