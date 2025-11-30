import { db } from '@/app/config/db';
import { jobs } from '@/drizzle/drizzle';

const dummyJobs = [
    {
        title: 'Senior React Developer',
        description: 'We are looking for an experienced React developer to join our dynamic team. You will work on cutting-edge web applications with a focus on performance and user experience.',
        company: 'Tech Innovations Inc',
        location: 'San Francisco, CA',
        salary: '$120,000 - $160,000/year',
        jobType: 'full-time',
        experience: '5-8 years',
        skills: 'React, TypeScript, Node.js, AWS, Docker',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'UI/UX Designer',
        description: 'Join our design team to create beautiful and intuitive user interfaces. Experience with Figma, prototyping, and user research required.',
        company: 'Creative Studios',
        location: 'New York, NY',
        salary: '$90,000 - $130,000/year',
        jobType: 'full-time',
        experience: '3-5 years',
        skills: 'Figma, Adobe XD, Prototyping, User Research',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'Full Stack Developer',
        description: 'Build scalable web applications with modern technologies. We use React on the frontend and Node.js on the backend.',
        company: 'Digital Solutions Ltd',
        location: 'Remote',
        salary: '$100,000 - $140,000/year',
        jobType: 'full-time',
        experience: '4-6 years',
        skills: 'React, Node.js, PostgreSQL, Git',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'Backend Engineer (Python)',
        description: 'Develop robust backend systems for our AI-powered platform. Experience with Python, FastAPI, and cloud deployment required.',
        company: 'AI Ventures',
        location: 'Austin, TX',
        salary: '$110,000 - $150,000/year',
        jobType: 'full-time',
        experience: '4-7 years',
        skills: 'Python, FastAPI, PostgreSQL, Docker',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'Junior Developer Internship',
        description: 'Great opportunity for recent graduates to start your tech career. Learn from experienced developers and work on real projects.',
        company: 'StartUp Hub',
        location: 'Remote',
        salary: '$25 - $35/hour',
        jobType: 'internship',
        experience: '0-1 years',
        skills: 'JavaScript, HTML, CSS, React basics',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'DevOps Engineer',
        description: 'Manage and optimize our cloud infrastructure. Experience with Kubernetes, CI/CD pipelines, and AWS required.',
        company: 'Cloud Systems',
        location: 'Seattle, WA',
        salary: '$130,000 - $170,000/year',
        jobType: 'full-time',
        experience: '5-8 years',
        skills: 'Kubernetes, Docker, AWS, Jenkins, Terraform',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'Mobile App Developer',
        description: 'Develop iOS and Android apps using React Native. Join our mobile team and create apps used by millions.',
        company: 'Mobile First Corp',
        location: 'Los Angeles, CA',
        salary: '$105,000 - $145,000/year',
        jobType: 'full-time',
        experience: '3-6 years',
        skills: 'React Native, TypeScript, Firebase',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'QA Automation Engineer',
        description: 'Build and maintain automated test suites. Ensure quality of our applications through comprehensive testing.',
        company: 'Quality Assurance Pro',
        location: 'Chicago, IL',
        salary: '$85,000 - $120,000/year',
        jobType: 'full-time',
        experience: '3-5 years',
        skills: 'Selenium, Jest, Python, CI/CD',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'Frontend Developer (Vue.js)',
        description: 'Create responsive and interactive web applications using Vue.js. Work with our design team on beautiful UIs.',
        company: 'Web Masters',
        location: 'Boston, MA',
        salary: '$95,000 - $135,000/year',
        jobType: 'full-time',
        experience: '3-5 years',
        skills: 'Vue.js, JavaScript, CSS, Webpack',
        postedBy: 1,
        applicants: 0,
    },
    {
        title: 'Data Engineer',
        description: 'Design and build data pipelines. Work with big data technologies and help us process millions of records.',
        company: 'Data Corp',
        location: 'Denver, CO',
        salary: '$115,000 - $155,000/year',
        jobType: 'full-time',
        experience: '4-7 years',
        skills: 'Spark, Hadoop, Python, SQL',
        postedBy: 1,
        applicants: 0,
    },
];

export async function seedJobs() {
    try {
        console.log('🌱 Seeding dummy jobs...');
        
        for (const job of dummyJobs) {
            await db.insert(jobs).values(job);
        }
        
        console.log('✅ Successfully seeded', dummyJobs.length, 'dummy jobs');
    } catch (error) {
        console.error('❌ Error seeding jobs:', error);
    }
}
