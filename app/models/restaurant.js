var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var restaurantSchema = new Schema({
    address: {
        street: String,
        zipcode: String,
        building: String,
        coord: {
            lat: String,
            lon: String
        }
    },
    borough: String,
    cuisine: String,
    rating: [
        {
            date: {type: Date, default: Date.now},
            by: String,
            score: {
                type: Number,
                min: 1,
                max: 10
            }
        }
    ],
    name: {type: String, required: 'Missing Restaurant Name'},
    restaurant_id: String,
    by: String,
    created_at: {type: Date, default: Date.now},
    img: {
        data: Buffer,
        contentType: String,
        filename: String
    }
});

restaurantSchema.virtual('reviews').get(function () {
    return this.rating.by + ' ' + this.name;
});

/*restaurantSchema.methods.findDuplicateReviews = function (reviewStr) {
    return reviewStr === this.reviews;
};*/


restaurantSchema.set('toJSON', {virtual: true});
mongoose.model('restaurants', restaurantSchema);