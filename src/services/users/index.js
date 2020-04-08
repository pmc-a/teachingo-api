const createUser = knex => (email, password, first_name, last_name, mobile, type) => {
    try {
        return knex('users').insert({
            email,
            password,
            first_name,
            last_name,
            mobile, 
            type
        });

    } catch (error) {
        console.log(error);
        throw new Error('Something has went wrong when saving user');
    }
};

const findUser = knex => (email) =>{
    try {
        return knex.select('email', 'password', 'first_name', 'last_name', 'mobile')
        .from('users')
        .where({email});
    } catch (error) {
        console.log(error);
        throw new Error('No user found');
    }
}

module.exports = {
    createUser,
    findUser,
}