const createUser = (knex) => (
    email,
    password,
    first_name,
    last_name,
    mobile,
    type
) => {
    try {
        return knex('users').insert({
            email,
            password,
            first_name,
            last_name,
            mobile,
            type,
        });
    } catch (error) {
        console.log(error);
        throw new Error('Something has went wrong when saving user');
    }
};

const findUser = (knex) => (email) => {
    try {
        return knex
            .select(
                'id',
                'email',
                'password',
                'first_name',
                'last_name',
                'mobile',
                'type'
            )
            .from('users')
            .where({ email });
    } catch (error) {
        console.log(error);
        throw new Error('No user found');
    }
};

const getUserById = (knex) => (id) => {
    try {
        return knex.select().from('users').where({ id });
    } catch (error) {
        console.log(error);
        throw new Error('No user found');
    }
};

const getUserNameById = (knex) => (id) => {
    try {
        return knex
            .select('id', 'first_name', 'last_name')
            .from('users')
            .where({ id });
    } catch (error) {
        console.log(error);
        throw new Error('No user found');
    }
};

const getUserTypeById = (knex) => (id) => {
    try {
        return knex.select('type').from('users').where({ id });
    } catch (error) {
        console.log(error);
        throw new Error('No user found');
    }
};

module.exports = {
    createUser,
    findUser,
    getUserById,
    getUserNameById,
    getUserTypeById,
};
