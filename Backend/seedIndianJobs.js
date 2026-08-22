require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

const indianJobsData = [
  {
    title: 'Senior Full Stack Developer (MERN)',
    company: 'Razorpay',
    location: 'Bengaluru, Karnataka',
    salaryMin: 1800000,
    salaryMax: 2800000,
    experience: '3-5 Years',
    employmentType: 'Full-Time',
    workMode: 'Hybrid',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Express.js', 'Redis', 'AWS'],
    requirements: [
      '3+ years of experience building high-scale MERN applications.',
      'Strong knowledge of asynchronous programming and database indexing.',
      'Experience with REST APIs, microservices, and Docker.'
    ],
    benefits: ['Health Insurance', 'Flexible Hours', 'Learning Allowance', 'Stock Options'],
    description: 'Razorpay is looking for a Senior Full Stack Engineer to lead payments integration architecture and developer dashboards.'
  },
  {
    title: 'Frontend React Developer',
    company: 'Swiggy',
    location: 'Bengaluru, Karnataka',
    salaryMin: 1200000,
    salaryMax: 1800000,
    experience: '2-4 Years',
    employmentType: 'Full-Time',
    workMode: 'On-site',
    skills: ['React', 'Redux Toolkit', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'],
    requirements: [
      'Proficiency in modern React (Hooks, Context, Performance Optimization).',
      'Solid experience with state management and responsive web development.',
      'Familiarity with web vitals, caching, and CI/CD pipelines.'
    ],
    benefits: ['Free Meals', 'Medical Coverage', 'Wellness Programs', 'Annual Bonus'],
    description: 'Join the consumer product team at Swiggy to craft ultra-fast, accessible web and mobile-responsive experiences.'
  },
  {
    title: 'Backend Node.js Engineer',
    company: 'Zomato',
    location: 'Gurgaon, Haryana',
    salaryMin: 1400000,
    salaryMax: 2200000,
    experience: '2-5 Years',
    employmentType: 'Full-Time',
    workMode: 'Hybrid',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Kafka', 'System Design'],
    requirements: [
      'Deep understanding of Node.js event loop, concurrency, and performance tuning.',
      'Hands-on experience with MongoDB aggregation pipelines and relational databases.',
      'Experience handling high throughput API traffic.'
    ],
    benefits: ['Relocation Support', 'Parental Leave', 'Health Benefits', 'Performance Bonus'],
    description: 'Work with the core backend infrastructure team at Zomato supporting live order tracking and merchant inventory systems.'
  },
  {
    title: 'Java Spring Boot Cloud Engineer',
    company: 'Infosys',
    location: 'Pune, Maharashtra',
    salaryMin: 800000,
    salaryMax: 1400000,
    experience: '2-4 Years',
    employmentType: 'Full-Time',
    workMode: 'Hybrid',
    skills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'Docker', 'Kubernetes'],
    requirements: [
      'Strong grasp of Core Java, OOP design patterns, and Spring framework.',
      'Hands-on with containerized deployments and RESTful web services.'
    ],
    benefits: ['Health Insurance', 'PF & Gratuity', 'Skill Enhancement Programs'],
    description: 'Infosys is hiring Java Backend engineers to develop robust enterprise solutions for global banking and retail clients.'
  },
  {
    title: 'Data Analyst / Python Engineer',
    company: 'Flipkart',
    location: 'Bengaluru, Karnataka',
    salaryMin: 1000000,
    salaryMax: 1600000,
    experience: '1-3 Years',
    employmentType: 'Full-Time',
    workMode: 'Hybrid',
    skills: ['Python', 'SQL', 'Pandas', 'PowerBI', 'Data Analysis', 'Tableau'],
    requirements: [
      'Proficiency in Python data stack (NumPy, Pandas) and advanced SQL.',
      'Ability to build automated ETL data pipelines and executive KPI dashboards.'
    ],
    benefits: ['Hybrid Work Allowance', 'Gym Membership', 'Comprehensive Medical Care'],
    description: 'Analyze marketplace seller analytics, pricing trends, and customer purchase behaviors at Flipkart.'
  },
  {
    title: 'Junior React & Node.js Developer (Fresher / 1 Yr)',
    company: 'TechMahindra',
    location: 'Hyderabad, Telangana',
    salaryMin: 450000,
    salaryMax: 700000,
    experience: '0-1 Years',
    employmentType: 'Full-Time',
    workMode: 'On-site',
    skills: ['JavaScript', 'React', 'Node.js', 'HTML5', 'CSS3', 'Git'],
    requirements: [
      'Good foundational knowledge of JavaScript ES6+, React, and REST APIs.',
      'Strong problem-solving skills and willingness to learn in a fast-paced environment.'
    ],
    benefits: ['Training Programs', 'Transportation', 'Group Health Insurance'],
    description: 'Great opportunity for entry-level developers and recent graduates to build real-world full-stack web applications.'
  },
  {
    title: 'AI / Machine Learning Engineer',
    company: 'Jio Platforms',
    location: 'Mumbai, Maharashtra',
    salaryMin: 1600000,
    salaryMax: 2600000,
    experience: '3-6 Years',
    employmentType: 'Full-Time',
    workMode: 'On-site',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'LLM', 'GenAI', 'FastAPI'],
    requirements: [
      'Experience training and fine-tuning Transformer models and NLP algorithms.',
      'Deployment of AI inference APIs in production environments.'
    ],
    benefits: ['Generous Bonus', 'Stock Options', 'Comprehensive Health Plan'],
    description: 'Lead next-generation conversational AI and multilingual NLP models powering millions of users at Jio.'
  },
  {
    title: 'DevOps & Cloud Engineer',
    company: 'Paytm',
    location: 'Noida, Uttar Pradesh',
    salaryMin: 1300000,
    salaryMax: 2000000,
    experience: '2-4 Years',
    employmentType: 'Full-Time',
    workMode: 'Hybrid',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Prometheus'],
    requirements: [
      'Experience managing AWS cloud infrastructure with Terraform and Ansible.',
      'Deep knowledge of Kubernetes clusters, zero-downtime deployments, and security hardening.'
    ],
    benefits: ['Flexible Vacation', 'Medical Coverage', 'Annual Appraisal'],
    description: 'Maintain 99.99% uptime for core financial transaction processing services at Paytm.'
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find or create an employer account for seeding
    let employer = await User.findOne({ role: 'employer' });
    if (!employer) {
      employer = await User.create({
        name: 'Tech Recruitment Hub India',
        email: 'recruitment@techindia.org',
        role: 'employer',
        location: 'Bengaluru, India',
        bio: 'Official recruiting partner for top Indian tech companies and startups.'
      });
      console.log('Created sample employer account:', employer.email);
    }

    // Insert or update jobs
    for (const job of indianJobsData) {
      const existing = await Job.findOne({ title: job.title, company: job.company });
      if (!existing) {
        await Job.create({
          ...job,
          createdBy: employer._id,
          status: 'ACTIVE'
        });
        console.log(`✅ Added Indian Job: ${job.title} at ${job.company} (${job.location})`);
      } else {
        console.log(`ℹ️ Already exists: ${job.title} at ${job.company}`);
      }
    }

    console.log('\n🎉 Indian Jobs Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
