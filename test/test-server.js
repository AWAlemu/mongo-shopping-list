global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    var id = null;
    before(function(done) {
        server.runServer(function() {
            Item.create({name: 'Broad beans'},
                        {name: "Tomatoes"},
                        {name: 'Peppers'}, function() {
                done();
            });
        });
    });
    it('should list items on GET', function(done){
        chai.request(app) //tells Chai HTTP to make a request to app
            .get('/items') //makes a get request to the specified endpoint
            .end(function(err, res){ //runs the annonymous function when the request is complete
                should.equal(err, null);
                res.should.have.status(200); //a should assertion specifies the expected status code
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0]._id.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                // res.body[1].name.should.equal('Tomatoes');
                // res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done){
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Kale');
                id = res.body._id;
                done();
            });
    });
    
    it('should edit an item on PUT', function(done){
        chai.request(app)
            .put('/items/' + id)
            .send({'name': 'Durian', 'id': id})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Kale');
                done();
            });
    });
    
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/' + id)
            .send({'id': id})
            .end(function(err, res) {
                // console.log(res);
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });

    it('should POST without body data', function(done) {
        chai.request(app)
            .post('/items')
            .send(null)
            .end(function(err, res){
                should.not.equal(err, null);
                res.should.have.status(400);
                done();
            });
    });
    
    it('should POST with something other than valid JSON', function(done) {
        chai.request(app)
            .post('/items')
            .send('Not a valid json')
            .end(function(err, res){
                should.not.equal(err, null);
                res.should.have.status(400);
                done();
            });
    });
    
    it('should PUT without an ID in the endpoint', function(done) {
        chai.request(app)
            .put('/items')
            .send({'name': 'Durian', 'id': 3})
            .end(function(err, res) {
              should.not.equal(err, null);
              res.should.have.status(404);
              done();
            });
    });
    
    it('should PUT with different ID in the endpoint than the body', function(done){
        chai.request(app)
            .put('/items/16')
            .send({'name': 'Apples', 'id': 5})
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(400);
                done();
            });
    });
    it('should PUT to an ID that doesnt exist', function(done) {
        chai.request(app)
            .put('/items/57d09c17ee09c21e3cd9ae6f')
            .send({'name': 'Apples', 'id': '57d09c17ee09c21e3cd9ae6f'})
            .end(function(err, res) {
                should.equal(err, null);
                should.equal(res.body, null);
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });
    
    it('should PUT without body data', function(done) {
        chai.request(app)
            .put('/items/56')
            .send(null)
            .end(function(err, res) {
              should.not.equal(err, null);
              res.should.have.status(400);
              done();
            });
    });
    
    it('should PUT with something other than valid JSON', function(done) {
        chai.request(app)
            .put('/items/100')
            .send('not a valid JSON')
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(400);
                done();
            });
    });
    
    it('should DELETE an ID that doesnt exist', function(done) {
        chai.request(app)
            .delete('/items/20')
            .send({'id': 20})
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(400);
                done();
            });
    });
    
    it('should DELETE without an ID in the endpoint ', function(done) {
        chai.request(app)
            .delete('/items')
            .send({'id': 1})
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(400);
                done();
            });
    });
    
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});