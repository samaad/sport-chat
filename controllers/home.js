module.exports = function(async, Club, _, Users){
  return {
    SetRouting: function(router){
      router.get('/home', this.homePage);
      // router.post('/home', this.postHomePage);
      
      // router.get('/logout', this.logout);
    },

    homePage: function(req, res){
      async.parallel([
        function(callback){
          Club.find({}, (err, result) => {
              callback(err, result);
            })
          },
          
        function(callback){
          Club.aggregate([{
            $group: {
                _id: "$country"
            }
          }], (err, newResult) => {
            callback(err, newResult) ;
          });
        },
        
        // function(callback){
        //   Users.findOne({'username': req.user.username})
        //     .populate('request.userId')
        //     .exec((err, result) => {
        //         callback(err, result);
        //     })
        // },
      ], (err, results) => {
        const res1 = results[0];
        const res2 = results[1];
        // const res3 = results[2];
        const dataChunk  = [];
        const chunkSize = 3;
        for (let i = 0; i < res1.length; i += chunkSize){
            dataChunk.push(res1.slice(i, i+chunkSize));
        }
        const countrySort = _.sortBy(res2, '_id');
        res.render('home', {title: 'Footballkik - Home',  chunks: dataChunk, country: countrySort});
      })
    },
  }
}