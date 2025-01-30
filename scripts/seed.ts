import { db } from "@/lib/db";

const seed = async () => {
  try {
    // Clear existing data
    await db.book.deleteMany();
    await db.category.deleteMany();

    // First, create categories
    const categories = [
      { name: "Non-Fiction" },
      { name: "Fiction" },
      { name: "Business" },
      {
        name: "Finance",
      },
    ];

    const createdCategories = await Promise.all(
      categories.map((category) =>
        db.category.create({
          data: category,
        })
      )
    );

    // Seed books with category connections
    const books = [
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
        addedById: "cm6jg580j0000q9tkk49l2qc3",
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
        addedById: "cm6jg580j0000q9tkk49l2qc3",
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
        addedById: "cm6jg580j0000q9tkk49l2qc3",
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
        addedById: "cm6jg580j0000q9tkk49l2qc3",
        addedAt: new Date(),
        language: "English",
        categoryId: createdCategories[3].id, // Finance
      },
    ];

    // Insert books into the database
    for (const book of books) {
      await db.book.create({
        data: {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          description: book.description,
          coverImage: book.coverImage,
          size: book.size,
          publishedAt: book.publishedAt,
          addedById: book.addedById,
          categories: {
            connect: {
              id: book.categoryId,
            },
          },
          addedAt: book.addedAt,
          language: book.language,
        },
      });
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await db.$disconnect();
  }
};

seed();
