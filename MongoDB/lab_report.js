db = db.getSiblingDB("WojtarowiczBarbara");

/* LAB TASKS */
// Zadanie 5
// A
business = db.getCollection("yelp_academic_dataset_business")
business.find({stars: 5.0}).count()

// B
business.aggregate([
    { $match: { categories: "Restaurants" } },
    { $group: { _id: "$city", total: { $sum: 1 } } },
])

// 5C
db.getCollection("yelp_academic_dataset_business").aggregate([
    { $match: {categories: {$regex : ".*Hotels.*"},attributes: {"Wi-Fi" : "free"}, stars: {$gte : 4.5} } },
    { $group: {_id: "$state", total: {$sum: 1} } }
])

// D
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


/* HOMEWORK */
// Zadanie 1
// A
db.getCollection("yelp_academic_dataset_business").find({open: false}, {name: 1, full_address: 1, stars: 1})

// B
db.getCollection("yelp_academic_dataset_user").find({
    $or:
    [
        {"votes.funny": 0},
        {"votes.useful": 0}
    ]

}).sort({"name": 1})

// C
db.getCollection("yelp_academic_dataset_tip").aggregate([
    {$match: {"date": /2012/ }},
    {$group: {_id: "$business_id", count: {$sum: 1}}},
    {$sort: {"count": 1}}
])

// D
db.getCollection("yelp_academic_dataset_review").aggregate([
    {$group: {_id: "$business_id", avgStars: {$avg: "$stars"}}},
    {$match: {"avgStars": {$gte: 4}}}
])

// E
db.getCollection("yelp_academic_dataset_business").deleteMany({"stars": 2.0})

// Zadanie 2
function insertReview(user_id, text, business_id, review_id){
    db.yelp_academic_dataset_review.insert({
        votes: {
            funny: 0,
            useful: 0,
            cool: 0
        },
        user_id: user_id,
        review_id: review_id,
        stars: 0,
        date: new Date(),
        text: text,
        type: "review",
        business_id: business_id
    })
}

insertReview("MWhR9LvOdRbqtu1I_DRFBg", "Sample review", "gxuVySgACHDqJlwmelFHLA", "gxuVySgACHDqJlwmelFHLA")

db.getCollection("yelp_academic_dataset_review").find({text: "Sample review"}, {})

// Zadanie 3
function getBusinessWithCategory(category){
    return db.getCollection("yelp_academic_dataset_business").find({"categories": category})
}

getBusinessWithCategory("Restaurants")

// Zadanie 4
function modifyUserName(user_id, new_name){
    db.yelp_academic_dataset_user.update(
        {user_id: user_id},
        {$set: {name: new_name}}
    )
}

modifyUserName("MWhR9LvOdRbqtu1I_DRFBg", "New name")
db.yelp_academic_dataset_user.find({name: "New name"})

// Zadanie 5
var mapFun = function(){
    var key = this.business_id;
    var value = 1;
    emit(key, value);
};

var reduceFun = function(key, values){
    return Array.sum(values);
};

db.getCollection("yelp_academic_dataset_review").mapReduce(
    mapFun,
    reduceFun,
    {
        out: "count_tips"
    }
);

var avgTips = function(tips){
    sum = 0;
    for (i = 0; i < tips.length; i++){
        sum += tips[i].value;
    }
    return sum/tips.length;
}

avgTips(db.count_tips.find().toArray())

// Zadanie 7
/* SAMPLE CLIENT-SHOPPING-PRODUCT DATABASE */
db.getSiblingDB("ClientsDatabase")

function addClient(firstname, lastname, phone, email){
    db.Clients.insert({
        lastname: lastname,
        firstname: firstname,
        phone: phone,
        email: email,
        shoppings: []
    })
}

addClient("Aneta", "Lipińska", "12345678", "a.lipinska@onet.pl")
db.Clients.find({})

function addProduct(name, category, price, description){
    db.Products.insert({
        name: name,
        category: category,
        price: price,
        description: description
    })
}

addProduct("Komputer", "Elektronika", 3000, "Najnowszy model");
addProduct("Książka", "Rozrywka", 29.99, "Wciągająca powieść");
addProduct("Sok pomarańczowy", "Spożywcze", 4.99, "Pyszny!");
addProduct("Kanapka", "Spożywcze", 7.99, "Pyszna!");
addProduct("Croissant", "Spożywcze", 6.99, "Chrupiący!");
addProduct("Śrubokręt", "Majsterkowanie", 6.99, "Potrzebny!");
addProduct("Pilka do siatkówki", "Sport", 6.99, "Kulista");

function addShopping(shopName, shopAddress, date, payment){
    db.Shopping.insert({
        shop: {
            shopName: shopName,
            shopAddress: shopAddress
        },
        date: ISODate(date),
        payment: payment,
        Products: []
    })
}

addShopping("Auchan", "Aleja Mickiewicza 23", "2021-05-13", "cash");
addShopping("Rossmann", "Aleja Mickiewicza 48", "2021-05-13", "cash");
addShopping("Carrefour", "Czarnowiejska 7", "2021-05-10", "card");
addShopping("Media Markt", "Szewska 19", "2021-04-10", "cash");
addShopping("Spożywczy", "Sosnowa 10", "2020-05-13", "card");
addShopping("Auchan", "Josepha Conrada 10", "2021-03-13", "cash");

function addProductToShopping(shoppingID, productID){
    db.Shoppings.update(
        {"_id": ObjectId(shoppingID)},
        {$push: {
            Products: {$ref: "Products", $id: ObjectId(productID)}
        }}
    );
}

addProductToShopping("609c61d3033702ff4cead7b7", "609c5fab033702ff4cead7b1")
addProductToShopping("609c61d3033702ff4cead7b7", "609c5fab033702ff4cead7b1")
addProductToShopping("609c61d3033702ff4cead7b7", "609c5fab033702ff4cead7b1")
addProductToShopping("609c61d3033702ff4cead7b7", "609c5fab033702ff4cead7b2")
addProductToShopping("609c61d3033702ff4cead7b7", "609c5fab033702ff4cead7b2")
addProductToShopping("609c61d3033702ff4cead7b7", "609c5fab033702ff4cead7b2")

addProductToShopping("609c61d3033702ff4cead7ba", "609c5fab033702ff4cead7b1")
addProductToShopping("609c61d3033702ff4cead7ba", "609c5fab033702ff4cead7b3")
addProductToShopping("609c61d3033702ff4cead7ba", "609c5fab033702ff4cead7b3")


addProductToShopping("609c61d3033702ff4cead7bb", "609c5fab033702ff4cead7b5")
addProductToShopping("609c61d3033702ff4cead7bb", "609c5fab033702ff4cead7b5")
addProductToShopping("609c61d3033702ff4cead7bc", "609c5fab033702ff4cead7b5")

function addShoppingToClient(clientID, shoppingID){
    db.Clients.update(
        {"_id": ObjectId(clientID)},
        {$addToSet: {
            shoppings: {$ref: "Shoppings", $id: ObjectId(shoppingID)}
        }}
    );
}

addShoppingToClient("609c594a033702ff4cead7ac", "609c61d3033702ff4cead7b7")
addShoppingToClient("609c594a033702ff4cead7ac", "609c61d3033702ff4cead7bc")
addShoppingToClient("609c598b033702ff4cead7af", "609c61d3033702ff4cead7ba")
addShoppingToClient("609c5960033702ff4cead7ad", "609c61d3033702ff4cead7bb")