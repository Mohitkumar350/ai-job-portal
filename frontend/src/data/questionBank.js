// ============================================================
// AI MOCK INTERVIEW - LOCAL QUESTION BANK
// ============================================================

const questionBank = [
  // ============================================================
  // HTML - BEGINNER
  // ============================================================

  {
    id: "html-b-1",
    skill: "HTML",
    difficulty: "Beginner",
    question: "What is HTML and what is it used for?",
  },
  {
    id: "html-b-2",
    skill: "HTML",
    difficulty: "Beginner",
    question: "What is the difference between an element and a tag in HTML?",
  },
  {
    id: "html-b-3",
    skill: "HTML",
    difficulty: "Beginner",
    question: "What is the difference between block-level and inline elements?",
  },
  {
    id: "html-b-4",
    skill: "HTML",
    difficulty: "Beginner",
    question: "What are semantic HTML elements? Give examples.",
  },
  {
    id: "html-b-5",
    skill: "HTML",
    difficulty: "Beginner",
    question: "What is the purpose of the form element in HTML?",
  },
  {
    id: "html-b-6",
    skill: "HTML",
    difficulty: "Beginner",
    question: "What is the difference between id and class attributes?",
  },

  // ============================================================
  // HTML - INTERMEDIATE
  // ============================================================

  {
    id: "html-i-1",
    skill: "HTML",
    difficulty: "Intermediate",
    question:
      "What is the difference between localStorage, sessionStorage and cookies?",
  },
  {
    id: "html-i-2",
    skill: "HTML",
    difficulty: "Intermediate",
    question: "What is the purpose of the meta viewport tag?",
  },
  {
    id: "html-i-3",
    skill: "HTML",
    difficulty: "Intermediate",
    question:
      "What is accessibility in HTML and how can semantic elements improve it?",
  },
  {
    id: "html-i-4",
    skill: "HTML",
    difficulty: "Intermediate",
    question:
      "What is the difference between async and defer in script loading?",
  },

  // ============================================================
  // HTML - ADVANCED
  // ============================================================

  {
    id: "html-a-1",
    skill: "HTML",
    difficulty: "Advanced",
    question: "Explain how the browser parses HTML and constructs the DOM.",
  },
  {
    id: "html-a-2",
    skill: "HTML",
    difficulty: "Advanced",
    question: "How would you optimize HTML for SEO and page performance?",
  },

  // ============================================================
  // CSS - BEGINNER
  // ============================================================

  {
    id: "css-b-1",
    skill: "CSS",
    difficulty: "Beginner",
    question: "What is CSS and why is it used?",
  },
  {
    id: "css-b-2",
    skill: "CSS",
    difficulty: "Beginner",
    question:
      "What is the CSS Box Model and what are its four main components?",
  },
  {
    id: "css-b-3",
    skill: "CSS",
    difficulty: "Beginner",
    question: "What is the difference between margin and padding?",
  },
  {
    id: "css-b-4",
    skill: "CSS",
    difficulty: "Beginner",
    question: "What is the difference between class selector and id selector?",
  },
  {
    id: "css-b-5",
    skill: "CSS",
    difficulty: "Beginner",
    question: "What is Flexbox?",
  },
  {
    id: "css-b-6",
    skill: "CSS",
    difficulty: "Beginner",
    question: "What is CSS Grid?",
  },

  // ============================================================
  // CSS - INTERMEDIATE
  // ============================================================

  {
    id: "css-i-1",
    skill: "CSS",
    difficulty: "Intermediate",
    question: "Explain position: relative, absolute, fixed and sticky.",
  },
  {
    id: "css-i-2",
    skill: "CSS",
    difficulty: "Intermediate",
    question: "What is CSS specificity and how is it calculated?",
  },
  {
    id: "css-i-3",
    skill: "CSS",
    difficulty: "Intermediate",
    question: "What is the difference between pseudo-class and pseudo-element?",
  },
  {
    id: "css-i-4",
    skill: "CSS",
    difficulty: "Intermediate",
    question: "How would you make a website responsive?",
  },
  {
    id: "css-i-5",
    skill: "CSS",
    difficulty: "Intermediate",
    question:
      "Explain the difference between display:none, visibility:hidden and opacity:0.",
  },

  // ============================================================
  // CSS - ADVANCED
  // ============================================================

  {
    id: "css-a-1",
    skill: "CSS",
    difficulty: "Advanced",
    question:
      "Explain how CSS specificity, inheritance and the cascade work together.",
  },
  {
    id: "css-a-2",
    skill: "CSS",
    difficulty: "Advanced",
    question:
      "How would you optimize CSS performance in a large production application?",
  },

  // ============================================================
  // JAVASCRIPT - BEGINNER
  // ============================================================

  {
    id: "js-b-1",
    skill: "JavaScript",
    difficulty: "Beginner",
    question: "What is JavaScript and where is it commonly used?",
  },
  {
    id: "js-b-2",
    skill: "JavaScript",
    difficulty: "Beginner",
    question: "What is the difference between var, let and const?",
  },
  {
    id: "js-b-3",
    skill: "JavaScript",
    difficulty: "Beginner",
    question: "What are primitive data types in JavaScript?",
  },
  {
    id: "js-b-4",
    skill: "JavaScript",
    difficulty: "Beginner",
    question: "What is the difference between == and ===?",
  },
  {
    id: "js-b-5",
    skill: "JavaScript",
    difficulty: "Beginner",
    question: "What is a function in JavaScript?",
  },
  {
    id: "js-b-6",
    skill: "JavaScript",
    difficulty: "Beginner",
    question: "What is an array in JavaScript?",
  },
  {
    id: "js-b-7",
    skill: "JavaScript",
    difficulty: "Beginner",
    question: "What is an object in JavaScript?",
  },

  // ============================================================
  // JAVASCRIPT - INTERMEDIATE
  // ============================================================

  {
    id: "js-i-1",
    skill: "JavaScript",
    difficulty: "Intermediate",
    question: "What is hoisting in JavaScript?",
  },
  {
    id: "js-i-2",
    skill: "JavaScript",
    difficulty: "Intermediate",
    question: "What is a closure in JavaScript? Give a practical example.",
  },
  {
    id: "js-i-3",
    skill: "JavaScript",
    difficulty: "Intermediate",
    question: "Explain the JavaScript event loop.",
  },
  {
    id: "js-i-4",
    skill: "JavaScript",
    difficulty: "Intermediate",
    question: "What are promises in JavaScript?",
  },
  {
    id: "js-i-5",
    skill: "JavaScript",
    difficulty: "Intermediate",
    question: "What is async/await and how does it work?",
  },
  {
    id: "js-i-6",
    skill: "JavaScript",
    difficulty: "Intermediate",
    question: "What is the difference between map, filter and reduce?",
  },
  {
    id: "js-i-7",
    skill: "JavaScript",
    difficulty: "Intermediate",
    question: "What is destructuring in JavaScript?",
  },
  {
    id: "js-i-8",
    skill: "JavaScript",
    difficulty: "Intermediate",
    question: "What is the spread operator?",
  },

  // ============================================================
  // JAVASCRIPT - ADVANCED
  // ============================================================

  {
    id: "js-a-1",
    skill: "JavaScript",
    difficulty: "Advanced",
    question: "Explain the JavaScript execution context and call stack.",
  },
  {
    id: "js-a-2",
    skill: "JavaScript",
    difficulty: "Advanced",
    question: "Explain microtasks and macrotasks in the JavaScript event loop.",
  },
  {
    id: "js-a-3",
    skill: "JavaScript",
    difficulty: "Advanced",
    question: "How does JavaScript garbage collection work at a high level?",
  },
  {
    id: "js-a-4",
    skill: "JavaScript",
    difficulty: "Advanced",
    question: "What are debouncing and throttling and when would you use them?",
  },

  // ============================================================
  // REACT - BEGINNER
  // ============================================================

  {
    id: "react-b-1",
    skill: "React",
    difficulty: "Beginner",
    question: "What is React and why is it used?",
  },
  {
    id: "react-b-2",
    skill: "React",
    difficulty: "Beginner",
    question: "What is a React component?",
  },
  {
    id: "react-b-3",
    skill: "React",
    difficulty: "Beginner",
    question: "What are props in React?",
  },
  {
    id: "react-b-4",
    skill: "React",
    difficulty: "Beginner",
    question: "What is state in React?",
  },
  {
    id: "react-b-5",
    skill: "React",
    difficulty: "Beginner",
    question: "What is JSX?",
  },
  {
    id: "react-b-6",
    skill: "React",
    difficulty: "Beginner",
    question: "Why do React lists need a key?",
  },

  // ============================================================
  // REACT - INTERMEDIATE
  // ============================================================

  {
    id: "react-i-1",
    skill: "React",
    difficulty: "Intermediate",
    question: "Explain the useState hook.",
  },
  {
    id: "react-i-2",
    skill: "React",
    difficulty: "Intermediate",
    question: "Explain the useEffect hook and its dependency array.",
  },
  {
    id: "react-i-3",
    skill: "React",
    difficulty: "Intermediate",
    question: "What is conditional rendering in React?",
  },
  {
    id: "react-i-4",
    skill: "React",
    difficulty: "Intermediate",
    question: "What is React Context API?",
  },
  {
    id: "react-i-5",
    skill: "React",
    difficulty: "Intermediate",
    question: "What is prop drilling and how can you avoid it?",
  },
  {
    id: "react-i-6",
    skill: "React",
    difficulty: "Intermediate",
    question: "How does React Router work?",
  },

  // ============================================================
  // REACT - ADVANCED
  // ============================================================

  {
    id: "react-a-1",
    skill: "React",
    difficulty: "Advanced",
    question: "Explain React reconciliation and the virtual DOM.",
  },
  {
    id: "react-a-2",
    skill: "React",
    difficulty: "Advanced",
    question: "How would you optimize a slow React application?",
  },
  {
    id: "react-a-3",
    skill: "React",
    difficulty: "Advanced",
    question:
      "Explain React.memo, useMemo and useCallback and when they should be used.",
  },

  // ============================================================
  // NODE.JS
  // ============================================================

  {
    id: "node-b-1",
    skill: "Node.js",
    difficulty: "Beginner",
    question: "What is Node.js?",
  },
  {
    id: "node-b-2",
    skill: "Node.js",
    difficulty: "Beginner",
    question: "Why is Node.js useful for backend development?",
  },
  {
    id: "node-b-3",
    skill: "Node.js",
    difficulty: "Beginner",
    question: "What is npm?",
  },
  {
    id: "node-i-1",
    skill: "Node.js",
    difficulty: "Intermediate",
    question: "Explain the Node.js event-driven architecture.",
  },
  {
    id: "node-i-2",
    skill: "Node.js",
    difficulty: "Intermediate",
    question: "What is middleware in Node.js applications?",
  },
  {
    id: "node-i-3",
    skill: "Node.js",
    difficulty: "Intermediate",
    question: "How do you handle asynchronous errors in Node.js?",
  },
  {
    id: "node-a-1",
    skill: "Node.js",
    difficulty: "Advanced",
    question: "How would you scale a Node.js application for high traffic?",
  },
  {
    id: "node-a-2",
    skill: "Node.js",
    difficulty: "Advanced",
    question: "Explain streams and buffers in Node.js.",
  },

  // ============================================================
  // EXPRESS
  // ============================================================

  {
    id: "express-b-1",
    skill: "Express.js",
    difficulty: "Beginner",
    question: "What is Express.js?",
  },
  {
    id: "express-b-2",
    skill: "Express.js",
    difficulty: "Beginner",
    question: "How do you create a basic Express server?",
  },
  {
    id: "express-i-1",
    skill: "Express.js",
    difficulty: "Intermediate",
    question: "What is Express middleware?",
  },
  {
    id: "express-i-2",
    skill: "Express.js",
    difficulty: "Intermediate",
    question: "How do you create routes in Express?",
  },
  {
    id: "express-i-3",
    skill: "Express.js",
    difficulty: "Intermediate",
    question: "How would you implement centralized error handling in Express?",
  },
  {
    id: "express-a-1",
    skill: "Express.js",
    difficulty: "Advanced",
    question: "How would you secure a production Express API?",
  },

  // ============================================================
  // MONGODB
  // ============================================================

  {
    id: "mongo-b-1",
    skill: "MongoDB",
    difficulty: "Beginner",
    question: "What is MongoDB?",
  },
  {
    id: "mongo-b-2",
    skill: "MongoDB",
    difficulty: "Beginner",
    question: "What is a document in MongoDB?",
  },
  {
    id: "mongo-b-3",
    skill: "MongoDB",
    difficulty: "Beginner",
    question: "What is a collection in MongoDB?",
  },
  {
    id: "mongo-i-1",
    skill: "MongoDB",
    difficulty: "Intermediate",
    question: "What is an index in MongoDB and why is it useful?",
  },
  {
    id: "mongo-i-2",
    skill: "MongoDB",
    difficulty: "Intermediate",
    question: "What is the MongoDB aggregation pipeline?",
  },
  {
    id: "mongo-i-3",
    skill: "MongoDB",
    difficulty: "Intermediate",
    question:
      "What is the difference between embedding and referencing documents?",
  },
  {
    id: "mongo-a-1",
    skill: "MongoDB",
    difficulty: "Advanced",
    question: "How would you optimize a slow MongoDB query?",
  },
  {
    id: "mongo-a-2",
    skill: "MongoDB",
    difficulty: "Advanced",
    question: "Explain MongoDB transactions and when you would use them.",
  },

  // ============================================================
  // JAVA
  // ============================================================

  {
    id: "java-b-1",
    skill: "Java",
    difficulty: "Beginner",
    question: "What is Java and what are its main features?",
  },
  {
    id: "java-b-2",
    skill: "Java",
    difficulty: "Beginner",
    question: "What is the difference between JDK, JRE and JVM?",
  },
  {
    id: "java-b-3",
    skill: "Java",
    difficulty: "Beginner",
    question: "What are classes and objects in Java?",
  },
  {
    id: "java-b-4",
    skill: "Java",
    difficulty: "Beginner",
    question: "What is inheritance in Java?",
  },
  {
    id: "java-i-1",
    skill: "Java",
    difficulty: "Intermediate",
    question: "Explain method overloading and method overriding in Java.",
  },
  {
    id: "java-i-2",
    skill: "Java",
    difficulty: "Intermediate",
    question: "What are interfaces in Java?",
  },
  {
    id: "java-i-3",
    skill: "Java",
    difficulty: "Intermediate",
    question: "What is exception handling in Java?",
  },
  {
    id: "java-i-4",
    skill: "Java",
    difficulty: "Intermediate",
    question: "What is the difference between ArrayList and LinkedList?",
  },
  {
    id: "java-a-1",
    skill: "Java",
    difficulty: "Advanced",
    question: "Explain Java garbage collection at a high level.",
  },
  {
    id: "java-a-2",
    skill: "Java",
    difficulty: "Advanced",
    question:
      "What is multithreading in Java and what problems can occur with concurrent code?",
  },

  // ============================================================
  // PYTHON
  // ============================================================

  {
    id: "python-b-1",
    skill: "Python",
    difficulty: "Beginner",
    question: "What is Python and why is it popular?",
  },
  {
    id: "python-b-2",
    skill: "Python",
    difficulty: "Beginner",
    question: "What are lists, tuples and dictionaries in Python?",
  },
  {
    id: "python-b-3",
    skill: "Python",
    difficulty: "Beginner",
    question: "What is indentation used for in Python?",
  },
  {
    id: "python-i-1",
    skill: "Python",
    difficulty: "Intermediate",
    question: "What are list comprehensions in Python?",
  },
  {
    id: "python-i-2",
    skill: "Python",
    difficulty: "Intermediate",
    question: "What are decorators in Python?",
  },
  {
    id: "python-i-3",
    skill: "Python",
    difficulty: "Intermediate",
    question: "What is exception handling in Python?",
  },
  {
    id: "python-a-1",
    skill: "Python",
    difficulty: "Advanced",
    question: "Explain generators and iterators in Python.",
  },
  {
    id: "python-a-2",
    skill: "Python",
    difficulty: "Advanced",
    question: "How does Python memory management work at a high level?",
  },

  // ============================================================
  // DSA
  // ============================================================

  {
    id: "dsa-b-1",
    skill: "DSA",
    difficulty: "Beginner",
    question: "What is a data structure?",
  },
  {
    id: "dsa-b-2",
    skill: "DSA",
    difficulty: "Beginner",
    question: "What is the difference between an array and a linked list?",
  },
  {
    id: "dsa-b-3",
    skill: "DSA",
    difficulty: "Beginner",
    question: "What is a stack and where is it used?",
  },
  {
    id: "dsa-b-4",
    skill: "DSA",
    difficulty: "Beginner",
    question: "What is a queue?",
  },
  {
    id: "dsa-i-1",
    skill: "DSA",
    difficulty: "Intermediate",
    question: "Explain binary search and its time complexity.",
  },
  {
    id: "dsa-i-2",
    skill: "DSA",
    difficulty: "Intermediate",
    question: "What is the difference between BFS and DFS?",
  },
  {
    id: "dsa-i-3",
    skill: "DSA",
    difficulty: "Intermediate",
    question: "What is a binary search tree?",
  },
  {
    id: "dsa-i-4",
    skill: "DSA",
    difficulty: "Intermediate",
    question: "Explain Big O notation with examples.",
  },
  {
    id: "dsa-a-1",
    skill: "DSA",
    difficulty: "Advanced",
    question: "Explain dynamic programming and how to identify a DP problem.",
  },
  {
    id: "dsa-a-2",
    skill: "DSA",
    difficulty: "Advanced",
    question: "Explain graph traversal and discuss practical applications.",
  },

  // ============================================================
  // DATABASE / DBMS
  // ============================================================

  {
    id: "db-b-1",
    skill: "DBMS",
    difficulty: "Beginner",
    question: "What is a database?",
  },
  {
    id: "db-b-2",
    skill: "DBMS",
    difficulty: "Beginner",
    question: "What is the difference between SQL and NoSQL databases?",
  },
  {
    id: "db-b-3",
    skill: "DBMS",
    difficulty: "Beginner",
    question: "What is a primary key?",
  },
  {
    id: "db-i-1",
    skill: "DBMS",
    difficulty: "Intermediate",
    question: "What is database normalization?",
  },
  {
    id: "db-i-2",
    skill: "DBMS",
    difficulty: "Intermediate",
    question: "Explain SQL JOINs with examples.",
  },
  {
    id: "db-i-3",
    skill: "DBMS",
    difficulty: "Intermediate",
    question: "What is a database index?",
  },
  {
    id: "db-a-1",
    skill: "DBMS",
    difficulty: "Advanced",
    question: "Explain database transactions and ACID properties.",
  },
  {
    id: "db-a-2",
    skill: "DBMS",
    difficulty: "Advanced",
    question: "How would you optimize a slow SQL query?",
  },

  // ============================================================
  // GIT / GITHUB
  // ============================================================

  {
    id: "git-b-1",
    skill: "Git",
    difficulty: "Beginner",
    question: "What is Git?",
  },
  {
    id: "git-b-2",
    skill: "Git",
    difficulty: "Beginner",
    question: "What is GitHub?",
  },
  {
    id: "git-b-3",
    skill: "Git",
    difficulty: "Beginner",
    question:
      "What is the difference between git add, git commit and git push?",
  },
  {
    id: "git-i-1",
    skill: "Git",
    difficulty: "Intermediate",
    question: "What is a Git branch?",
  },
  {
    id: "git-i-2",
    skill: "Git",
    difficulty: "Intermediate",
    question: "What is a merge conflict and how do you resolve it?",
  },
  {
    id: "git-i-3",
    skill: "Git",
    difficulty: "Intermediate",
    question: "What is the difference between git merge and git rebase?",
  },
  {
    id: "git-a-1",
    skill: "Git",
    difficulty: "Advanced",
    question: "How would you recover accidentally deleted Git commits?",
  },

  // ============================================================
  // REST API
  // ============================================================

  {
    id: "api-b-1",
    skill: "REST API",
    difficulty: "Beginner",
    question: "What is an API?",
  },
  {
    id: "api-b-2",
    skill: "REST API",
    difficulty: "Beginner",
    question: "What is a REST API?",
  },
  {
    id: "api-b-3",
    skill: "REST API",
    difficulty: "Beginner",
    question: "What are GET, POST, PUT, PATCH and DELETE methods?",
  },
  {
    id: "api-i-1",
    skill: "REST API",
    difficulty: "Intermediate",
    question:
      "What are HTTP status codes and what do 200, 201, 400, 401, 403, 404 and 500 mean?",
  },
  {
    id: "api-i-2",
    skill: "REST API",
    difficulty: "Intermediate",
    question: "What is JWT authentication?",
  },
  {
    id: "api-i-3",
    skill: "REST API",
    difficulty: "Intermediate",
    question: "What is CORS and why does it occur?",
  },
  {
    id: "api-a-1",
    skill: "REST API",
    difficulty: "Advanced",
    question:
      "How would you secure and scale a REST API used by thousands of users?",
  },

  // ============================================================
  // FULL STACK
  // ============================================================

  {
    id: "full-b-1",
    skill: "Full Stack",
    difficulty: "Beginner",
    question: "What is full-stack development?",
  },
  {
    id: "full-b-2",
    skill: "Full Stack",
    difficulty: "Beginner",
    question:
      "What is the difference between frontend and backend development?",
  },
  {
    id: "full-i-1",
    skill: "Full Stack",
    difficulty: "Intermediate",
    question:
      "Explain how a React frontend communicates with a Node.js backend.",
  },
  {
    id: "full-i-2",
    skill: "Full Stack",
    difficulty: "Intermediate",
    question:
      "How would you implement authentication in a full-stack application?",
  },
  {
    id: "full-i-3",
    skill: "Full Stack",
    difficulty: "Intermediate",
    question:
      "How should environment variables and API keys be handled in a full-stack project?",
  },
  {
    id: "full-a-1",
    skill: "Full Stack",
    difficulty: "Advanced",
    question:
      "Design a scalable architecture for a job portal with React, Node.js and MongoDB.",
  },
  {
    id: "full-a-2",
    skill: "Full Stack",
    difficulty: "Advanced",
    question:
      "How would you improve security, performance and reliability of a production full-stack application?",
  },

  // ============================================================
  // PROJECT / PRACTICAL
  // ============================================================

  {
    id: "project-b-1",
    skill: "Project",
    difficulty: "Beginner",
    question:
      "Explain one project you have built and describe your role in it.",
  },
  {
    id: "project-i-1",
    skill: "Project",
    difficulty: "Intermediate",
    question:
      "What was the most difficult technical problem you faced in your project and how did you solve it?",
  },
  {
    id: "project-i-2",
    skill: "Project",
    difficulty: "Intermediate",
    question:
      "How did you handle authentication and authorization in your project?",
  },
  {
    id: "project-a-1",
    skill: "Project",
    difficulty: "Advanced",
    question:
      "If your project suddenly received 100 times more users, what parts would you redesign first and why?",
  },
];

export default questionBank;
