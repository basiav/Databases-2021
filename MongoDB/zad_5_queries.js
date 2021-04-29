db = db.getSiblingDB("WojtarowiczBarbara");

// 5A
business = db.getCollection("yelp_academic_dataset_business")
business.find({stars: 5.0}).count()

// 5B
business.aggregate([
    { $match: { categories: "Restaurants" } },
    { $group: { _id: "$city", total: { $sum: 1 } } },
])

// 5C
business.aggregate([
    { $match: { categories: {$in: ["Hotels"] } } } ,
    { $group: { _id: "$city", total: { $sum: 1 } } },
    { $sort: { total: -1} }
])

// 5D
var mapFun = function(){
    var key = 1;
    var value = { funny: this.votes.funny, useful: this.votes.useful, cool: this.votes.cool }
    
    emit(key, value);
};

var reduceFun = function(key, vals){
    reducedVal = { funny: 0, useful: 0, cool: 0 };
    
    for (var idx = 0; idx < vals.length; idx++){
        reducedVal.funny += vals[idx].funny;
        reducedVal.useful += vals[idx].useful;
        reducedVal.cool += vals[idx].cool;
    }
    
    return reducedVal;
    
};

db.getCollection("yelp_academic_dataset_review").mapReduce(
    mapFun,
    reduceFun,
    {
        out: "categories_totals"
    }
);

db.getCollection("categories_totals").find({})



