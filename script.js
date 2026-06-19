document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       THEME MANAGEMENT (LIGHT/DARK MODE)
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage or system preferences
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    // Toggle theme handler
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        
        // Spin animation on button click
        const icon = themeToggleBtn.querySelector('.icon-svg:not([style*="display: none"])');
        if (icon) {
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 400);
        }

        if (document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    /* ==========================================
       EMAILJS INITIALIZATION
       ========================================== */
    if (window.emailjs) {
        emailjs.init('-T69XB01R6lzlq9IX');
    }

    /* ==========================================
       MOBILE NAVIGATION MENU
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item a');

    // Toggle menu visibility
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* ==========================================
       SCROLL DOWN ICON (HERO TO ABOUT)
       ========================================== */
    const scrollDownBtn = document.getElementById('scroll-to-about');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ==========================================
       SCROLL REVEAL & SKILLS PROGRESS ANIMATION
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    // Reveal elements on scroll using Intersection Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills section or contains skills, trigger skills bars animation
                if (entry.target.id === 'skills' || entry.target.querySelector('.skill-bar-fill')) {
                    animateSkillBars();
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // triggers slightly before entering viewport
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Function to animate skill progress bars
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    }

    /* ==========================================
       ACTIVE NAVIGATION LINKS ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section');
    
    const navObserverOptions = {
        threshold: 0.25,
        rootMargin: '-80px 0px -20% 0px' // adjust for header height
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    /* ==========================================
       PROJECTS FILTERING SYSTEM
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            const projectCards = document.querySelectorAll('.project-card'); // select dynamically!

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show item
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // Wait for transition duration
                }
            });
        });
    });

    /* ==========================================
       DYNAMIC GITHUB PROJECTS LOADER
       ========================================== */
    const projectsGrid = document.querySelector('.projects-grid');

    // Custom overrides to beautify academic repository names and descriptions
    const repoOverrides = {
        "DatabaseFinal": {
            name: "Biagsan POS & Inventory System",
            description: "An enterprise-grade point-of-sale and inventory control software featuring real-time stock alerts, sales analytics, and role-based administrative access.",
            show: true
        },
        "FINALS-IM": {
            name: "Tabeya Restaurant Management System",
            description: "A comprehensive digital dining solution incorporating table order tracking, kitchen queue management, and secure cashier billing interfaces.",
            show: true
        },
        "project-dsa": {
            name: "SSS Automated Queuing System",
            description: "A data structure-driven queue management system engineered to streamline citizen service ticketing and waiting times at government branches.",
            show: true
        },
        "Street-Assist-Admin-Dashboard": {
            name: "StreetAssist Admin Dashboard",
            description: "A responsive web portal for administrators to manage incident reports, track dispatch status, and monitor emergency requests in real-time.",
            show: true
        },
        "StreetAssist": {
            name: "StreetAssist Mobile Safety App",
            description: "A location-based mobile safety application designed to provide citizens with emergency assistance, real-time tracking, and immediate incident reporting.",
            show: true
        },
        "Scheduling-BJMP": {
            name: "BJMP Personnel Scheduler",
            description: "A desktop scheduling and resource optimization tool developed for the Bureau of Jail Management and Penology to streamline shift duty assignments.",
            show: true
        },
        "Lost-Found_Application08.": {
            name: "Campus Lost & Found Portal",
            description: "An interactive web and desktop system allowing users to report lost personal items, match descriptions, and claim recovered property securely.",
            show: true
        },
        // Hide academic exercises, templates, drafts, and minor course submissions
        "APPDEV11": { show: false },
        "APPDEVFINALS": { show: false },
        "IM": { show: false },
        "ADMIN": { show: false },
        "IT100webDev": { show: false },
        "TrialWorkIM": { show: false },
        "InformationManagement_IM": { show: false },
        "InformationManagementIM": { show: false },
        "InformationManagement": { show: false },
        "Sam-AppDev": { show: false },
        "MidtermAppDev": { show: false },
        "Portfolio": { show: false },
        "GameMap": { show: false }
    };

    async function loadGitHubProjects() {
        if (!projectsGrid) return;

        // Static fallback projects (in case API fails or rate limits apply)
        const fallbackProjects = [
            {
                name: "Street-Assist-Admin-Dashboard",
                description: "A responsive web portal for administrators to manage incident reports, track dispatch status, and monitor emergency requests in real-time.",
                language: "JavaScript",
                html_url: "https://github.com/s4nt0n1n0/Street-Assist-Admin-Dashboard",
                homepage: "https://street-assist-admin-dashboard.vercel.app"
            },
            {
                name: "StreetAssist",
                description: "A location-based mobile safety application designed to provide citizens with emergency assistance, real-time tracking, and immediate incident reporting.",
                language: "Java",
                html_url: "https://github.com/s4nt0n1n0/StreetAssist",
                homepage: null
            },
            {
                name: "DatabaseFinal",
                description: "An enterprise-grade point-of-sale and inventory control software featuring real-time stock alerts, sales analytics, and role-based administrative access.",
                language: "Visual Basic .NET",
                html_url: "https://github.com/s4nt0n1n0/DatabaseFinal",
                homepage: null
            },
            {
                name: "FINALS-IM",
                description: "A comprehensive digital dining solution incorporating table order tracking, kitchen queue management, and secure cashier billing interfaces.",
                language: "Visual Basic .NET",
                html_url: "https://github.com/s4nt0n1n0/FINALS-IM",
                homepage: null
            },
            {
                name: "project-dsa",
                description: "A data structure-driven queue management system engineered to streamline citizen service ticketing and waiting times at government branches.",
                language: "Java",
                html_url: "https://github.com/s4nt0n1n0/project-dsa",
                homepage: null
            },
            {
                name: "Scheduling-BJMP",
                description: "A desktop scheduling and resource optimization tool developed for the Bureau of Jail Management and Penology to streamline shift duty assignments.",
                language: "Visual Basic .NET",
                html_url: "https://github.com/s4nt0n1n0/Scheduling-BJMP",
                homepage: null
            },
            {
                name: "Lost-Found_Application08.",
                description: "An interactive web and desktop system allowing users to report lost personal items, match descriptions, and claim recovered property securely.",
                language: "Java",
                html_url: "https://github.com/s4nt0n1n0/Lost-Found_Application08.",
                homepage: null
            }
        ];

        try {
            const response = await fetch('https://api.github.com/users/s4nt0n1n0/repos?sort=updated&per_page=15');
            if (!response.ok) throw new Error('Failed to fetch repositories');
            
            const repos = await response.json();
            
            // Prioritize:
            // 1. Repos with show: true override
            // 2. Repos that are not forks and not explicitly hidden
            // 3. Forks that are not explicitly hidden
            const prioritized = repos.filter(repo => repoOverrides[repo.name]?.show === true);
            const standardNonFork = repos.filter(repo => !repo.fork && (!repoOverrides[repo.name] || repoOverrides[repo.name].show !== false) && repoOverrides[repo.name]?.show !== true);
            const standardFork = repos.filter(repo => repo.fork && (!repoOverrides[repo.name] || repoOverrides[repo.name].show !== false) && repoOverrides[repo.name]?.show !== true);
            
            const projects = [...prioritized, ...standardNonFork, ...standardFork].slice(0, 8); // Display top 8

            if (projects.length === 0) {
                const fallbackPrioritized = fallbackProjects.filter(p => repoOverrides[p.name]?.show === true);
                const fallbackNonFork = fallbackProjects.filter(p => (!repoOverrides[p.name] || repoOverrides[p.name].show !== false) && repoOverrides[p.name]?.show !== true);
                renderProjects([...fallbackPrioritized, ...fallbackNonFork].slice(0, 8));
            } else {
                renderProjects(projects);
            }
        } catch (error) {
            console.warn('GitHub API error, using static projects fallback:', error);
            const fallbackPrioritized = fallbackProjects.filter(p => repoOverrides[p.name]?.show === true);
            const fallbackNonFork = fallbackProjects.filter(p => (!repoOverrides[p.name] || repoOverrides[p.name].show !== false) && repoOverrides[p.name]?.show !== true);
            renderProjects([...fallbackPrioritized, ...fallbackNonFork].slice(0, 8));
        }
    }

    function renderProjects(projects) {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        projects.forEach(project => {
            const rawName = project.name;
            const override = repoOverrides[rawName];
            
            // Skip hidden items
            if (override && override.show === false) return;

            let name = override?.name || rawName
                .replace(/-/g, ' ')
                .replace(/_/g, ' ')
                .replace(/([a-z])([A-Z])/g, '$1 $2');
            
            // Capitalize words if not overridden
            if (!override?.name) {
                name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }

            let description = override?.description || project.description || '';
            if (!description) {
                if (project.language === 'Java') {
                    description = 'Academic software system designed and implemented in Java.';
                } else if (project.language === 'Visual Basic .NET') {
                    description = 'Database-connected desktop system developed using VB.NET.';
                } else if (project.language === 'HTML' || project.language === 'JavaScript') {
                    description = 'Web application layout designed using responsive web standards.';
                } else {
                    description = 'School project built as part of the BSIT curriculum.';
                }
            }

            const language = project.language || 'HTML/CSS';
            
            // Categorize
            let category = 'backend';
            if (['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue'].includes(language)) {
                category = 'frontend';
            }

            const card = document.createElement('div');
            card.className = 'project-card glass-panel';
            card.setAttribute('data-category', category);

            // Icon markup
            let langIcon = '💻';
            if (language === 'Java') langIcon = '☕';
            else if (language === 'Visual Basic .NET') langIcon = '🎯';
            else if (language === 'HTML' || language === 'CSS' || language === 'JavaScript') langIcon = '🌐';

            card.innerHTML = `
                <div class="project-details">
                    <h3 class="project-title">${name}</h3>
                    <p class="project-desc">${description}</p>
                    <div class="project-techs">
                        <span class="project-tech">${language}</span>
                        <span class="project-tech">GitHub</span>
                    </div>
                    <div class="project-links">
                        <a href="${project.html_url}" target="_blank" rel="noopener" class="project-link-btn project-link-code">
                            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            Code
                        </a>
                        ${project.homepage ? `
                        <a href="${project.homepage}" target="_blank" rel="noopener" class="project-link-btn project-link-demo">
                            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zm-4 14H5V5h7V3H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-5h-2v5H10z"/></svg>
                            Demo
                        </a>
                        ` : ''}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Load projects initially
    loadGitHubProjects();

    /* ==========================================
       CONTACT FORM SUBMISSION (MOCK)
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Simple client verification check
            if (!name || !email || !message) {
                showStatus('Please fill in all required fields.', 'error');
                return;
            }

            showStatus('Sending message...', 'info');

            emailjs.send('service_uefdvuq', 'template_j0z1ncc', {
                from_name: name,
                from_email: email,
                user_name: name,
                user_email: email,
                name: name,
                email: email,
                subject: subject,
                user_subject: subject,
                message: message,
                user_message: message,
                reply_to: email
            })
            .then(() => {
                showStatus(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                showStatus('Sorry, something went wrong while sending your message. Please try again later.', 'error');
            });
        });
    }

    /* ==========================================
       GITHUB CONTRIBUTIONS GRID — LIVE API
       Fetches real contribution data from GitHub
       for s4nt0n1n0. Auto-updates on every load.
       ========================================== */
    const contribGrid = document.getElementById('contributions-grid');
    const contribCountText = document.getElementById('contribution-count');
    const yearBtns = document.querySelectorAll('.year-btn');
    const GITHUB_USERNAME = 's4nt0n1n0';

    // Cache to avoid re-fetching same year in same session
    const contributionCache = {};

    // ---- Utility: convert count → level (0–4) ----
    function countToLevel(count, max) {
        if (count === 0) return 0;
        if (max === 0) return 0;
        const ratio = count / max;
        if (ratio < 0.15) return 1;
        if (ratio < 0.40) return 2;
        if (ratio < 0.70) return 3;
        return 4;
    }

    // ---- Build a date-indexed map from API weeks array ----
    function buildDayMap(weeks) {
        const map = {};
        weeks.forEach(week => {
            (week.contributionDays || []).forEach(day => {
                map[day.date] = day.contributionCount;
            });
        });
        return map;
    }

    // ---- Render grid from a date-indexed contributions map ----
    function renderGridFromMap(year, dayMap, totalCount) {
        if (!contribGrid) return;
        contribGrid.innerHTML = '';

        const isCurrentYear = (parseInt(year) === new Date().getFullYear());
        const yearLabel = isCurrentYear ? `${totalCount} contributions in the last year` : `${totalCount} contribution${totalCount !== 1 ? 's' : ''} in ${year}`;
        contribCountText.textContent = yearLabel;

        // Find max count for scaling levels
        const counts = Object.values(dayMap);
        const maxCount = counts.length ? Math.max(...counts) : 1;

        // Build the 53-week grid starting from Jan 1 of selected year
        const startDate = new Date(`${year}-01-01`);
        // Align to Sunday of that week
        const startDay = startDate.getDay(); // 0=Sun
        startDate.setDate(startDate.getDate() - startDay);

        // Month labels
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const monthCols = {};

        // Clear months
        const monthsContainer = document.querySelector('.months-labels');
        if (monthsContainer) monthsContainer.innerHTML = '';

        for (let col = 0; col < 53; col++) {
            for (let row = 0; row < 7; row++) {
                const cellDate = new Date(startDate);
                cellDate.setDate(startDate.getDate() + col * 7 + row);

                const dateStr = cellDate.toISOString().split('T')[0];
                const count = dayMap[dateStr] || 0;
                const level = countToLevel(count, maxCount);

                // Track first column for each month label
                const monthKey = `${cellDate.getFullYear()}-${cellDate.getMonth()}`;
                if (!monthCols[monthKey] && cellDate.getFullYear() === parseInt(year)) {
                    monthCols[monthKey] = { col: col + 1, label: monthNames[cellDate.getMonth()] };
                }

                const cell = document.createElement('div');
                cell.className = `contrib-cell level-${level}`;
                cell.setAttribute('title', `${count === 0 ? 'No' : count} contribution${count !== 1 ? 's' : ''} on ${dateStr}`);
                contribGrid.appendChild(cell);
            }
        }

        // Render month labels
        if (monthsContainer) {
            Object.values(monthCols).forEach(({ col, label }) => {
                const span = document.createElement('span');
                span.textContent = label;
                span.style.gridColumn = col;
                monthsContainer.appendChild(span);
            });
        }
    }

    // ---- Fetch live data from github-contributions-api ----
    async function fetchGitHubContributions(year) {
        if (contributionCache[year]) {
            return contributionCache[year];
        }

        // Show loading state
        if (contribCountText) {
            contribCountText.textContent = 'Loading contributions...';
        }

        try {
            // Use the public CORS-friendly contributions API
            const url = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=${year}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();

            // API returns { contributions: [{date, count, level},...], total: { "year": count } }
            // contributions is a FLAT array of day objects (not nested weeks)
            const days = data.contributions || [];
            const totalCount = (data.total && data.total[year]) ? data.total[year] : 0;

            // Build a date → count map from flat array
            const dayMap = {};
            let computedTotal = 0;
            days.forEach(day => {
                if (day && day.date) {
                    dayMap[day.date] = day.count || 0;
                    computedTotal += day.count || 0;
                }
            });

            const result = { dayMap, total: totalCount || computedTotal };
            contributionCache[year] = result;
            return result;

        } catch (err) {
            console.warn('GitHub API unavailable, falling back to static data.', err);
            return null;
        }
    }

    // ---- Fallback static data (used if API unavailable) ----
    // Totals sourced from live API: 2026=116, 2025=192, 2024=1
    const staticFallback = {
        '2026': {
            text: '116 contributions in 2026',
            render: () => renderStaticGrid('2026')
        },
        '2025': {
            text: '192 contributions in 2025',
            render: () => renderStaticGrid('2025')
        },
        '2024': {
            text: '1 contribution in 2024',
            render: () => renderStaticGrid('2024')
        }
    };

    function renderStaticGrid(year) {
        if (!contribGrid) return;
        contribGrid.innerHTML = '';

        const monthsContainer = document.querySelector('.months-labels');
        if (monthsContainer) monthsContainer.innerHTML = '';

        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const startDate = new Date(`${year}-01-01`);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const monthCols = {};

        // Hardcoded patterns (exact data from API — used as offline fallback)
        // 2026: Jan1-5(4,2,7,8), Feb17-19(2,1,1), Mar3(1),Mar17(1), Apr6(2),Apr9(2),Apr24(1),Apr29(3)
        //       May6-31 cluster: 6(1),7(1),8(3),10(3),13(1),17(2),19(3),20(25),21(3),22(7),23(25),24(4),25(3),27(1),29(1),31(1)
        // 2025: Feb6(1), Apr8(3), Oct23(3),Oct24(19),Oct25(1),Oct28(1), Nov4(2),Nov18-19(1,1)
        //       Nov22-Dec19 cluster
        // 2024: Nov30(1) only
        const REAL_DATA = {
            '2026': {
                '2026-01-01':2,'2026-01-02':4,'2026-01-03':2,'2026-01-04':7,'2026-01-05':8,
                '2026-02-17':2,'2026-02-18':1,'2026-02-19':1,
                '2026-03-03':1,'2026-03-17':1,
                '2026-04-06':2,'2026-04-09':2,'2026-04-24':1,'2026-04-29':3,
                '2026-05-06':1,'2026-05-07':1,'2026-05-08':3,'2026-05-10':3,'2026-05-13':1,
                '2026-05-17':2,'2026-05-19':3,'2026-05-20':20,'2026-05-21':3,'2026-05-22':7,
                '2026-05-23':25,'2026-05-24':4,'2026-05-25':3,'2026-05-27':1,'2026-05-29':1,'2026-05-31':1
            },
            '2025': {
                '2025-02-06':1,'2025-04-08':3,
                '2025-10-23':3,'2025-10-24':19,'2025-10-25':1,'2025-10-28':1,
                '2025-11-04':2,'2025-11-18':1,'2025-11-19':1,
                '2025-11-22':5,'2025-11-23':20,'2025-11-24':4,'2025-11-25':2,'2025-11-26':12,
                '2025-11-27':6,'2025-11-28':4,'2025-11-29':10,'2025-11-30':4,
                '2025-12-01':6,'2025-12-02':2,'2025-12-05':8,'2025-12-06':3,'2025-12-08':3,
                '2025-12-09':4,'2025-12-10':5,'2025-12-11':1,'2025-12-12':3,'2025-12-13':7,
                '2025-12-14':8,'2025-12-15':6,'2025-12-16':13,'2025-12-17':4,'2025-12-18':6,
                '2025-12-19':7,'2025-12-24':2,'2025-12-26':2,'2025-12-27':3
            },
            '2024': {
                '2024-11-30':1
            }
        };

        const realDayData = REAL_DATA[year] || {};
        const realCounts = Object.values(realDayData);
        const realMax = realCounts.length ? Math.max(...realCounts) : 1;

        const patterns = {
            // Use exact real data for all years
            default: (dateStr) => {
                const count = realDayData[dateStr] || 0;
                return countToLevel(count, realMax);
            }
        };

        const patternFn = patterns.default || (() => 0);

        for (let col = 0; col < 53; col++) {
            for (let row = 0; row < 7; row++) {
                const cellDate = new Date(startDate);
                cellDate.setDate(startDate.getDate() + col * 7 + row);
                const dateStr = cellDate.toISOString().split('T')[0];
                const level = patternFn(dateStr);
                const count = realDayData[dateStr] || 0;

                const monthKey = `${cellDate.getFullYear()}-${cellDate.getMonth()}`;
                if (!monthCols[monthKey] && cellDate.getFullYear() === parseInt(year)) {
                    monthCols[monthKey] = { col: col + 1, label: monthNames[cellDate.getMonth()] };
                }

                const cell = document.createElement('div');
                cell.className = `contrib-cell level-${level}`;
                cell.setAttribute('title', `${count === 0 ? 'No' : count} contribution${count !== 1 ? 's' : ''} on ${dateStr}`);
                contribGrid.appendChild(cell);
            }
        }

        if (monthsContainer) {
            Object.values(monthCols).forEach(({ col, label }) => {
                const span = document.createElement('span');
                span.textContent = label;
                span.style.gridColumn = col;
                monthsContainer.appendChild(span);
            });
        }

        if (contribCountText) {
            contribCountText.textContent = staticFallback[year]?.text || '';
        }
    }

    // ---- Main load function ----
    async function loadYear(year) {
        const data = await fetchGitHubContributions(year);

        if (data && data.dayMap && Object.keys(data.dayMap).length > 0) {
            renderGridFromMap(year, data.dayMap, data.total);
        } else {
            // Fallback to static
            renderStaticGrid(year);
        }
    }

    // Year button click handlers
    yearBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            yearBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const selectedYear = btn.getAttribute('data-year');
            loadYear(selectedYear);
        });
    });

    // Initial load — default to current year or 2026
    const currentYear = new Date().getFullYear().toString();
    const defaultYear = ['2024', '2025', '2026'].includes(currentYear) ? currentYear : '2026';

    // Set active button
    yearBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-year') === defaultYear) btn.classList.add('active');
    });

    loadYear(defaultYear);

    function showStatus(message, type) {
        if (!formStatus) return;
        
        formStatus.textContent = message;
        formStatus.className = 'form-status'; // Reset classes
        
        if (type === 'success') {
            formStatus.classList.add('success');
            formStatus.style.color = 'var(--text-primary)';
            formStatus.style.display = 'block';
        } else if (type === 'error') {
            formStatus.classList.add('error');
            formStatus.style.color = 'var(--text-muted)';
            formStatus.style.display = 'block';
        } else {
            formStatus.style.color = 'var(--text-secondary)';
            formStatus.style.display = 'block';
        }
    }

    /* ==========================================
       SECTION TITLE UNDERLINE ANIMATION
       ========================================== */
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('title-animated');
            }
        });
    }, { threshold: 0.6 });
    sectionTitles.forEach(t => titleObserver.observe(t));

    /* ==========================================
       SKILL CHIPS STAGGER POP-IN
       ========================================== */
    const chipObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chips = entry.target.querySelectorAll('.skill-chip');
                chips.forEach((chip, i) => {
                    setTimeout(() => chip.classList.add('chip-visible'), i * 80);
                });
                chipObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skills-category').forEach(cat => chipObserver.observe(cat));

    /* ==========================================
       STATS COUNTER ANIMATION
       ========================================== */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }

    const statsSection = document.getElementById('about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    /* ==========================================
       TYPEWRITER EFFECT
       ========================================== */
    const typewriterElement = document.getElementById('typewriter');
    const phrases = [
        "3rd Year BSIT Student",
        "Daet, Camarines Norte",
        "Database & Web Learner",
        "School Project Builder"
    ];
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && characterIndex === currentPhrase.length) {
            typingSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    if (typewriterElement) {
        typeEffect();
    }

     /* ==========================================
         BACKGROUND FLOATING PARTICLES
         - Create/ensure a fixed global container `global-hero-particles` so the animation
           overlays the entire page (subtle, pointer-events: none). We append it so it
           stacks above most content but below the header.
         ========================================== */
     let particlesContainer = document.getElementById('global-hero-particles');

     if (!particlesContainer) {
          const globalParticles = document.createElement('div');
          globalParticles.id = 'global-hero-particles';
          globalParticles.className = 'hero-particles global-hero-particles';
          // Append to body so it overlays the page content (but header remains above)
          document.body.appendChild(globalParticles);
          particlesContainer = globalParticles;
     } else {
          // If a page already has a local `#hero-particles` inside the hero, we still use
          // the global container to ensure a consistent overlay across sections.
     }

    const codeSymbols = [';', '{}', '[]', '++', '&&', '||', '*', '!=', '==', '0', '1', 'const', 'let', 'db', 'sql', '<>', '=>', '%', '#', '@', '//', '$', '()', '<>', '<=', '>='];

    function createParticles() {
        if (!particlesContainer) return;
        const symbolCount = 55;
        const circleCount = 16;

        for (let i = 0; i < symbolCount; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';
            particle.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.fontSize = `${Math.random() * 1.6 + 1}rem`;
            particle.style.opacity = `${Math.random() * 0.35 + 0.35}`;

            const delay = Math.random() * 5;
            const duration = Math.random() * 6 + 8;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;

            particlesContainer.appendChild(particle);
        }

        for (let i = 0; i < circleCount; i++) {
            const circle = document.createElement('span');
            circle.className = 'particle particle-circle';
            circle.textContent = '';

            const size = Math.random() * 32 + 20;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.left = `${Math.random() * 100}%`;
            circle.style.top = `${Math.random() * 100}%`;
            circle.style.opacity = `${Math.random() * 0.2 + 0.25}`;

            const delay = Math.random() * 5;
            const duration = Math.random() * 8 + 10;
            circle.style.animationDelay = `${delay}s`;
            circle.style.animationDuration = `${duration}s`;

            particlesContainer.appendChild(circle);
        }
    }

    createParticles();
});
