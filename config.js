exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://awalemu:57d09c17ee09c21e3cd9ae6f@ds019906.mlab.com:19906/contdeployment':
                            'mongodb://awalemu:57d09c17ee09c21e3cd9ae6f@ds019906.mlab.com:19906/contdeployment');
exports.PORT = process.env.PORT || 8080;