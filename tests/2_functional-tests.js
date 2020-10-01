/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
let shortId = require('shortid');
var server = require('../server');

chai.use(chaiHttp);
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

   suite('Routing tests', function() {

    let id;
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
         chai.request(server)
          .post('/api/books')
          .send({
            title: 'Sum of All Fears'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Sum of All Fears')
            assert.isNotNull(res.body._id)//res.body._id has an id value
            id = res.body._id;
            console.log("id has been set as " + id)
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
      chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res){
            console.log(res.body)
            assert.equal(res.status,200)
            assert.equal(res.body, 'No title in input field')
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'Should contain an Array')
            assert.property(res.body[0], 'commentcount','Should have number count')
            assert.property(res.body[0], 'title','Should be a valid String title')
            assert.property(res.body[0], '_id','Should contain random number and String mix')
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      let myId = shortId.isValid('bla bla')
      test('Test GET /api/books/[id] with id not in db',  function(done){
         chai.request(server)
         .get('/api/books/' + myId)
         .end(function(err,res){
           console.log(myId)
           assert.equal(res.status,200)
           console.log(res.body)
           assert.strictEqual(res.body,'no book exists','Is a invalid Id')
           done()
         })
        
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
           chai.request(server)
          .get('/api/books/' + id)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id)
            assert.equal(res.body.title, 'Sum of All Fears')
						done()
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
           chai.request(server)
          .post('/api/books/' + id)
          .send({
            comment: 'test comment'
          })
          .end(function(err, res){

            assert.isTrue(res.body.comments.includes('test comment'))

						chai
						.request(server)
						.delete("/api/books/" + id)
						.send({})
						.end(function(err, res) {
							done();
						});
          });


      });
      
    });

  });

});
