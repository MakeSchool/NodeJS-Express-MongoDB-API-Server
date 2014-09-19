var superagent = require('superagent')
var expect = require('expect.js')
var mongoskin = require('mongoskin')


describe('basic api server', function(){

  before(function(done){
    db = mongoskin.db('mongodb://@localhost:27017/authTestProject', {safe:true})
    db.collection("user").drop(function(err, reply) {
      done()
    })
  })
  
  it('can create user accounts', function(done){
    superagent.post('http://localhost:3000/user')
      .send({ user: 'Ben-G', password: 'testpw' })
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.status).to.eql(200)
        expect(res.body[0].username).to.eql('Ben-G')
        done()
      })
  })

  it('cannot create tow user accounts with the same password', function(done){
    superagent.post('http://localhost:3000/user')
      .send({ user: 'Ben-G', password: 'testpw' })
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.status).to.eql(400)
        done()
      })
  })

  it('can access candy with correct credentials', function(done){
    superagent.get('http://localhost:3000/candy')
      .auth('Ben-G', 'testpw')
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.status).to.eql(200)
        done()
      })
  })
})
