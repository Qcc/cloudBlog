module.exports = {
  port: 3000,
  session:{
    secret: 'Blog2017',
    resave: false,
    key: 'cloudBlog',
    cookie: { 
      secure: true,
      maxAge:360000
    }
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '&3gA$f6d%F14'
  },
  mongodb: 'mongodb://localhost:27017/cloudBlog'
}