const sqlDbFactory = require("knex");

let sqlDb = sqlDbFactory({
    client: "pg",
    connection: process.env.DATABASE_URL || "postgres://pirqmnrjssujvc:8d68dd15b6d95c75eb108c77689389893ac5d4823018c69a5e0f43facb229c90@ec2-54-75-238-138.eu-west-1.compute.amazonaws.com:5432/d2g0b7p216e89i?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory",
    ssl: true,
    debug: true
});

accountSetup = (database) => {
    sqlDb = database;
    console.log("Checking if account table exists");
    return database.schema.hasTable("account").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("account", table => {
                table.increments("user_id");
                table.string("email").unique().notNullable();
                table.string("password").notNullable();
                table.string("name").notNullable();
                table.string("surname").notNullable();
                table.boolean("admin").defaultTo(false);
            })
        }
    });
};

authorSetup = (database) => {
    sqlDb = database;
    console.log("Checking if author table exists");
    return database.schema.hasTable("author").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("author", table => {
                table.increments("author_id");
                table.string("name").notNullable();
                table.string("surname").notNullable();
                table.text("imgpath").notNullable();
                table.text("biography");
            })
        }
    });
};

bookSetup = (database) => {
    sqlDb = database;
    console.log("Checking if book table exists");
    return database.schema.hasTable("book").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("book", table => {
                table.increments("book_id");
                table.string("title").notNullable();
                table.text("abstract");
                table.float("current_price").defaultTo(0).notNullable();
                table.integer("num_of_pages").notNullable();
                table.enu("cover_type",["hard cover","soft cover","e-book"]).notNullable();
                table.text("imgpath").notNullable();
                table.text("interview");
                table.integer("author_id").references("author.author_id").onUpdate("CASCADE").onDelete("CASCADE");;
            });
        }
    });
};

cartSetup = (database) => {
    sqlDb = database;
    console.log("Checking if cart table exists");
    return database.schema.hasTable("cart").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("cart", table => {
                table.integer("user_id").references("account.user_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.integer("book_id").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.integer("quantity").defaultTo(1);
                table.primary(["user_id","book_id"]);
            });
        }
    });
};

genreSetup = (database) => {
    sqlDb = database;
    console.log("Checking if genre table exists");
    return database.schema.hasTable("genre").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("genre", table => {
                table.integer("book_id").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.enu("genre",["thriller","fantasy","novel","horror","crime","romance","action","sci-fi"]);
                table.primary(["book_id", "genre"]);
            });
        }
    });
};

purchaseSetup = (database) => {
    sqlDb = database;
    console.log("Checking if purchase table exists");
    return database.schema.hasTable("purchase").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("purchase", table => {
                table.integer("book_id").notNullable().references("book.book_id").onUpdate("CASCADE").onDelete("SET NULL");
                table.integer("user_id").notNullable().references("account.user_id").onUpdate("CASCADE").onDelete("SET NULL");
                table.timestamp("timestamp").notNullable().defaultTo(database.fn.now());
                table.float("price").notNullable();
                table.integer("quantity").notNullable();
                table.primary(["book_id", "user_id", "timestamp"]);
            });
        }
    });
};

similaritySetup = (database) => {
    sqlDb = database;
    console.log("Checking if similarity table exists");
    return database.schema.hasTable("similarity").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("similarity", table => {
                table.integer("book_id1").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.integer("book_id2").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.primary(["book_id1","book_id2"]);
            });
        }
    });
};

eventSetup = (database) => {
    sqlDb = database;
    console.log("Checking if event table exists");
    return database.schema.hasTable("event").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("event", table => {
                table.increments("event_id");
                table.integer("book_id").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.timestamp("date").notNullable().defaultTo(database.fn.now());;
                table.text("description");
                table.string("location");
                table.string("organiser_email");
                table.text("imgpath").notNullable();
            })
        }
    })
};

favouriteSetup = (database) => {
    sqlDb = database;
    console.log("Checking if favourite table exists");
    return database.schema.hasTable("favourite").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("favourite", table => {
                table.integer("book_id").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.primary(["book_id"]);
            })
        }
    })
};

reviewSetup = (database) => {
    sqlDb = database;
    console.log("Checking if review table exists");
    return database.schema.hasTable("review").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            database.schema.createTable("review", table => {
                table.integer("user_id").references("account.user_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.integer("book_id").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.text("text").notNullable();
                table.integer("rating").notNullable();
                table.primary(["user_id", "book_id"]);
            })
        }
    })
};

themeSetup = (database) => {
    sqlDb = database;
    console.log("Checking if theme table exists");
    return database.schema.hasTable("theme").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("theme", table => {
                table.integer("book_id").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.enu("theme", ["War", "Love", "Magic", "Fantasy", "Italy"]).notNullable();
                table.primary(["book_id", "theme"]);
            })
        }
    })
};

top10Setup = (database) => {
    sqlDb = database;
    console.log("Checking if top10 table exists");
    return database.schema.hasTable("top10").then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable("top10", table => {
                table.integer("book_id").references("book.book_id").onUpdate("CASCADE").onDelete("CASCADE");
                table.primary(["book_id"]);
            })
        }
    })
};

function setupDatabase() {
    console.log("Setting up the database");
    accountSetup(sqlDb);
    authorSetup(sqlDb);
    bookSetup(sqlDb);
    cartSetup(sqlDb);
    genreSetup(sqlDb);
    purchaseSetup(sqlDb);
    similaritySetup(sqlDb);
    eventSetup(sqlDb);
    favouriteSetup(sqlDb);
    reviewSetup(sqlDb);
    themeSetup(sqlDb);
    top10Setup(sqlDb);
}

module.exports = { database: sqlDb, setupDatabase };
