// Utility functions
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// DOM helper functions 
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Create a single IntersectionObserver instance for all animations
const animationObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.remove('hidden');
                target.classList.add('visible');
                
                // Special handling for education items
                if (target.classList.contains('education-item')) {
                    target.style.opacity = '1';
                    target.style.transform = 'translateY(0)';
                }
                
                observer.unobserve(target);
            }
        });
    },
    { 
        threshold: 0.2,
        rootMargin: '0px'
    }
);

// Initialize all animations and event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Observe all elements that need animations
    $$('section.hidden, .education-item').forEach(el => {
        if (el.classList.contains('education-item')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
        }
        animationObserver.observe(el);
    });
    
    initSmoothScrolling();
    initScrollProgress();
    initProjectFilters();
    initAboutSection();
    initRoleTextAnimation();
    initScrollToTop();
    initProjectModal();
    initHeroCanvas();
    initActiveNav();
    initCopyEmail();
    initMoreProjectsToggle();
});

// Navigation and scrolling
function initSmoothScrolling() {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            $(targetId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Scroll progress and nav background
function initScrollProgress() {
    const nav = $('nav');
    
    window.addEventListener('scroll', () => {
        // Update progress bar
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / (documentHeight - windowHeight)) * 100;
        $('.progress-bar').style.width = `${progress}%`;
        
        // Update nav background
        const opacity = Math.min(scrolled / 200, 0.95);
        nav.style.backgroundColor = `rgba(15,15,24,${opacity})`;
    });
}

// Projects section filtering
function initProjectFilters() {
    const filterBtns = $$('.filters button');
    const projectCards = $$('.cards.projects .card');
    const foundText = $('.found-text');
    const cliHeader = $('#projects .cli-header');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            let visibleCount = 0;
            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                const isVisible = filter === 'All' || categories.includes(filter);
                card.style.display = isVisible ? 'block' : 'none';
                if (isVisible) visibleCount++;
            });

            updateProjectUI(filter, visibleCount);
        });
    });

    function updateProjectUI(filter, count) {
        if (foundText) {
            foundText.textContent = `Found ${count} projects matching filter "${filter.toLowerCase()}"`;
        }
        if (cliHeader) {
            cliHeader.textContent = `$ find /projects -type project -filter "${filter.toLowerCase()}" -format card`;
        }
    }

    // Set initial state
    updateProjectUI('all', projectCards.length);
}

// About section content switching
function initAboutSection() {
    const optionItems = $$('.option-item');
    const responseBox = $('#about-response');
    const commandBox = $('#about-command');
    
    optionItems.forEach(item => {
        item.addEventListener('click', function() {
            optionItems.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            updateAboutContent(this.getAttribute('data-content'));
        });
    });

    // Show initial content
    $('.option-item')?.click();
}

