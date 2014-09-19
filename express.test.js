var superagent = require('superagent')
var expect = require('expect.js')
var mongoskin = require('mongoskin')


describe('basic api server', function(){

  before(function(done){
    db = mongoskin.db('mongodb://@localhost:27017/authTestProject', {safe:true})
    db.collection("user").drop(function(err, reply) {
        db.collection("candy").drop(function(err, reply) {
          done()
        })
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

  it('can test credentials', function(done){
    superagent.get('http://localhost:3000/user')
      .auth('Ben-G', 'testpw')
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.status).to.eql(200)
        done()
      })
  })

  it('cannot create two user accounts with the same password', function(done){
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

  it('can create candies', function(done){
    superagent.post('http://localhost:3000/candy')
      .auth('Ben-G', 'testpw')
      .send({name:"Chocolate", price:99})
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.status).to.eql(200)
        expect(res.body[0].name).to.eql("Chocolate")
        done()
    })
  })

  it('can create candies', function(done){
    superagent.post('http://localhost:3000/candy')
      .auth('Ben-G', 'testpw')
      .send({name:"Gummy Bears", price:200})
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.status).to.eql(200)
        expect(res.body[0].name).to.eql("Gummy Bears")
        done()
    })
  })

  it('can create candies', function(done){
    superagent.post('http://localhost:3000/candy')
      .auth('Ben-G', 'testpw')
      .send({name:"Fruit Snacks", price:25})
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.status).to.eql(200)
        expect(res.body[0].name).to.eql("Fruit Snacks")
        done()
    })
  })

  it('can retrieve created candies', function(done) {
    superagent.get('http://localhost:3000/candy')
      .auth('Ben-G', 'testpw')
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.status).to.eql(200)
        expect(res.body.length).to.eql(3)
        done()
      })
  })
})
