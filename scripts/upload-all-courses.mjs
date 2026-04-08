import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChidtgww4rzIV8tUOrJEmOPdfWFv_sTbA",
  authDomain: "adaptive-e-learning-323f3.firebaseapp.com",
  projectId: "adaptive-e-learning-323f3",
  storageBucket: "adaptive-e-learning-323f3.firebasestorage.app",
  messagingSenderId: "608499611832",
  appId: "1:608499611832:web:09989583b0f6e95aa65c4d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const coursesData = [
  // CODING FIELD
  {
    id: 'js-basics',
    field: 'coding',
    title: 'JavaScript Basics',
    description: 'Learn the fundamentals of JavaScript programming',
    youtubeId: 'W6NZfCO5SIk',
    thumbnail: 'https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
    fullContent: `JavaScript is the programming language of the web. In this comprehensive course, you'll learn everything from variables and data types to functions and DOM manipulation.`,
    simplifiedContent: `JavaScript makes websites interactive. You'll learn how to store data, write instructions, and make web pages respond to user actions.`,
    milestones: [
      { id: 1, title: 'Introduction to JavaScript', order: 1, content: `Welcome to JavaScript! In this milestone, you'll learn what JavaScript is and why it's important for web development.`, simplifiedContent: `JavaScript makes websites do cool things.` },
      { id: 2, title: 'Variables and Data Types', order: 2, content: `Variables are containers for storing data values. In JavaScript, we declare variables using let, const, or var.`, simplifiedContent: `Variables store information.` },
      { id: 3, title: 'Functions', order: 3, content: `Functions are reusable blocks of code that perform specific tasks.`, simplifiedContent: `Functions are like recipes.` },
      { id: 4, title: 'Objects', order: 4, content: `Objects are collections of key-value pairs that represent real-world entities.`, simplifiedContent: `Objects group related information together.` },
      { id: 5, title: 'DOM Manipulation', order: 5, content: `The Document Object Model (DOM) is how JavaScript interacts with HTML.`, simplifiedContent: `DOM lets JavaScript change what's on the webpage.` }
    ]
  },
  {
    id: 'react-fundamentals',
    field: 'coding',
    title: 'React Fundamentals',
    description: 'Master the React library for building user interfaces',
    youtubeId: 'Ke90Tje7VS0',
    thumbnail: 'https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg',
    fullContent: `React is a JavaScript library for building user interfaces, developed by Facebook.`,
    simplifiedContent: `React helps you build websites by splitting them into small pieces.`,
    milestones: [
      { id: 1, title: 'Introduction to React', order: 1, content: `React is a JavaScript library created by Facebook for building user interfaces.`, simplifiedContent: `React is a tool for building websites.` },
      { id: 2, title: 'Components', order: 2, content: `Components are the building blocks of React applications.`, simplifiedContent: `Components are like Lego blocks for websites.` },
      { id: 3, title: 'State', order: 3, content: `State is data that changes over time in a component.`, simplifiedContent: `State is information that can change.` },
      { id: 4, title: 'Props', order: 4, content: `Props (short for properties) are how data flows from parent to child components.`, simplifiedContent: `Props are like settings you give to components.` },
      { id: 5, title: 'Hooks', order: 5, content: `Hooks are functions that let you use state and other React features in functional components.`, simplifiedContent: `Hooks add special powers to components.` }
    ]
  },
  {
    id: 'data-structures',
    field: 'coding',
    title: 'Data Structures',
    description: 'Understand essential data structures for efficient programming',
    youtubeId: 'bum_19X9LVA',
    thumbnail: 'https://img.youtube.com/vi/bum_19X9LVA/maxresdefault.jpg',
    fullContent: `Data structures are ways of organizing and storing data so it can be accessed and modified efficiently.`,
    simplifiedContent: `Data structures are ways to organize information.`,
    milestones: [
      { id: 1, title: 'Introduction to Data Structures', order: 1, content: `Data structures are specialized formats for organizing, processing, and storing data.`, simplifiedContent: `Data structures are recipes for organizing information.` },
      { id: 2, title: 'Arrays', order: 2, content: `Arrays are the most basic data structure, storing elements in contiguous memory locations.`, simplifiedContent: `Arrays store items in order.` },
      { id: 3, title: 'Linked Lists', order: 3, content: `Linked lists store elements in nodes, where each node points to the next.`, simplifiedContent: `Linked lists are like a treasure hunt.` },
      { id: 4, title: 'Trees', order: 4, content: `Trees are hierarchical structures with a root node and child nodes.`, simplifiedContent: `Trees branch like a family tree.` },
      { id: 5, title: 'Graphs', order: 5, content: `Graphs consist of vertices (nodes) connected by edges.`, simplifiedContent: `Graphs show how things connect.` }
    ]
  },
  // MANAGEMENT FIELD
  {
    id: 'time-management',
    field: 'management',
    title: 'Time Management',
    description: 'Master techniques for effective time utilization',
    youtubeId: 'y2X3cNVSzG0',
    thumbnail: 'https://img.youtube.com/vi/y2X3cNVSzG0/maxresdefault.jpg',
    fullContent: `Time is our most valuable resource, and mastering its management is crucial for success.`,
    simplifiedContent: `Learn to use your time wisely.`,
    milestones: [
      { id: 1, title: 'Introduction to Time Management', order: 1, content: `Time management is the process of planning and controlling how much time to spend on specific activities.`, simplifiedContent: `Time management means planning your time.` },
      { id: 2, title: 'Prioritization Techniques', order: 2, content: `The Eisenhower Matrix helps you categorize tasks by urgency and importance.`, simplifiedContent: `Some tasks matter more than others.` },
      { id: 3, title: 'Planning and Scheduling', order: 3, content: `Effective planning involves breaking large goals into smaller, manageable tasks.`, simplifiedContent: `Planning means deciding ahead of time.` },
      { id: 4, title: 'Productivity Tools', order: 4, content: `The Pomodoro Technique uses 25-minute focused work sessions followed by 5-minute breaks.`, simplifiedContent: `Tools like Pomodoro help you focus.` },
      { id: 5, title: 'Building Habits', order: 5, content: `Habits automate behaviors, reducing the mental effort needed for routine tasks.`, simplifiedContent: `Good habits make things automatic.` }
    ]
  },
  {
    id: 'leadership-basics',
    field: 'management',
    title: 'Leadership Basics',
    description: 'Develop essential leadership skills for teams and organizations',
    youtubeId: 'lMYG0gzbWw8',
    thumbnail: 'https://img.youtube.com/vi/lMYG0gzbWw8/maxresdefault.jpg',
    fullContent: `Leadership is the ability to guide and inspire others toward common goals.`,
    simplifiedContent: `Leadership means getting people to work together.`,
    milestones: [
      { id: 1, title: 'Introduction to Leadership', order: 1, content: `Leadership is the art of motivating a group of people to achieve a common goal.`, simplifiedContent: `Leaders help teams work together.` },
      { id: 2, title: 'Vision and Direction', order: 2, content: `A clear vision provides direction and purpose.`, simplifiedContent: `A vision is a picture of where you want to go.` },
      { id: 3, title: 'Communication Skills', order: 3, content: `Effective communication is the foundation of leadership.`, simplifiedContent: `Leaders communicate clearly and listen well.` },
      { id: 4, title: 'Delegation', order: 4, content: `Delegation distributes work and develops team members.`, simplifiedContent: `Delegation means giving tasks to others.` },
      { id: 5, title: 'Motivation', order: 5, content: `Understanding what motivates each team member is key to leadership.`, simplifiedContent: `Different people want different things.` }
    ]
  },
  {
    id: 'communication-skills',
    field: 'management',
    title: 'Communication Skills',
    description: 'Master the art of effective professional communication',
    youtubeId: '9F2gO4E4R6w',
    thumbnail: 'https://img.youtube.com/vi/9F2gO4E4R6w/maxresdefault.jpg',
    fullContent: `Communication is the backbone of professional success.`,
    simplifiedContent: `Good communication helps you share ideas.`,
    milestones: [
      { id: 1, title: 'Introduction to Communication', order: 1, content: `Communication is exchanging information through speaking, writing, or body language.`, simplifiedContent: `Communication is sharing information.` },
      { id: 2, title: 'Active Listening', order: 2, content: `Active listening means fully focusing on the speaker, not just waiting for your turn to talk.`, simplifiedContent: `Active listening means paying full attention.` },
      { id: 3, title: 'Speaking Effectively', order: 3, content: `Clear speaking involves organized thoughts, appropriate vocabulary, and good pacing.`, simplifiedContent: `Speaking well means being clear and organized.` },
      { id: 4, title: 'Writing Skills', order: 4, content: `Professional writing should be clear, concise, and structured.`, simplifiedContent: `Good writing is clear and simple.` },
      { id: 5, title: 'Feedback', order: 5, content: `Giving feedback is a skill that improves with practice.`, simplifiedContent: `Good feedback is specific and helpful.` }
    ]
  },
  // PHILOSOPHY FIELD
  {
    id: 'stoicism',
    field: 'philosophy',
    title: 'Stoicism',
    description: 'Explore the ancient philosophy of inner strength and virtue',
    youtubeId: 'X7H6h21qVwE',
    thumbnail: 'https://img.youtube.com/vi/X7H6h21qVwE/maxresdefault.jpg',
    fullContent: `Stoicism is an ancient Greek and Roman philosophy that teaches the development of self-control and fortitude.`,
    simplifiedContent: `Stoicism teaches you to focus on what you can control.`,
    milestones: [
      { id: 1, title: 'Introduction to Stoicism', order: 1, content: `Stoicism was founded in Athens around 300 BC by Zeno of Citium.`, simplifiedContent: `Stoicism started in ancient Greece.` },
      { id: 2, title: 'Marcus Aurelius', order: 2, content: `Marcus Aurelius was Roman Emperor from 161 to 180 AD and wrote 'Meditations'.`, simplifiedContent: `Marcus Aurelius was a Roman emperor who wrote a famous book.` },
      { id: 3, title: 'Epictetus', order: 3, content: `Epictetus was born a slave and later became a prominent Stoic philosopher.`, simplifiedContent: `Epictetus was a former slave who taught philosophy.` },
      { id: 4, title: 'Seneca', order: 4, content: `Seneca was a Roman Stoic philosopher, statesman, and dramatist.`, simplifiedContent: `Seneca was a wealthy Roman writer.` },
      { id: 5, title: 'Applying Stoicism Today', order: 5, content: `Modern Stoicism combines ancient wisdom with contemporary psychology.`, simplifiedContent: `People today still use Stoic ideas.` }
    ]
  },
  {
    id: 'existentialism',
    field: 'philosophy',
    title: 'Existentialism',
    description: 'Understand the philosophy of individual existence and freedom',
    youtubeId: 'v0rfTJBGKy0',
    thumbnail: 'https://img.youtube.com/vi/v0rfTJBGKy0/maxresdefault.jpg',
    fullContent: `Existentialism is a philosophy that emphasizes individual existence, freedom, and choice.`,
    simplifiedContent: `Existentialism is about finding your own meaning in life.`,
    milestones: [
      { id: 1, title: 'Introduction to Existentialism', order: 1, content: `Existentialism focuses on human existence, freedom, and the search for meaning.`, simplifiedContent: `Existentialism says create your own purpose.` },
      { id: 2, title: 'Kierkegaard and Nietzsche', order: 2, content: `Kierkegaard focused on individual choice and faith.`, simplifiedContent: `Kierkegaard focused on personal faith.` },
      { id: 3, title: 'Jean-Paul Sartre', order: 3, content: `Sartre developed the most systematic form of existentialism.`, simplifiedContent: `Sartre said we choose who we become.` },
      { id: 4, title: 'Albert Camus', order: 4, content: `Camus explored the absurd - the conflict between our desire for meaning.`, simplifiedContent: `Camus asked how to live without meaning.` },
      { id: 5, title: 'Living Existentially', order: 5, content: `Living authentically means making choices aligned with your values.`, simplifiedContent: `Living existentially means being true to yourself.` }
    ]
  },
  {
    id: 'ethics',
    field: 'philosophy',
    title: 'Ethics',
    description: 'Explore the fundamental questions of right and wrong',
    youtubeId: 'p9f-YO7pG6w',
    thumbnail: 'https://img.youtube.com/vi/p9f-YO7pG6w/maxresdefault.jpg',
    fullContent: `Ethics is the branch of philosophy concerned with right and wrong conduct.`,
    simplifiedContent: `Ethics is about what's right and wrong.`,
    milestones: [
      { id: 1, title: 'Introduction to Ethics', order: 1, content: `Ethics asks fundamental questions about right and wrong.`, simplifiedContent: `Ethics is the study of right and wrong.` },
      { id: 2, title: 'Utilitarianism', order: 2, content: `Utilitarianism states that actions are right if they promote happiness.`, simplifiedContent: `Utilitarianism says maximize happiness.` },
      { id: 3, title: 'Deontology', order: 3, content: `Deontology focuses on duties and rules, regardless of consequences.`, simplifiedContent: `Deontology says some things are always wrong.` },
      { id: 4, title: 'Virtue Ethics', order: 4, content: `Virtue ethics focuses on character rather than actions.`, simplifiedContent: `Virtue ethics asks what kind of person to be.` },
      { id: 5, title: 'Modern Applications', order: 5, content: `Contemporary ethical issues include AI ethics, bioethics, environmental ethics.`, simplifiedContent: `Old frameworks help with new problems.` }
    ]
  },
  // HTML CSS from original script
  {
    id: 'coding-html-css-101',
    field: 'coding',
    title: 'HTML & CSS: Architecting the Visual Web',
    description: 'Master the structural foundation and stylistic power of the web.',
    youtubeId: 'qz0aGYrrlhU',
    thumbnail: 'https://img.youtube.com/vi/qz0aGYrrlhU/maxresdefault.jpg',
    fullContent: `Every website you visit is built on the twin pillars of HTML and CSS.`,
    simplifiedContent: `HTML is the frame, CSS is the paint.`,
    milestones: [
      { id: 1, title: 'HTML5: The Semantic Blueprint', order: 1, content: `We strip the web back to its core: the document structure.`, simplifiedContent: `Learn how to organize a web page's content.` },
      { id: 2, title: 'CSS Foundations and the Box Model', order: 2, content: `Where the visual magic begins.`, simplifiedContent: `Make things look good with colors and fonts.` },
      { id: 3, title: 'Modern Layouts: Flexbox, Grid, and Responsiveness', order: 3, content: `The most advanced and powerful aspects of modern CSS.`, simplifiedContent: `Make sites work on phones and computers.` }
    ]
  }
];

async function uploadAllCourses() {
  try {
    // First, delete existing courses to avoid duplicates
    const snapshot = await getDocs(collection(db, 'courses'));
    console.log(`Found ${snapshot.size} existing courses. Deleting...`);
    
    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'courses', d.id)));
    await Promise.all(deletePromises);
    console.log('Deleted existing courses.');
    
    // Now upload all courses
    console.log('Uploading all courses...');
    for (const course of coursesData) {
      const courseWithTimestamp = {
        ...course,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'courses', course.id), courseWithTimestamp);
      console.log(`Uploaded: ${course.title} (${course.field})`);
    }
    
    console.log('\nAll courses uploaded successfully!');
    console.log(`Total: ${coursesData.length} courses`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

uploadAllCourses();