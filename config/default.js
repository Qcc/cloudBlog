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
  mongodb: 'mongodb://localhost:27017/cloudBlog'
}