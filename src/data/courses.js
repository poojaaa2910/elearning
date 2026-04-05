export const coursesData = [
  // CODING FIELD
  {
    id: 'js-basics',
    field: 'coding',
    title: 'JavaScript Basics',
    description: 'Learn the fundamentals of JavaScript programming',
    youtubeId: 'W6NZfCO5SIk',
    thumbnail: 'https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
    fullContent: `JavaScript is the programming language of the web. In this comprehensive course, you'll learn everything from variables and data types to functions and DOM manipulation. JavaScript powers interactive websites and is essential for any web developer. This course covers fundamental concepts that will give you a solid foundation for building web applications.`,
    simplifiedContent: `JavaScript makes websites interactive. You'll learn how to store data, write instructions, and make web pages respond to user actions.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to JavaScript',
        order: 1,
        content: `Welcome to JavaScript! In this milestone, you'll learn what JavaScript is and why it's important for web development. JavaScript was created in 1995 and has become one of the most popular programming languages in the world. It runs in every web browser and can also be used on servers with Node.js. JavaScript allows you to add interactivity to websites, create games, build mobile apps, and much more. This course will take you from absolute beginner to comfortable JavaScript developer. Let's start your journey!`,
        simplifiedContent: `JavaScript makes websites do cool things. It's used everywhere on the internet.`
      },
      {
        id: 2,
        title: 'Variables and Data Types',
        order: 2,
        content: `Variables are containers for storing data values. In JavaScript, we declare variables using let, const, or var. 'let' is used for values that can change, while 'const' is for values that won't change. JavaScript has several data types: strings (text), numbers, booleans (true/false), arrays (lists), and objects. Understanding data types is crucial for writing effective code. For example, you can't add a number to a string without converting it first.`,
        simplifiedContent: `Variables store information. Use 'let' for changing values, 'const' for fixed values. Text goes in quotes, numbers don't.`
      },
      {
        id: 3,
        title: 'Functions',
        order: 3,
        content: `Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition. A function can take inputs (parameters), process them, and return an output. In JavaScript, functions can be declared using the 'function' keyword or as arrow functions. Arrow functions provide a shorter syntax: const add = (a, b) => a + b. Functions can also have default parameters and be called with any number of arguments.`,
        simplifiedContent: `Functions are like recipes - they take ingredients (inputs), do something, and give back a result (output).`
      },
      {
        id: 4,
        title: 'Objects',
        order: 4,
        content: `Objects are collections of key-value pairs that represent real-world entities. They allow you to group related data and functions together. An object can contain properties (data) and methods (functions). For example, a 'person' object might have name, age, and a greet method. You can access object properties using dot notation (person.name) or bracket notation (person['name']). Objects are fundamental to JavaScript and are used extensively in modern frameworks.`,
        simplifiedContent: `Objects group related information together. A 'car' object might have color, speed, and a drive method.`
      },
      {
        id: 5,
        title: 'DOM Manipulation',
        order: 5,
        content: `The Document Object Model (DOM) is how JavaScript interacts with HTML. Through DOM manipulation, you can change page content, style, and structure dynamically. Common methods include document.getElementById(), querySelector(), and createElement(). You can add event listeners to respond to user actions like clicks and key presses. This is how interactive features like forms, animations, and dynamic content updates work.`,
        simplifiedContent: `DOM lets JavaScript change what's on the webpage. You can show, hide, or change elements when users interact.`
      }
    ]
  },
  {
    id: 'react-fundamentals',
    field: 'coding',
    title: 'React Fundamentals',
    description: 'Master the React library for building user interfaces',
    youtubeId: 'Ke90Tje7VS0',
    thumbnail: 'https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg',
    fullContent: `React is a JavaScript library for building user interfaces, developed by Facebook. It uses a component-based architecture where you build small, reusable pieces of code. React uses JSX, a syntax extension that lets you write HTML-like code in JavaScript. With React, you create dynamic, responsive UIs efficiently. This course covers components, state, props, and hooks - the essential building blocks of React applications.`,
    simplifiedContent: `React helps you build websites by splitting them into small pieces called components. It's very popular and used by big companies.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to React',
        order: 1,
        content: `React is a JavaScript library created by Facebook for building user interfaces. It uses a component-based approach where you create small, reusable pieces of code. React is declarative, meaning you describe what you want to see, and React handles how to make it happen. It uses a virtual DOM to efficiently update only the parts of the page that change. Many companies use React, including Facebook, Netflix, and Airbnb.`,
        simplifiedContent: `React is a tool for building websites. It divides pages into small pieces that you can reuse.`
      },
      {
        id: 2,
        title: 'Components',
        order: 2,
        content: `Components are the building blocks of React applications. A component is a function that returns JSX (JavaScript XML). There are two types: functional components and class components. Functional components are simpler and are the modern way to write React. Components can accept data through 'props' and return UI elements. Good component design separates concerns and makes code reusable.`,
        simplifiedContent: `Components are like Lego blocks for websites. Each piece does one job and can be combined with others.`
      },
      {
        id: 3,
        title: 'State',
        order: 3,
        content: `State is data that changes over time in a component. When state changes, React automatically re-renders the component to show the new data. You use the useState hook to add state: const [count, setCount] = useState(0). State is local to each component - other components don't have access to it unless you pass it down as props or use state management tools. Understanding state is key to building interactive applications.`,
        simplifiedContent: `State is information that can change, like a counter that goes up when you click. React remembers this and updates the screen.`
      },
      {
        id: 4,
        title: 'Props',
        order: 4,
        content: `Props (short for properties) are how data flows from parent to child components. Think of props as function arguments - you pass them when calling a component. Props are read-only, meaning a child component cannot modify its props. This one-way data flow makes React predictable and easier to debug. You can pass any type of data through props, including functions.`,
        simplifiedContent: `Props are like settings you give to components. A button component might get a 'color' prop to decide what color to be.`
      },
      {
        id: 5,
        title: 'Hooks',
        order: 5,
        content: `Hooks are functions that let you use state and other React features in functional components. The useState hook adds state, useEffect handles side effects, useContext accesses global data, and useRef accesses DOM elements. Custom hooks let you extract component logic into reusable functions. Hooks must be called at the top level and only in function components. They make code more concise and easier to test.`,
        simplifiedContent: `Hooks add special powers to components. useState adds memory, useEffect runs code when things change.`
      }
    ]
  },
  {
    id: 'data-structures',
    field: 'coding',
    title: 'Data Structures',
    description: 'Understand essential data structures for efficient programming',
    youtubeId: 'bum_19X9LVA',
    thumbnail: 'https://img.youtube.com/vi/bum_19X9LVA/maxresdefault.jpg',
    fullContent: `Data structures are ways of organizing and storing data so it can be accessed and modified efficiently. Choosing the right data structure can dramatically improve your code's performance. This course covers arrays, linked lists, stacks, queues, trees, and graphs. You'll learn when to use each structure and how to implement them in JavaScript. Understanding data structures is essential for coding interviews and writing efficient software.`,
    simplifiedContent: `Data structures are ways to organize information. Some are fast for searching, others for adding items. Picking the right one matters.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to Data Structures',
        order: 1,
        content: `Data structures are specialized formats for organizing, processing, and storing data. They provide a way to manage large amounts of data efficiently. Every program uses data structures - even simple apps use arrays and objects. Understanding data structures helps you write better code and solve problems more effectively. Different data structures excel at different operations, so choosing wisely is crucial for performance.`,
        simplifiedContent: `Data structures are recipes for organizing information. The right one makes your code faster and your life easier.`
      },
      {
        id: 2,
        title: 'Arrays',
        order: 2,
        content: `Arrays are the most basic data structure, storing elements in contiguous memory locations. In JavaScript, arrays can hold mixed types and can dynamically resize. Arrays provide fast access by index O(1) but slow insertion/deletion O(n). Operations include push, pop, shift, unshift, splice, and slice. Understanding array performance characteristics helps you decide when to use them versus other structures.`,
        simplifiedContent: `Arrays store items in order, like a numbered list. Great for fast access by position, slower for adding in the middle.`
      },
      {
        id: 3,
        title: 'Linked Lists',
        order: 3,
        content: `Linked lists store elements in nodes, where each node points to the next. Unlike arrays, linked lists don't need contiguous memory. They support efficient insertion and deletion O(1) but slow access O(n). Types include singly linked, doubly linked, and circular. Linked lists are foundational for understanding more complex structures like trees and graphs.`,
        simplifiedContent: `Linked lists are like a treasure hunt - each item tells you where to find the next one. Fast to add, slow to find.`
      },
      {
        id: 4,
        title: 'Trees',
        order: 4,
        content: `Trees are hierarchical structures with a root node and child nodes. Each node can have multiple children but only one parent. Binary trees have at most two children per node. Trees enable efficient searching O(log n) when balanced. Common operations include traversal (in-order, pre-order, post-order), insertion, and deletion. Binary search trees are used in databases and compilers.`,
        simplifiedContent: `Trees branch like a family tree. Each point can lead to more points below. Great for organizing and searching.`
      },
      {
        id: 5,
        title: 'Graphs',
        order: 5,
        content: `Graphs consist of vertices (nodes) connected by edges. They model relationships like social networks, road maps, and web pages. Graphs can be directed or undirected, weighted or unweighted. Common algorithms include BFS (breadth-first search) and DFS (depth-first search) for traversal, and Dijkstra's algorithm for shortest paths. Graphs are used in GPS systems, social media, and recommendation engines.`,
        simplifiedContent: `Graphs show how things connect, like friends on social media. Used for finding routes, recommendations, and relationships.`
      }
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
    fullContent: `Time is our most valuable resource, and mastering its management is crucial for success. This course covers proven techniques like the Pomodoro Technique, time blocking, priority matrices, and goal setting. You'll learn to identify time-wasters, set realistic goals, and create systems that work for your unique situation. These skills apply to students, professionals, and entrepreneurs alike.`,
    simplifiedContent: `Learn to use your time wisely. This course shows you tricks to get more done and stress less.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to Time Management',
        order: 1,
        content: `Time management is the process of planning and controlling how much time to spend on specific activities. Good time management enables you to work smarter, not harder, achieving more in less time. The benefits include reduced stress, better work-life balance, and increased productivity. Many people struggle with time management due to distractions, poor planning, or unclear priorities. This course will give you practical tools to take control of your time.`,
        simplifiedContent: `Time management means planning your time so you get more done with less stress. Everyone can benefit from it.`
      },
      {
        id: 2,
        title: 'Prioritization Techniques',
        order: 2,
        content: `The Eisenhower Matrix helps you categorize tasks by urgency and importance. Tasks are placed in four quadrants: urgent and important, important but not urgent, urgent but not important, and neither. The Pareto Principle states that 80% of results come from 20% of efforts. Learning to identify high-impact tasks ensures you focus energy where it matters most.`,
        simplifiedContent: `Some tasks matter more than others. The Eisenhower Matrix helps you decide what to do first - important things, not just urgent ones.`
      },
      {
        id: 3,
        title: 'Planning and Scheduling',
        order: 3,
        content: `Effective planning involves breaking large goals into smaller, manageable tasks. Time blocking allocates specific hours for different activities. The weekly review helps you reflect on what worked and adjust. Creating a morning routine sets a positive tone for the day. Digital tools like calendars and task managers can help, but the key is consistency.`,
        simplifiedContent: `Planning means deciding ahead of time what you'll do. Time blocking assigns specific hours for specific tasks.`
      },
      {
        id: 4,
        title: 'Productivity Tools',
        order: 4,
        content: `The Pomodoro Technique uses 25-minute focused work sessions followed by 5-minute breaks. Task managers like Todoist or Notion help organize projects. Calendar apps integrate schedules and reminders. Focus apps block distracting websites. The best tool is one you'll actually use consistently. Experiment to find what fits your workflow.`,
        simplifiedContent: `Tools like Pomodoro (25 min work, 5 min break) help you focus. Task apps keep everything organized in one place.`
      },
      {
        id: 5,
        title: 'Building Habits',
        order: 5,
        content: `Habits automate behaviors, reducing the mental effort needed for routine tasks. The habit loop consists of cue, routine, and reward. Start with small, achievable habits and gradually increase. Track your habits to maintain accountability. Remove friction from good habits and add friction to bad ones. Consistency over intensity leads to long-term success.`,
        simplifiedContent: `Good habits make things automatic. Start small, stay consistent, and the behavior becomes second nature.`
      }
    ]
  },
  {
    id: 'leadership-basics',
    field: 'management',
    title: 'Leadership Basics',
    description: 'Develop essential leadership skills for teams and organizations',
    youtubeId: 'lMYG0gzbWw8',
    thumbnail: 'https://img.youtube.com/vi/lMYG0gzbWw8/maxresdefault.jpg',
    fullContent: `Leadership is the ability to guide and inspire others toward common goals. Whether you're managing a team or leading a project, effective leadership skills are essential. This course covers vision setting, communication, delegation, motivation, and conflict resolution. You'll learn from real-world examples and develop practical skills you can apply immediately in your career.`,
    simplifiedContent: `Leadership means getting people to work together toward a goal. It's about inspiring, not just managing.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to Leadership',
        order: 1,
        content: `Leadership is the art of motivating a group of people to achieve a common goal. Good leaders inspire, empower, and develop their team members. Leadership isn't about having a title - it's about influence and impact. There are many leadership styles: autocratic, democratic, transformational, and servant leadership. The best leaders adapt their style to different situations and people.`,
        simplifiedContent: `Leaders help teams work together. You don't need a title to lead - anyone can inspire and guide others.`
      },
      {
        id: 2,
        title: 'Vision and Direction',
        order: 2,
        content: `A clear vision provides direction and purpose. Great leaders communicate their vision compellingly, making others want to follow. Vision should be inspiring yet achievable. Break the vision into actionable steps and celebrate milestones. Keep the vision visible and revisit it regularly. Without vision, teams lack purpose and motivation.`,
        simplifiedContent: `A vision is a picture of where you want to go. Good leaders share this picture so everyone knows the destination.`
      },
      {
        id: 3,
        title: 'Communication Skills',
        order: 3,
        content: `Effective communication is the foundation of leadership. This includes active listening, clear articulation, and appropriate body language. Leaders must communicate vision, expectations, and feedback. Different situations require different communication styles. Regular check-ins prevent misunderstandings. Address issues promptly and directly while maintaining respect.`,
        simplifiedContent: `Leaders communicate clearly and listen well. Good communication prevents problems and builds trust.`
      },
      {
        id: 4,
        title: 'Delegation',
        order: 4,
        content: `Delegation distributes work and develops team members. Many leaders struggle to let go, but trying to do everything yourself limits growth. Effective delegation involves choosing the right person, providing clear instructions, setting deadlines, and offering support without micromanaging. Trust your team and allow them to learn from mistakes.`,
        simplifiedContent: `Delegation means giving tasks to others. It helps your team grow and lets you focus on bigger priorities.`
      },
      {
        id: 5,
        title: 'Motivation',
        order: 5,
        content: `Understanding what motivates each team member is key to leadership. People are motivated by different factors: recognition, growth, autonomy, or purpose. Regular recognition and celebration of achievements boost morale. Create opportunities for learning and advancement. Foster a positive environment where people want to do their best work.`,
        simplifiedContent: `Different people want different things. Great leaders find what motivates each person and help them succeed.`
      }
    ]
  },
  {
    id: 'communication-skills',
    field: 'management',
    title: 'Communication Skills',
    description: 'Master the art of effective professional communication',
    youtubeId: '9F2gO4E4R6w',
    thumbnail: 'https://img.youtube.com/vi/9F2gO4E4R6w/maxresdefault.jpg',
    fullContent: `Communication is the backbone of professional success. This course covers verbal and non-verbal communication, active listening, written communication, and presentation skills. You'll learn to express ideas clearly, influence others, and build strong relationships. These skills are essential for interviews, meetings, negotiations, and everyday workplace interactions.`,
    simplifiedContent: `Good communication helps you share ideas and understand others. It makes work easier and relationships better.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to Communication',
        order: 1,
        content: `Communication is exchanging information through speaking, writing, or body language. In the workplace, effective communication prevents errors, builds relationships, and drives results. Studies show most workplace problems stem from poor communication. Skills needed include clarity, active listening, empathy, and adaptability. Communication is a two-way process - sending and receiving.`,
        simplifiedContent: `Communication is sharing information with others. Most job problems come from misunderstanding, so good communication matters.`
      },
      {
        id: 2,
        title: 'Active Listening',
        order: 2,
        content: `Active listening means fully focusing on the speaker, not just waiting for your turn to talk. It involves maintaining eye contact, asking clarifying questions, and summarizing what you heard. Avoid interrupting and resist the urge to formulate your response while the other person is speaking. Show empathy and understanding. Good listeners are valued and trusted.`,
        simplifiedContent: `Active listening means paying full attention when others speak. Ask questions, repeat back what you heard, and don't interrupt.`
      },
      {
        id: 3,
        title: 'Speaking Effectively',
        order: 3,
        content: `Clear speaking involves organized thoughts, appropriate vocabulary, and good pacing. Structure your message with a clear beginning, middle, and end. Use stories and examples to make points memorable. Match your tone to the situation - formal for presentations, casual for team chats. Practice eliminates filler words like 'um' and 'like'. Record yourself to identify areas for improvement.`,
        simplifiedContent: `Speaking well means being clear and organized. Practice out loud, use examples, and keep a steady pace.`
      },
      {
        id: 4,
        title: 'Writing Skills',
        order: 4,
        content: `Professional writing should be clear, concise, and structured. Use simple language - avoid jargon unless your audience knows it. Organize with headings, bullet points, and white space. Proofread for grammar and spelling. Different formats require different approaches: emails are brief, reports are detailed. Always consider your audience and purpose.`,
        simplifiedContent: `Good writing is clear and simple. Use short paragraphs, bullet points, and check for mistakes before sending.`
      },
      {
        id: 5,
        title: 'Feedback',
        order: 5,
        content: `Giving feedback is a skill that improves with practice. Be specific, timely, and focus on behavior, not personality. Use the SBI model: Situation, Behavior, Impact. Receive feedback with openness - it's an opportunity for growth. Ask clarifying questions. Thank the person even if you disagree. Good feedback builds trust and drives improvement.`,
        simplifiedContent: `Good feedback is specific and helpful. Focus on what someone did, not who they are. Listen openly without getting defensive.`
      }
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
    fullContent: `Stoicism is an ancient Greek and Roman philosophy that teaches the development of self-control and fortitude as a means of overcoming destructive emotions. It emphasizes accepting what we cannot control and focusing on what we can. This course covers the key Stoic thinkers - Marcus Aurelius, Epictetus, and Seneca - and how to apply their wisdom to modern life. Stoicism remains relevant today for personal development and mental resilience.`,
    simplifiedContent: `Stoicism is an ancient wisdom tradition teaching you to focus on what you can control and accept what you can't.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to Stoicism',
        order: 1,
        content: `Stoicism was founded in Athens around 300 BC by Zeno of Citium. It became one of the most influential philosophies of the ancient world, practiced by emperors and philosophers alike. The core idea is that virtue (living according to reason) is the highest good, and we should focus on what's within our control while accepting what isn't. Stoicism teaches practical wisdom for everyday life, not abstract theory.`,
        simplifiedContent: `Stoicism started in ancient Greece. It teaches that virtue (doing the right thing) is the highest good.`
      },
      {
        id: 2,
        title: 'Marcus Aurelius',
        order: 2,
        content: `Marcus Aurelius was Roman Emperor from 161 to 180 AD and the last of the Five Good Emperors. His private journal, later published as 'Meditations', is one of the most influential works in Stoic philosophy. Marcus wrote to himself, exploring themes of duty, mortality, and self-improvement. His writings emphasize the importance of discipline, humility, and serving the common good.`,
        simplifiedContent: `Marcus Aurelius was a Roman emperor who wrote 'Meditations' - a book of private thoughts about staying strong and good.`
      },
      {
        id: 3,
        title: 'Epictetus',
        order: 3,
        content: `Epictetus was born a slave and later became a prominent Stoic philosopher. He taught that our happiness depends not on external events but on our judgments about them. His famous statement 'It's not what happens to you, but how you react to it that matters' captures this insight. His teachings were compiled by his student Arrian in the 'Enchiridion' and 'Discourses'.`,
        simplifiedContent: `Epictetus was a former slave who taught that your reaction to events matters more than the events themselves.`
      },
      {
        id: 4,
        title: 'Seneca',
        order: 4,
        content: `Seneca was a Roman Stoic philosopher, statesman, and dramatist. He wrote extensively on topics including anger, mercy, friendship, and the shortness of life. Unlike other Stoics, Seneca was wealthy and active in politics, showing that Stoicism could be practiced in worldly circumstances. His letters to Lucilius provide practical wisdom for daily life.`,
        simplifiedContent: `Seneca was a wealthy Roman writer who shared Stoic wisdom through letters on topics like anger and using time well.`
      },
      {
        id: 5,
        title: 'Applying Stoicism Today',
        order: 5,
        content: `Modern Stoicism combines ancient wisdom with contemporary psychology. Key practices include negative visualization (imagining loss), the view from above (perspective), and distinguishing control. Stoic exercises help build resilience and reduce anxiety. Many modern thinkers and entrepreneurs cite Stoicism as key to their success. The philosophy offers practical tools for navigating modern challenges.`,
        simplifiedContent: `People today use Stoic ideas to handle stress and make better decisions. The ancient advice still works in modern life.`
      }
    ]
  },
  {
    id: 'existentialism',
    field: 'philosophy',
    title: 'Existentialism',
    description: 'Understand the philosophy of individual existence and freedom',
    youtubeId: 'v0rfTJBGKy0',
    thumbnail: 'https://img.youtube.com/vi/v0rfTJBGKy0/maxresdefault.jpg',
    fullContent: `Existentialism is a philosophy that emphasizes individual existence, freedom, and choice. It emerged in the 19th and 20th centuries through thinkers like Kierkegaard, Nietzsche, Sartre, and Camus. This course explores questions of meaning, authenticity, and responsibility. Existentialism challenges us to confront the absurd and create our own meaning in an indifferent universe.`,
    simplifiedContent: `Existentialism is about finding your own meaning in life. It says you must make your own choices and take responsibility.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to Existentialism',
        order: 1,
        content: `Existentialism focuses on human existence, freedom, and the search for meaning. It emerged from the works of Søren Kierkegaard and Friedrich Nietzsche in the 19th century, developed by Jean-Paul Sartre, Albert Camus, and others in the 20th. Existentialists reject objective meaning and instead emphasize that we must create our own purpose through authentic choices. Key themes include anxiety, freedom, and responsibility.`,
        simplifiedContent: `Existentialism says there's no built-in meaning in life - you have to create your own purpose through your choices.`
      },
      {
        id: 2,
        title: 'Kierkegaard and Nietzsche',
        order: 2,
        content: `Kierkegaard, often called the father of existentialism, focused on individual choice and faith. He argued that objective truth doesn't exist and that we must make subjective leaps of faith. Nietzsche famously declared 'God is dead' and urged the creation of new values through the 'Übermensch'. Both thinkers emphasized individual responsibility and the rejection of conventional morality.`,
        simplifiedContent: `Kierkegaard focused on personal faith and choice. Nietzsche said we must create our own values instead of following old ones.`
      },
      {
        id: 3,
        title: 'Jean-Paul Sartre',
        order: 3,
        content: `Sartre developed the most systematic form of existentialism. His famous statement 'existence precedes essence' means we're born first and must define ourselves through choices. He introduced concepts like 'bad faith' (denying our freedom) and 'radical freedom'. For Sartre, we're 'condemned to be free' and fully responsible for our actions.`,
        simplifiedContent: `Sartre said we exist first, then choose who we become. We're completely free and responsible for our choices.`
      },
      {
        id: 4,
        title: 'Albert Camus',
        order: 4,
        content: `Camus explored the absurd - the conflict between our desire for meaning and the universe's silence. He refused to commit suicide or turn to religion, instead living with the absurd. His novel 'The Stranger' and essay 'The Myth of Sisyphus' illustrate this philosophy. Camus proposed rebellion against meaninglessness through creating value and solidarity with others.`,
        simplifiedContent: `Camus asked: if life has no meaning, how should we live? His answer: embrace the challenge and create your own meaning.`
      },
      {
        id: 5,
        title: 'Living Existentially',
        order: 5,
        content: `Existentialist ideas remain relevant for modern life. Living authentically means making choices aligned with your values, not society's expectations. Embracing freedom and responsibility can be anxiety-inducing but also liberating. Practical applications include questioning assumptions, owning your choices, and accepting mortality. The philosophy encourages living fully and authentically despite uncertainty.`,
        simplifiedContent: `Living existentially means being true to yourself, making your own choices, and accepting that you're responsible for your life.`
      }
    ]
  },
  {
    id: 'ethics',
    field: 'philosophy',
    title: 'Ethics',
    description: 'Explore the fundamental questions of right and wrong',
    youtubeId: 'p9f-YO7pG6w',
    thumbnail: 'https://img.youtube.com/vi/p9f-YO7pG6w/maxresdefault.jpg',
    fullContent: `Ethics is the branch of philosophy concerned with right and wrong conduct. This course examines major ethical theories: utilitarianism, deontology, and virtue ethics. You'll explore questions like What makes an action right? How should we treat others? What is the good life? Understanding ethics helps navigate complex moral decisions in personal and professional life.`,
    simplifiedContent: `Ethics is about what's right and wrong. This course looks at different ways philosophers have thought about moral questions.`,
    milestones: [
      {
        id: 1,
        title: 'Introduction to Ethics',
        order: 1,
        content: `Ethics (or moral philosophy) asks fundamental questions about right and wrong, good and bad. It examines how we should live and what we owe to each other. Ethics helps us reason through difficult decisions when moral intuitions conflict. Major branches include metaethics (what is morality?), normative ethics (what should we do?), and applied ethics (specific issues like bioethics).`,
        simplifiedContent: `Ethics is the study of right and wrong. It helps us think clearly about moral questions instead of just following feelings.`
      },
      {
        id: 2,
        title: 'Utilitarianism',
        order: 2,
        content: `Utilitarianism, developed by Jeremy Bentham and John Stuart Mill, states that actions are right if they promote happiness and wrong if they produce the opposite. The greatest happiness principle guides decisions: choose the option that maximizes overall well-being. Critics argue it can justify unethical actions if they produce greater overall good. Modern versions consider animal welfare and long-term consequences.`,
        simplifiedContent: `Utilitarianism says the right action is whatever creates the most happiness for the most people.`
      },
      {
        id: 3,
        title: 'Deontology',
        order: 3,
        content: `Deontology focuses on duties and rules, regardless of consequences. Immanuel Kant's categorical imperative states we should act only on principles we could will to be universal laws. This creates absolute duties like never lying or treating people merely as means. Deontology provides clear rules but can produce counter-intuitive results in extreme situations.`,
        simplifiedContent: `Deontology says some things are wrong no matter what. Kant's rule: only do what you could want everyone to do.`
      },
      {
        id: 4,
        title: 'Virtue Ethics',
        order: 4,
        content: `Virtue ethics, rooted in Aristotle, focuses on character rather than actions. A virtuous person has traits like courage, honesty, and compassion. The goal is eudaimonia - human flourishing or living well. Virtue is a habit developed through practice, like learning to play an instrument. This approach emphasizes moral development and the whole person, not just individual decisions.`,
        simplifiedContent: `Virtue ethics asks: what kind of person should I be? It focuses on building good character traits through practice.`
      },
      {
        id: 5,
        title: 'Modern Applications',
        order: 5,
        content: `Contemporary ethical issues include AI ethics, bioethics, environmental ethics, and business ethics. Each applies traditional frameworks to new challenges. For example, AI raises questions about bias, privacy, and automation's impact on employment. Understanding ethical frameworks helps navigate these complex issues with nuance and reasoning rather than just reactions.`,
        simplifiedContent: `Today's ethical questions involve AI, medicine, and the environment. Old frameworks still help think through new problems.`
      }
    ]
  }
];