function updateAboutContent(contentType) {
    const responseBox = $('#about-response');
    const commandBox = $('#about-command');
    let command, content;

    switch (contentType) {
        case 'about':
            command = '> Tell me about yourself';
            content = `Hello! I'm an AI/ML Engineer with 3+ years of experience building production-ready Generative AI and agentic solutions for enterprise clients.

                       I currently build multi-agent systems at 66degrees, and I run a personal project building an end-to-end fraud-detection and risk-intelligence pipeline solo.

                       I specialize in multi-agent architectures, Prompt Engineering, RAG pipelines, and agentic workflows (LangGraph, LangChain, CrewAI, MCP) — turning hard, ambiguous problems into deployable, high-leverage systems.`;
            break;
            
        case 'education':
            command = '> Tell me about your education';
            content = `<div class="education-content">
                <div class="education-item">
                    <i class="fas fa-graduation-cap gradient-text"></i>
                    <h4>Master's in IEM</h4>
                    <span class="institution">NIT Calicut</span>
                    <div class="education-period">2021 - 2023</div>
                </div>

                <div class="education-item">
                    <i class="fas fa-award gradient-text"></i>
                    <h4>GCP PMLE</h4>
                    <span class="institution">Professional Machine Learning Engineer Certification</span>
                </div>

                <div class="education-item">
                    <i class="fas fa-award gradient-text"></i>
                    <h4>GCP ACE</h4>
                    <span class="institution">Associate Cloud Engineer Certification</span>
                </div>
            </div>`;
            break;
            
        case 'skills':
            command = '> Show me your skills';
            content = `<div class="skills-content">
                <div class="education-item">
                    <i class="fas fa-brain gradient-text"></i>
                    <h4>AI & Machine Learning</h4>
                    <div class="tags">
                        <span>Generative AI</span>
                        <span>Prompt Engineering</span>
                        <span>LLMs</span>
                        <span>RAG & Agents</span>
                        <span>Machine Learning</span>
                        <span>Deep Learning</span>
                        <span>Computer Vision</span>
                        <span>NLP</span>
                        <span>PyTorch</span>
                    </div>
                </div>

                <div class="education-item">
                    <i class="fas fa-robot gradient-text"></i>
                    <h4>Agentic Systems</h4>
                    <div class="tags">
                        <span>Multi-Agent Systems</span>
                        <span>Agent Orchestration</span>
                        <span>LangGraph</span>
                        <span>LangChain</span>
                        <span>CrewAI</span>
                        <span>MCP</span>
                        <span>LLM Observability (Langfuse)</span>
                    </div>
                </div>

                <div class="education-item">
                    <i class="fas fa-cloud gradient-text"></i>
                    <h4>Cloud & Engineering</h4>
                    <div class="tags">
                        <span>GCP</span>
                        <span>Vertex AI</span>
                        <span>BigQuery</span>
                        <span>Firestore</span>
                        <span>PostgreSQL</span>
                        <span>Pub/Sub</span>
                        <span>Docker</span>
                        <span>CI/CD (GitHub Actions)</span>
                        <span>Streamlit</span>
                        <span>FastAPI</span>
                    </div>
                </div>

            </div>`;
            break;
            
        case 'publications':
            command = '> List your publications';
            content = `<div class="publications-content">
                <div class="education-item">
                    <i class="fas fa-file-alt gradient-text"></i>
                    <h4>Emotions at the Heart of Learning: Exploring the Role of Teacher Emotions in Student Engagement Using Facial Emotion Recognition</h4>
                    <span class="institution">Int. J. of Innovation and Learning</span>
                    <a href="https://www.inderscienceonline.com/doi/abs/10.1504/IJIL.2025.145352" target="_blank" class="education-period">View Publication</a>
                </div>

                <div class="education-item">
                    <i class="fas fa-file-alt gradient-text"></i>
                    <h4>How do teachers’ emotions effect student sentiment in MOOCs? A study using Facial Emotion Recognition and Sentiment analysis</h4>
                    <span class="institution">Int. J. of Learning Technology</span>
                    <a href="https://www.inderscienceonline.com/doi/abs/10.1504/IJIL.2025.145352" target="_blank" class="education-period">View Publication</a>
                </div>
            </div>`;
            break;
    }

    if (commandBox) commandBox.textContent = command;
    if (responseBox) responseBox.innerHTML = content;
}

// Role text animation
async function initRoleTextAnimation() {
    const container = $('.typing-container');
    const roleText = container?.querySelector('.role-text');
    if (!container || !roleText) return;

    const roles = ['An Agentic AI Engineer', 'A Fintech Enthusiast'];
    let currentIndex = 0;

    while (true) {
        const currentText = roles[currentIndex];
        
        // Type the text
        for (let i = 0; i < currentText.length; i++) {
            roleText.textContent = currentText.substring(0, i + 1);
            await sleep(100);
        }
        
        // Wait a bit when text is complete
        await sleep(2000);
        
        // Delete the text
        for (let i = currentText.length; i > 0; i--) {
            roleText.textContent = currentText.substring(0, i - 1);
            await sleep(50);  // Faster deletion
        }
        
        // Move to next role
        currentIndex = (currentIndex + 1) % roles.length;
        await sleep(500);  // Pause before next word
    }
}

