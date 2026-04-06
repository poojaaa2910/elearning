import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

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

const courseData = {
  "id": "coding-html-css-101",
  "field": "coding",
  "title": "HTML & CSS: Architecting the Visual Web",
  "description": "Master the structural foundation and stylistic power of the web. Learn to build responsive, accessible, and beautiful websites from scratch using modern HTML5 and CSS3 techniques.",
  "youtubeId": "qz0aGYrrlhU",
  "thumbnail": "https://img.youtube.com/vi/qz0aGYrrlhU/maxresdefault.jpg",
  "fullContent": "Every website you visit is built on the twin pillars of HTML and CSS. This course provides an exhaustive deep-dive into the declarative languages of the web. We begin with HTML5, the semantic backbone that tells browsers and search engines exactly what your content means. You will learn why using a <main> tag is superior to a generic <div> and how ARIA labels ensure your site is usable by everyone, including those with visual impairments. Once the structure is solid, we transition to CSS3—the design engine. We move past basic colors and fonts into the complex world of the Box Model, Flexbox, and CSS Grid. You will learn how to create fluid layouts that adapt perfectly to smartphones, tablets, and ultra-wide monitors. We emphasize 'CSS Architecture' using methodologies like BEM (Block Element Modifier) to ensure your stylesheets remain organized as your projects grow. By the end of this course, you won't just be making pages; you'll be engineering visual experiences that are fast, accessible, and aesthetically stunning.",
  "simplifiedContent": "If a website were a house, HTML would be the wooden frame and the walls, while CSS would be the paint, the wallpaper, and the furniture. This course teaches you how to build that house. First, we learn how to put text, images, and links on a page using HTML. Then, we use CSS to change the colors, move things around, and make the whole site look professional on both phones and computers. It is the perfect starting point for anyone who wants to see their creative ideas come to life on the internet.",
  "notes": "## Comprehensive Notes: HTML & CSS Mastery\n\n### 1. Semantic HTML5\nSemantics refers to the meaning of the code. Semantic tags provide context to the browser and search engines about the importance and type of content.\n\n### 2. The CSS Box Model\nEvery element in CSS is a rectangular box. The total width/height of an element is calculated based on several layers:\n* **Content**: The actual text or image.\n* **Padding**: Transparent area around the content (inside the border).\n* **Border**: A line surrounding the padding and content.\n* **Margin**: Space outside the border, separating the element from others.\n\n### 3. Layout Comparison Table\n| Feature | Flexbox | CSS Grid |\n| :--- | :--- | :--- |\n| **Dimension** | One-Dimensional (Row or Column) | Two-Dimensional (Rows and Columns) |\n| **Primary Use** | Aligning items in a navbar or list | Creating complex, whole-page layouts |\n| **Flexibility** | Content-driven (items grow/shrink) | Layout-driven (strict defined tracks) |\n| **Alignment** | Easy vertical/horizontal centering | Precise placement in specific cells |\n\n### 4. Responsive Design Units\nTo make sites responsive, we use relative units rather than fixed pixels ($px$). \nIf the root font size is $16px$, then:\n$$1rem = 16px$$\n$$2rem = 32px$$\nUsing $rem$ and $em$ allows the layout to scale according to the user's browser settings, improving accessibility.\n\n### 5. Best Practices\n* **Mobile First**: Design for small screens first, then use Media Queries for larger ones.\n* **Alt Text**: Always include `alt` attributes for images for accessibility and SEO.\n* **Don't Repeat Yourself (DRY)**: Use CSS variables (Custom Properties) to store colors and spacing values.",
  "milestones": [
    {
      "id": 1,
      "title": "HTML5: The Semantic Blueprint",
      "order": 1,
      "content": "In this milestone, we strip the web back to its core: the document structure. You will learn the history of the web and why the move from HTML4 to HTML5 was revolutionary for data meaning. We begin by mastering the Document Type Definition and the crucial metadata located within the `<head>` tag. You will understand how `<meta>` tags influence SEO and social media previews. \n\nWe then dive into the body of the document, focusing heavily on Semantic Tags. You will learn the specific use cases for `<article>`, `<section>`, `<aside>`, and `<nav>`. We spend significant time discussing the 'Outline Algorithm' and how proper heading levels (`<h1>` through `<h6>`) create a logical hierarchy for screen readers. \n\nAccessibility (a11y) is integrated into every lesson. You will learn about the Document Object Model (DOM) from a structural perspective and how to write clean, valid code that passes W3C validation. We also cover the nuances of 'Inline' vs. 'Block-level' elements, explaining why placing a `<div>` inside a `<span>` is a fundamental syntax error. \n\nFurthermore, we explore the power of HTML5 forms. You will learn how to use advanced input types like `date`, `email`, and `range`, and how to implement client-side validation using only HTML attributes like `required` and `pattern`. By the end of this milestone, you will be able to take a visual design and translate it into a perfectly structured, accessible HTML document. \n\nThis 20-line foundation ensures that your websites are readable by both humans and machines, providing the 'skeleton' upon which we will later apply the 'skin' of CSS. You will also complete a mini-project: creating a multi-page personal portfolio structure using only semantic HTML elements.",
      "simplifiedContent": "We start by learning how to organize a web page's content. Think of it like writing a newspaper: you need a main headline, sections for different stories, and captions for photos. We learn the special tags that tell the computer exactly what each part of your page is."
    },
    {
      "id": 2,
      "title": "CSS Foundations and the Box Model",
      "order": 2,
      "content": "Milestone 2 is where the visual magic begins. We start with the three ways to apply CSS: Inline, Internal, and External, emphasizing why External Stylesheets are the professional standard. You will master the 'Cascade' in Cascading Style Sheets, learning how the browser decides which styles to apply when multiple rules conflict. \n\nWe deep-dive into Selectors—from basic element selectors to complex pseudo-classes like `:nth-child()` and `:hover`. You will learn about 'Specificity,' the scoring system browsers use to resolve styling conflicts, and why you should almost never use `!important`. \n\nThe core of this milestone is the CSS Box Model. We will visually deconstruct every element into content, padding, border, and margin. You will learn how to use `box-sizing: border-box;` to make layout calculations much easier and prevent elements from 'breaking' their containers. \n\nWe also explore Typography and Color. You'll learn the difference between Serif and Sans-serif fonts, how to import Google Fonts, and the various ways to define color (Hex, RGB, HSL). We discuss the importance of 'Contrast Ratios' to ensure your text is readable by people with color blindness. \n\nBy the end of these 20 lines, you will understand how to position elements using 'Floats' (historically) and 'Position: Absolute/Relative' (modern). You will have the skills to take a boring text page and transform it into a vibrant, styled document with custom backgrounds, rounded corners, and professional spacing. This milestone concludes with a challenge to replicate a high-fidelity button and card design using only CSS.",
      "simplifiedContent": "Now we make things look good! We learn how to change colors, fonts, and spacing. We'll look at the 'Box Model,' which is basically learning how every part of a website lives inside its own invisible box that we can resize and move around."
    },
    {
      "id": 3,
      "title": "Modern Layouts: Flexbox, Grid, and Responsiveness",
      "order": 3,
      "content": "In this final milestone, we tackle the most advanced and powerful aspects of modern CSS. We start with Flexbox, the one-dimensional layout system. You will learn how to align items perfectly in the center of a container—a task that used to be incredibly difficult—using just two lines of code: `display: flex;` and `place-items: center;`. We cover `flex-grow`, `flex-shrink`, and `flex-basis` to create truly dynamic components. \n\nNext, we master CSS Grid, the two-dimensional layout powerhouse. You will learn how to define explicit rows and columns, creating complex magazine-style layouts that were previously impossible. We explore 'Grid Areas' and the `repeat()` and `minmax()` functions, which allow your layouts to adjust their columns based on the available screen space. \n\nThe highlight of this milestone is Responsive Design. You will learn how to use Media Queries to change your entire layout based on the device width. We practice a 'Mobile-First' approach, building for the smallest screens first and adding complexity as the screen gets wider. \n\nWe also introduce CSS Variables (Custom Properties), allowing you to define a color once and update it across the entire site instantly. Finally, we touch upon CSS Transitions and Transforms to add subtle animations that make your site feel alive and interactive. \n\nBy the end of this milestone, you will have built a fully responsive Landing Page project. This project will include a navigation bar that changes to a mobile menu, a grid-based gallery, and a flex-based footer. You will graduate from this course with a portfolio-ready site that looks great on an iPhone, an iPad, and a MacBook Pro alike. You are now a proficient architect of the visual web.",
      "simplifiedContent": "Finally, we learn the advanced tools used to build modern websites. We'll learn how to make items automatically rearrange themselves so they look great on a tiny phone screen and a giant TV. We'll also add some simple animations to make the site feel smooth and fun to use."
    }
  ],
  "quiz": [
    {
      "id": 1,
      "question": "Which HTML tag is used to specify a footer for a document or section?",
      "options": [
        "<bottom>",
        "<section>",
        "<footer>",
        "<aside>"
      ],
      "correctAnswer": 2
    },
    {
      "id": 2,
      "question": "In the CSS Box Model, which layer is outside the Border?",
      "options": [
        "Padding",
        "Margin",
        "Content",
        "Outline"
      ],
      "correctAnswer": 1
    },
    {
      "id": 3,
      "question": "Which CSS property is used to create a Flexbox container?",
      "options": [
        "display: block;",
        "display: flex;",
        "float: left;",
        "position: relative;"
      ],
      "correctAnswer": 1
    }
  ],
  "createdAt": "2026-04-06T00:00:00.000Z",
  "updatedAt": "2026-04-06T00:00:00.000Z"
};

async function uploadCourse() {
  try {
    // Add the new course (don't delete existing ones)
    await setDoc(doc(db, 'courses', courseData.id), courseData);
    console.log('Course uploaded successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

uploadCourse();