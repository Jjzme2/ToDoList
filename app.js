const MongoClient = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();


const databasename = "todolistDB";
//myDatabase?retryWrites=true&w=majority'
const url = 'mongodb+srv://Jjzme2:tBYrKITMQ8RNwcjL@cluster1.t39wt.mongodb.net/';

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(url + databasename, {
  useNewUrlParser: true
});


// Schemas
const ItemSchema = {
  description: {
    type: String,
    required: [true, "What item are we creating?"],
  }
}

const ListSchema = {
  name: {
    type: String,
    required: [true, "All Lists need a name."],
  },
  items: {
    type: [ItemSchema],
  }
}

// Models
const List = mongoose.model("List", ListSchema);

const Item = mongoose.model("Item", ItemSchema);


//Initial Items
const firstItem = Item({
  description: "Enter text below to add a new item"
});
const secondItem = Item({
  description: "Complete Item on list."
});
const thirdItem = Item({
  description: "<----- Will finish and delete this item"
});

//Initial Item Array
const defaultItems = [firstItem, secondItem, thirdItem];


app.set('view engine', 'ejs');


// App.Get

//Maybe rename to /lists/main
app.get("/", function(req, res) {

  let day = date.getDate();
  let timeOfDay = date.getTime();
  let time = date.getTimeString();

  Item.find({}, function(err, foundItem) {
    if (foundItem.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Saved items to itemDB");
        }
        res.redirect("/");
      });
    } else {
      if (err) {
        console.log(err);
      } else {
        res.render('list', {
          day: day,
          listTitle: "Main",
          addItems: foundItem,
          List: List,
          timeOfDay: timeOfDay,
          // time: time,
        })
      }
    }
  })
});

app.get("/:listName", function(req, res) {
  // let allLists = List.find({});
  let day = date.getDate();
  let timeOfDay = date.getTime();
  let time = date.getTimeString();
  let customListName = req.params.listName.toLowerCase();

  List.findOne({
    name: customListName
  }, function(err, li) {
    if (!err) {
      if (!li) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();

        res.redirect("/" + customListName)
      } else {
        res.render('list', {
          day: day,
          listTitle: li.name,
          addItems: li.items,
          List: List,
          timeOfDay: timeOfDay,
          // time: time,
        })
      }
    }
  })
});

app.get("/about", function(req, res) {
  let day = date.getDate();
  let timeOfDay = date.getTime();
  res.render('about');
});





// App.Post
app.post("/", function(req, res) {
  let item = req.body.addItem;
  let list = req.body.listButton;

  const newItem = new Item({
    description: item
  });

  if (list === "Main") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: list
    }, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + foundList.name);
    })
  }
  // Work List is coming from the listTitle in the app.get("/work") that the ejs name we set in ejs
  // if (req.body.listButton === "Work List") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete", function(req, res) {

  const checkedItem = req.body.checkBox;
  const listName = req.body.listName;

  if (listName === "Main") {
    //Default List
    Item.findByIdAndRemove(checkedItem, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted " + checkedItem);
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {
      $pull: {
        items: {
          _id: checkedItem
        }
      }
    }, function(err, foundList) {
      if (err) {
        console.log(err);
      }else{
        res.redirect("/" + listName);
      }
    })
  }
});

// App.Listen

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000.");
});
