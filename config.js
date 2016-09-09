exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://mongouser:a451030@ds011291.mlab.com:11291/mongo':
                            'mongodb://mongouser:a451030@ds011291.mlab.com:11291/mongo');
exports.PORT = process.env.PORT || 8080;