// Scroll to top functionality
function initScrollToTop() {
    const toTop = $('#toTop');
    if (!toTop) return;

    window.addEventListener('scroll', () => {
        toTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });

    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Active nav highlight based on scroll position
function initActiveNav() {
    const sections = $$('section[id]');
    const navLinks = $$('nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    function onScroll() {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        let currentId = sections[0].id;
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollPos) currentId = sec.id;
        });
        navLinks.forEach(link => {
            const li = link.closest('li');
            li.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll();
}

// Copy email to clipboard
function initCopyEmail() {
    const btn = $('#copy-email');
    if (!btn) return;
    const email = btn.dataset.email;

    btn.addEventListener('click', () => {
        const done = () => {
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => { btn.innerHTML = original; }, 2000);
        };

        const fallbackCopy = () => {
            const ta = document.createElement('textarea');
            ta.value = email;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
            done();
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(done).catch(fallbackCopy);
        } else {
            fallbackCopy();
        }
    });
}

// More projects toggle
function initMoreProjectsToggle() {
    const toggle = $('#more-projects-toggle');
    const more = $('#more-projects');
    if (!toggle || !more) return;

    toggle.addEventListener('click', () => {
        const open = more.classList.toggle('open');
        toggle.innerHTML = open
            ? '<i class="fas fa-chevron-up"></i> Show Fewer Projects'
            : '<i class="fas fa-chevron-down"></i> More Projects';
    });
}

