module.exports = {
    port:3000,
    session:{
        secret: 'cloudBlog',
        key: 'cloudBlog',
        max: '2592000000'
    },
    mongodb:'mongodb://localhost:27017/cloudBlog'
};