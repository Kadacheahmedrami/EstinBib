import { db } from "@/db";
import { books, categories, bookCategories } from "@/db/schema"; // adjust the import path to your schema definitions

const seed = async () => {
  try {
    // Clear existing data in the proper order to avoid foreign key issues.
    await db.delete(bookCategories).execute();
    await db.delete(books).execute();
    await db.delete(categories).execute();

    // Define categories to seed.
    const categoryData = [
      { name: "Non-Fiction" },
      { name: "Fiction" },
      { name: "Business" },
      { name: "Finance" },
    ];

    // Insert categories and retrieve the created rows.
    const createdCategories = await Promise.all(
      categoryData.map(async (cat) => {
        const [insertedCat] = await db
          .insert(categories)
          .values(cat)
          .returning();
        return insertedCat;
      })
    );

    // Define book data with a reference to the category id.
    const bookData = [
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        isbn: "9780062316097",
        description:
          "A deep dive into the history of human evolution, from early hunter-gatherers to modern societies.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738540946/ppc7j0ygoawpckpaavvr.jpg",
        size: 498,
        publishedAt: new Date("2011-06-04"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[0].id, // Non-Fiction
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        description:
          "A dystopian novel that explores themes of totalitarianism, surveillance, and control.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738540946/uhshmygvha6zywpbvagd.jpg",
        size: 328,
        publishedAt: new Date("1949-06-08"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[1].id, // Fiction
      },
      {
        title: "The Lean Startup",
        author: "Eric Ries",
        isbn: "9780307887894",
        description:
          "A guide to startup success through lean methodologies, rapid prototyping, and continuous improvement.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738540946/bjwvnuo2wvt9ofeiqvqh.jpg",
        size: 336,
        publishedAt: new Date("2011-09-13"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[2].id, // Business
      },
      {
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        isbn: "9781612680170",
        description:
          "Explores financial education, investment strategies, and the mindset shift required for wealth-building.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738540947/vyszrgivbqyhiivmqonz.jpg",
        size: 336,
        publishedAt: new Date("1997-04-01"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[3].id, // Finance
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "9780735211292",
        description:
          "A practical guide to building good habits, breaking bad ones, and mastering tiny behaviors for remarkable results.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738540947/rynz3h87f8rbjphmqyjb.jpg",
        size: 320,
        publishedAt: new Date("2018-10-16"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[0].id, // Non-Fiction
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084",
        description:
          "A novel that explores themes of racial injustice, morality, and compassion in the American South.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738540947/dsozyrfsxeytd3t7310i.png",
        size: 324,
        publishedAt: new Date("1960-07-11"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[1].id, // Fiction
      },
      {
        title: "how innovation works",
        author: "Matt Ridley",
        isbn: "9780062916617",
        description:
          "Explores how innovation really works, examining the role of trial and error, collaboration, and gradual progress in technological advancement.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738171061/mdcbs2zoddjahu80sqsw.png",
        size: 406,
        publishedAt: new Date("2020-05-19"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[0].id, // Non-Fiction
      },
      {
        title: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        isbn: "9781593080259",
        description:
          "A young man makes a Faustian bargain, trading his soul for everlasting beauty.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738171061/qh4i1levrqzi0yi6y9kp.png",
        size: 288,
        publishedAt: new Date("1890-04-01"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[1].id, // Fiction
      },
      {
        title: "Company of One",
        author: "Paul Jarvis",
        isbn: "9781732265100",
        description:
          "Explores the benefits of staying small in business and the value of independence over growth.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738171061/gajybnbwljkrztt1c56m.png",
        size: 256,
        publishedAt: new Date("2019-01-15"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[2].id, // Business
      },
      {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        isbn: "9780857197689",
        description:
          "Discusses the psychological aspects of money management, such as risk tolerance, emotional resilience, and long-term thinking.",
        coverImage:
          "https://res.cloudinary.com/df9y24wp0/image/upload/v1738171060/y6cwvdhm1eygkp4rubq6.png",
        size: 256,
        publishedAt: new Date("2020-09-08"),
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[3].id, // Finance
      },
    ];

    // Insert each book and create its relation with the corresponding category.
    for (const book of bookData) {
      // Insert the book record.
      const [insertedBook] = await db
        .insert(books)
        .values({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          description: book.description,
          coverImage: book.coverImage,
          size: book.size,
          publishedAt: book.publishedAt,
          addedAt: book.addedAt,
          language: book.language,
          available: true,
        })
        .returning();

      // Create the join record in bookCategories to link the book with its category.
      await db
        .insert(bookCategories)
        .values({
          bookId: insertedBook.id,
          categoryId: book.categoryId,
        })
        .execute();
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();
