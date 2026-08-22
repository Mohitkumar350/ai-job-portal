import googleLogo from "../assets/icons/google.png";
import openaiLogo from "../assets/icons/openai.png";
import microsoftLogo from "../assets/icons/microsoft.png";
import amazonLogo from "../assets/icons/amazon.png";
import adobeLogo from "../assets/icons/adobe.png";
import infosysLogo from "../assets/icons/infosys.png";

const jobs = [
  {
    id: 1,
    title: "AI Research Scientist",
    company: "Google",
    logo: googleLogo,
    location: "Mountain View, CA",
    salary: "$180,000 - $240,000",
    experience: "3+ years",
    type: "Full-time",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Transformer Models"],
    posted: "1 day ago",
    featured: true,
    description: "Join Google Brain to research and develop next-generation transformer models and multimodal AI systems. You will work on cutting-edge deep learning techniques that power services used by billions of people around the world.",
    requirements: [
      "PhD in Computer Science, Machine Learning, or related field.",
      "Track record of publications in top-tier AI venues (NeurIPS, ICML, CVPR, etc.).",
      "Proficiency in PyTorch or TensorFlow.",
      "Experience with large-scale distributed system training."
    ],
    responsibilities: [
      "Conduct research in deep learning, natural language processing, and multimodal systems.",
      "Collaborate with engineering teams to scale models and deploy to production.",
      "Write research papers and open-source models for the scientific community."
    ]
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    company: "OpenAI",
    logo: openaiLogo,
    location: "San Francisco, CA (Remote)",
    salary: "$200,000 - $260,000",
    experience: "2+ years",
    type: "Remote",
    skills: ["Python", "PyTorch", "LLMs", "RLHF", "Kubernetes"],
    posted: "2 days ago",
    featured: true,
    description: "We are seeking a Machine Learning Engineer to help scale and align our large language models. In this role, you will design training pipelines, implement reinforcement learning from human feedback (RLHF), and optimize model inference speeds.",
    requirements: [
      "MS or BS in Computer Science with a focus on Machine Learning/AI.",
      "Strong coding skills in Python and deep learning frameworks (primarily PyTorch).",
      "Hands-on experience training models with billions of parameters.",
      "Familiarity with CUDA, triton, and high-performance computing clusters."
    ],
    responsibilities: [
      "Train, fine-tune, and optimize large-scale language and multimodal models.",
      "Develop infrastructure for RLHF and model alignment research.",
      "Contribute to the safety and reliability efforts of next-gen AI tools."
    ]
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Microsoft",
    logo: microsoftLogo,
    location: "Redmond, WA",
    salary: "$140,000 - $180,000",
    experience: "5+ years",
    type: "Full-time",
    skills: ["React", "TypeScript", "Node.js", "Azure", "GraphQL"],
    posted: "3 days ago",
    featured: false,
    description: "Microsoft's Azure AI team is looking for a senior full-stack developer to build the next-generation developer console for AI services. You will design highly responsive web interfaces and build robust backend microservices to integrate various cognitive APIs.",
    requirements: [
      "5+ years of software development experience.",
      "Expertise in modern web technologies including React, TypeScript, and Node.js.",
      "Strong backend experience with REST, GraphQL, and cloud-native services.",
      "Experience with Microsoft Azure or other major cloud providers (AWS, GCP)."
    ],
    responsibilities: [
      "Build modular, accessible, and performant user interface components in React.",
      "Design scalable API architectures and serverless backend pipelines.",
      "Integrate complex AI services (e.g., Azure OpenAI Service) into user-facing platforms."
    ]
  },
  {
    id: 4,
    title: "Software Engineer - AI Integration",
    company: "Amazon",
    logo: amazonLogo,
    location: "Seattle, WA (Hybrid)",
    salary: "$130,000 - $170,000",
    experience: "1+ years",
    type: "Hybrid",
    skills: ["Java", "Python", "AWS", "Machine Learning", "DynamoDB"],
    posted: "Just now",
    featured: true,
    description: "Amazon Search is leveraging generative AI to redefine how customers search and shop online. You will join the search discovery team to integrate real-time LLM recommendations into search queries, improving product discovery.",
    requirements: [
      "BS in Computer Science or equivalent software engineering experience.",
      "Strong engineering fundamentals with 1+ years of experience in Java, C++, or Python.",
      "Knowledge of AWS serverless services (Lambda, DynamoDB, SageMaker).",
      "Familiarity with basic machine learning concepts and search technologies."
    ],
    responsibilities: [
      "Write high-quality, production-ready backend code to integrate AI model outputs.",
      "Optimize data pipelines and cache storage for low-latency searches.",
      "Work closely with product managers and ML scientists to iterate on search heuristics."
    ]
  },
  {
    id: 5,
    title: "Senior UI/UX Designer (AI Products)",
    company: "Adobe",
    logo: adobeLogo,
    location: "San Jose, CA",
    salary: "$150,000 - $190,000",
    experience: "5+ years",
    type: "Full-time",
    skills: ["Figma", "Adobe XD", "Prototyping", "UI/UX", "Design Systems"],
    posted: "4 days ago",
    featured: false,
    description: "Adobe is redefining creative applications with Firefly. We are seeking a senior designer to lead user experience design for new AI-powered generative design tools. You will create intuitive interfaces that make complex AI editing tools accessible to millions of creators.",
    requirements: [
      "5+ years of experience as a UI/UX or Product Designer.",
      "Stunning design portfolio showcasing end-to-end product design processes.",
      "Expert skills in Figma, prototyping, and maintaining global design systems.",
      "Experience designing complex data-heavy or tool-heavy applications."
    ],
    responsibilities: [
      "Define visual languages and interactive flows for generative AI tools.",
      "Conduct user research, design wireframes, prototypes, and high-fidelity mockups.",
      "Collaborate with frontend engineers to ensure design implementation matches specifications."
    ]
  },
  {
    id: 6,
    title: "Data Analyst",
    company: "Infosys",
    logo: infosysLogo,
    location: "Bangalore, India",
    salary: "$45,000 - $65,000",
    experience: "Entry Level",
    type: "Full-time",
    skills: ["SQL", "Python", "Power BI", "Excel", "Pandas"],
    posted: "5 days ago",
    featured: false,
    description: "Infosys is hiring a Data Analyst to join our enterprise insights division. In this position, you will analyze business metrics, build interactive dashboards, and help clients make data-driven decisions using python libraries and SQL databases.",
    requirements: [
      "Bachelor's degree in Statistics, Mathematics, Computer Science, or Business Analytics.",
      "Proficiency writing complex SQL queries and scripting with Python (Pandas/NumPy).",
      "Experience creating data dashboards in Power BI or Tableau.",
      "Strong communication and reporting skills."
    ],
    responsibilities: [
      "Query large datasets to extract actionable business insights and trends.",
      "Design, build, and maintain automated dashboards and reports.",
      "Present data findings to stakeholders and suggest process optimizations."
    ]
  }
];

export default jobs;
