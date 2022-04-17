const mongoose = require("mongoose");
const databasename = "quotesDB";
const url = 'mongodb://localhost:27017/';

const QuoteSchema = {
  content: {
    type: String,
    required: [true, "What is the content of the Quote?"],
  },
  author: {
    type: String,
    required: [true, "Make sure to give credit when it's due."],
  },
  cite: {
    type: String,
  }
}

const Quote = mongoose.model("Quote", QuoteSchema);

const quote1 = Quote({
  content: "This is a great Quote",
  author: "Jj Zettler",
});

const quote2 = Quote({
  content: "This is another great Quote",
  author: "Jj Zettler",
});

const quote3 = Quote({
  content: "He's full of them!",
  author: "Jj Zettler",
});

const defaultQuotes = [quote1, quote2, quote3];


module.exports.getRandomQuote = GetQuote;

function GetQuote() {

  Quote.find({}, function(err, foundItem) {
    if (foundItem.length === 0) {
      console.log("No Quotes Found, adding to db.");
      Quote.insertMany(defaultQuotes, function(err) {
        // if (err) {
        //   console.log(err);
        // } else {
        //   console.log("Saved items to " + databasename);
        // }
      });
    }

    let ran = Math.floor(Math.random() * defaultQuotes.length);
    let ranQuote = defaultQuotes[ran];
    console.log("Quote(" + ran +"): " + ranQuote);
    return ranQuote;
    //Get Random Quote Here
  });
}
