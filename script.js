document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Form Submission Simulation
    const contactForm = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        // const message = document.getElementById('message').value;

        // Simulate form submission
        setTimeout(() => {
            statusDiv.innerHTML = 'Thank you for your message, ' + name + '!';
            contactForm.reset();
        }, 1000);
    });

    // Newsletter Signup Simulation
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterStatusDiv = document.getElementById('newsletter-status');

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('newsletter-email').value;

        // Simulate newsletter subscription
        setTimeout(() => {
            newsletterStatusDiv.innerHTML = 'Thank you for subscribing to our newsletter!';
            newsletterForm.reset();
        }, 1000);
    });

    // Image Slider
    let slideIndex = 0;
    const slides = document.querySelector('.slides');
    const slideImages = slides.getElementsByTagName('img');
    const prevButton = document.querySelector('button.prev');
    const nextButton = document.querySelector('button.next');

    function showSlide(index) {
        if (index >= slideImages.length) slideIndex = 0;
        if (index < 0) slideIndex = slideImages.length - 1;
        slides.style.transform = translateX(`${-slideIndex * 100}%`);
    }

    prevButton.addEventListener('click', function() {
        showSlide(--slideIndex);
    });

    nextButton.addEventListener('click', function() {
        showSlide(++slideIndex);
    });

    showSlide(slideIndex);

    // Initialize Google Map
    window.initMap = function() {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
        });
    };

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
    });

    // Scroll-to-Top Button
    const scrollToTopButton = document.getElementById('scroll-to-top');

    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // FAQ Section
    fetch('data/faq.json')
        .then(response => response.json())
        .then(data => {
            const faqContainer = document.getElementById('faq-container');
            data.faq.forEach(item => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';

                const question = document.createElement('div');
                question.className = 'faq-question';
                question.textContent = item.question;

                const answer = document.createElement('div');
                answer.className = 'faq-answer';
                answer.textContent = item.answer;

                faqItem.appendChild(question);
                faqItem.appendChild(answer);

                faqContainer.appendChild(faqItem);

                question.addEventListener('click', () => {
                    answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
                });
            });
        });

    // Service Modal
    const serviceButtons = document.querySelectorAll('.service-btn');
    const modal = document.getElementById('service-modal');
    const modalContent = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close-btn');
    const serviceTitle = document.getElementById('service-title');
    const serviceDescription = document.getElementById('service-description');

    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            fetch('data/services.json')
                .then(response => response.json())
                .then(data => {
                    const serviceData = data.services.find(s => s.name === service);
                    serviceTitle.textContent = serviceData.name;
                    serviceDescription.textContent = serviceData.description;
                    modal.style.display = 'block';
                });
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// AWS credentials and S3 bucket information
const AWS_ACCESS_KEY_ID = 'AKIA3FLDZ7ZNCVOKFPUA';
const AWS_SECRET_ACCESS_KEY = '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';
const AWS_S3_BUCKET = 'greeting12';
const AWS_REGION = 'us-east-1';

// Configure the AWS SDK
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

// Create an S3 client
const s3 = new AWS.S3();

// document.getElementById('listObjectsBtn').addEventListener('click', listObjects);
// document.getElementById('findImageForm').addEventListener('submit', findImage);

async function listObjects() {
    try {
        const response = await s3.listObjectsV2({ Bucket: AWS_S3_BUCKET }).promise();
        const objects = response.Contents || [];

        // const objectsList = document.getElementById('objectsList');
        // objectsList.innerHTML = '';

        // objects.forEach(obj => {
        //     const url = s3.getSignedUrl('getObject', {
        //         Bucket: AWS_S3_BUCKET,
        //         Key: obj.Key,
        //         Expires: 3600
        //     });

        //     const listItem = document.createElement('li');
        //     listItem.textContent = `${obj.Key} - ${url}`;
        //     objectsList.appendChild(listItem);
        // });

        console.log('Objects in bucket:', objects);
    } catch (error) {
        console.error('Error listing objects:', error);
    }
}

async function findImage(message) {
    console.log(message)
    // const message = document.getElementById('message').value;
    const foundImage = document.getElementById('imgsrc');
    const foundVideo = document.getElementById('foundVideo');
    const videoSource = document.getElementById('videoSource');
    videoSource.src = '';
    // foundVideo.load();
    foundVideo.style.display = 'none';
    foundImage.src = '';
    foundImage.style.display = 'none';
    try {
        const response = await s3.listObjectsV2({ Bucket: AWS_S3_BUCKET }).promise();
        const objects = response.Contents || [];
        let imageUrl = null;
        for (const obj of objects) {
            if (obj.Key.startsWith(message)) {
                imageUrl = s3.getSignedUrl('getObject', {
                    Bucket: AWS_S3_BUCKET,
                    Key: obj.Key,
                    Expires: 3600
                });
                break;
            }
        }

        // // const foundImage = document.getElementById('foundImage');
        // // const foundVideo = document.getElementById('foundVideo');
        // // const videoSource = document.getElementById('videoSource');

        // if (imageUrl) {
        //     console.log('Found image URL:', imageUrl);
        //     document.getElementById('imgsrc').src=imageUrl
        //     // foundImage.src = imageUrl;
        //     // foundImage.style.display = 'block';

        //     // videoSource.src = imageUrl;
        //     // foundVideo.load();
        //     // foundVideo.style.display = 'block';
        // } else {
        //     console.log('Image not found.');
        //     // foundImage.style.display = 'none';
        //     // foundVideo.style.display = 'none';
        // }

        if (imageUrl) {
            console.log('Found image URL:', imageUrl);
            videoSource.src = imageUrl;
            foundVideo.load();
            foundVideo.style.display = 'block';
            foundImage.src = imageUrl;
            foundImage.style.display = 'block';
            console.log(document.getElementById('foundVideo'))
            // if (imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            //     foundImage.src = imageUrl;
            //     foundImage.style.display = 'block';
            //     foundVideo.style.display = 'none';
            // } else if (imageUrl.match(/\.(mp4|webm|ogg)$/) != null) {
            //     videoSource.src = imageUrl;
            //     foundVideo.load();
            //     foundVideo.style.display = 'block';
            //     foundImage.style.display = 'none';
            // }
        } else {
            console.log('Image not found.');
            foundImage.style.display = 'none';
            foundVideo.style.display = 'none';
        }
    } catch (error) {
        console.error('Error finding image:', error);
    }
}

listObjects()
const Getdata=()=>{
    var msg = document.getElementById('name').value
    findImage(msg)
}