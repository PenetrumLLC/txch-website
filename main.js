const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 120;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.angle = Math.random() * Math.PI * 2;
        this.oscillationSpeed = 0.02 + Math.random() * 0.02;
    }

    update() {
        this.x += Math.cos(this.angle) * 0.5;
        this.y += Math.sin(this.angle) * 0.5;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        this.angle += this.oscillationSpeed;
        this.size = this.baseSize + Math.sin(this.angle) * 0.5;
    }

    draw() {
        ctx.fillStyle = `#FFFFFF`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

document.addEventListener('DOMContentLoaded', () => {
    let views = localStorage.getItem('pageViews') || 0;
    views = parseInt(views) + 1;
    localStorage.setItem('pageViews', views);
    document.getElementById('viewCount').textContent = views;
});

function setupSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    setInterval(nextSlide, 5000);
}

document.addEventListener('DOMContentLoaded', setupSlideshow);

VanillaTilt.init(document.querySelectorAll(".skill-item"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

function initWebGLBackground() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('webgl-background'),
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0xA3CCFF,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    camera.position.z = 30;

    function animate() {
        requestAnimationFrame(animate);
        torusKnot.rotation.x += 0.001;
        torusKnot.rotation.y += 0.002;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initPageTransitions() {
    const links = document.querySelectorAll('a[href^="#"]');
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    document.body.appendChild(pageTransition);

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            
            gsap.to(pageTransition, {
                scaleY: 1,
                transformOrigin: 'bottom',
                duration: 0.5,
                onComplete: () => {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'instant'
                    });
                    gsap.to(pageTransition, {
                        scaleY: 0,
                        transformOrigin: 'top',
                        duration: 0.5
                    });
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initWebGLBackground();
    initPageTransitions();
    
    const floatingIcons = document.querySelector('.floating-icons');
    ['react', 'node-js', 'python'].forEach((icon, index) => {
        const i = document.createElement('i');
        i.className = `fab fa-${icon}`;
        i.style.left = `${Math.random() * 100}%`;
        i.style.top = `${Math.random() * 100}%`;
        i.style.animationDelay = `${index * 0.5}s`;
        floatingIcons.appendChild(i);
    });
});