// Animated network/particle canvas for the hero
function initHeroCanvas() {
    const canvas = $('#bot-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLORS = ['#00fff0', '#ad4fff'];
    const MAX_DIST = 130;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles = [];

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }

    function initParticles() {
        const count = Math.min(90, Math.floor(canvas.width / 16));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1,
                c: COLORS[Math.floor(Math.random() * COLORS.length)]
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.35;
                    ctx.strokeStyle = `rgba(0,255,240,${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.c;
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    function update() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
    }

    function loop() {
        update();
        draw();
        if (!reduceMotion) requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    loop();
}

// Project modal functionality
function initProjectModal() {
    const modal = $('#project-modal');
    const closeBtn = $('.close-modal');
    const projectLinks = $$('.project-link');

    // Project data - you can add more details for each project
    const projectData = {
        'Virtual Engineer (66degrees)': {
            image: 'images/virtual_engineer.svg',
            description: `A multi-agent agentic platform built for a global engineering-services client, automating civil, electrical, and mechanical engineering workflows.`,
            techStack: ['LangGraph', 'LangChain', 'MCP', 'Multi-Agent Systems', 'Prompt Engineering', 'LLMs', 'FastAPI', 'GCP'],
            features: [
                'Orchestrator-planner-specialist multi-agent architecture',
                'Memory and token management for long, multi-turn agent sessions',
                'Reusable MCP tool-development patterns',
                'Custom frontend for engineers to interact with the agent system',
                'Automation of civil, electrical, and mechanical workflows'
            ]
        },

        'Fraud Detection & Risk Intelligence Platform': {
            image: 'images/fraud_detection.svg',
            description: `A personal project building an end-to-end fraud-detection and risk-intelligence pipeline — an AI agent that analyzes transaction and account activity for suspicious behavior.`,
            techStack: ['LLMs', 'Agents', 'SHAP', 'FalkorDB', 'Cypher', 'GCP', 'FastAPI', 'Python'],
            features: [
                'AI agent for alert triage and suspicious-activity analysis',
                'Mule-account pattern detection and scam-conversation analysis',
                'Risk-scoring pipeline combining rule-based checks, pattern analysis, and ML scoring',
                'SHAP explainability for model scoring',
                'Graph-based relationship engine using FalkorDB and Cypher',
                'End-to-end ownership: architecture, GCP/Railway infrastructure, and evaluation'
            ]
        },

        'Healthcare Insights Platform': {
            image: 'images/hcls_insights_platform.png',
            description: `An end-to-end Healthcare analytics platform along with natural language-driven insights to support strategic decision-making.`,
            techStack: ['LLMs', 'GCP', 'Agents', 'Prompt Engineering','Snowflake','Milvus', 'LangChain', 'LangGraph', 'DeepEval'],
            features: [
                'ETL pipelines for seamless data migration and transformation to Snowflake',
                'Entity extraction from enterprise data using Claude 3.5',
                'RAG using Milvus vector database',
                'Natural language query-driven insights dashboard',
                'Agentic workflows orchestrated via LangChain and LangGraph',
                'Implementation of Guardrails for safe and aligned LLM outputs',
                'Automated LLM evaluations and feedback-driven prompt improvement using DeepEval'
            ]
        },

        'Recipe Recommender Chatbot': {
            image: 'images/recipe_recommender_chatbot2.png',
            description: `A personalized recipe recommendation chatbot that suggests dishes based on users' cart items to boost engagement and basket value.`,
            techStack: ['LLMs', 'RAG', 'Prompt Engineering','Generative AI', 'Web Scraping', 'Dialogflow CX'],
            features: [
                'Natural language understanding for personalized recipe suggestions',
                'Real-time cart monitoring and contextual recommendations',
                'Takes into account user interactions during the session for smarter suggestions',
                'Enhanced user engagement through conversational interface'
            ]
        },
        "Enhancing Student Engagement through Teacher's Emotion Analysis": {
            image: 'images/fer_analysis.png',
            description: `A deep learning-based system to enhance student engagement by analyzing teacher emotions and correlating them with student feedback sentiment.`,
            techStack: ['CNN', 'VGG16', 'BERT', 'NLP', 'Sentiment Analysis', 'Deep Learning'],
            features: [
                'Facial emotion recognition of teachers and students using VGG16 CNN model',
                'Sentiment analysis of student comments using BERT-CNN hybrid model',
                'Correlation analysis between teacher emotions and student engagement levels',
                'Automated insights into class dynamics and engagement patterns',
                'Aims to improve classroom experience through emotion-driven analytics'
            ]
        },
        'GTM Intelligence Assistant': {
            image: 'images/gtm_accelarator_tool_1.jpeg',
            description: `An internal tool to accelerate client research for GTM teams by generating company profiles, use case recommendations, and persona insights using generative AI and vector-based retrieval.`,
            techStack: ['LLMs', 'RAG', 'ChromaDB', 'Web Scraping', 'Streamlit', 'Linkedin Scraping'],
            features: [
                'Automated generation of detailed company reports using Gemini Flash models',
                'Persona analysis from LinkedIn URLs(scraping linkedin profile) to guide pitch strategies',
                'High-level use case suggestions tailored to each client',
                'Vector-based retrieval of relevant past case studies and decks using ChromaDB',
                'Web scraping for real-time business and financial data aggregation',
                'Streamlit-based intuitive user interface for easy access and navigation'
            ]
        },
    };

    function showModal(projectTitle) {
        const project = projectData[projectTitle];
        if (!project) return;

        // Update modal content
        $('.modal-header h2').textContent = projectTitle;
        $('.project-description').textContent = project.description;

        // Update modal image
        const modalImage = $('.modal-image');
        if (modalImage) {
            modalImage.src = project.image;
            modalImage.alt = projectTitle;
        }
        
        // Update tech stack
        const modalTags = $('.modal-tags');
        modalTags.innerHTML = project.techStack
            .map(tech => `<span>${tech}</span>`)
            .join('');
        
        // Update features
        const featuresList = $('.features-list');
        featuresList.innerHTML = project.features
            .map(feature => `<li>${feature}</li>`)
            .join('');

        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event listeners
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectTitle = e.target.closest('.card').querySelector('h3').textContent;
            showModal(projectTitle);
        });
    });

    closeBtn.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });
}