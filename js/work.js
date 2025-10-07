// Work page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get the category from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'creative'; // Default to 'creative' if no category specified
  
  // Define the work data (will be moved to Firebase later)
  const workData = {
    'creative': {
      title: 'Creative Solutions',
      subtitle: 'featured works',
      description: 'We bring ideas to life through innovative design and creative thinking that captivates audiences and drives engagement.',
      servicesTitle: 'Our Creative Services',
      services: [
        {
          title: 'Brand Identity',
          description: 'Creating memorable brand experiences through thoughtful design.'
        },
        {
          title: 'Graphic Design',
          description: 'Visual storytelling that communicates your message effectively.'
        },
        {
          title: 'UI/UX Design',
          description: 'Intuitive and engaging user experiences for digital products.'
        },
        {
          title: 'Motion Graphics',
          description: 'Bringing static designs to life with smooth animations.'
        }
      ],
      additionalText: 'From concept to execution, we use industry-leading tools and techniques to create stunning visuals that help you stand out in a crowded market.'
    },
    'publishing': {
      title: 'Publishing Solutions',
      subtitle: 'featured works',
      description: 'Transforming content into engaging publications that inform, educate, and inspire your audience.',
      servicesTitle: 'Our Publishing Services',
      services: [
        {
          title: 'Digital Publishing',
          description: 'Creating interactive digital publications for all devices.'
        },
        {
          title: 'Content Strategy',
          description: 'Developing content plans that engage and convert.'
        },
        {
          title: 'Editorial Design',
          description: 'Beautiful layouts that enhance readability and engagement.'
        },
        {
          title: 'E-book Production',
          description: 'Professional e-book design and formatting.'
        }
      ],
      additionalText: 'We help publishers and content creators deliver their message with impact through thoughtful design and strategic content planning.'
    },
    'software': {
      title: 'Software Development',
      subtitle: 'featured works',
      description: 'Building robust, scalable, and user-friendly software solutions that drive business growth.',
      servicesTitle: 'Our Development Services',
      services: [
        {
          title: 'Web Applications',
          description: 'Custom web solutions tailored to your business needs.'
        },
        {
          title: 'Mobile Apps',
          description: 'Native and cross-platform mobile applications.'
        },
        {
          title: 'Enterprise Software',
          description: 'Scalable solutions for large organizations.'
        },
        {
          title: 'API Development',
          description: 'Robust APIs for seamless integration.'
        }
      ],
      additionalText: 'Our development process focuses on creating efficient, maintainable, and scalable software that delivers real business value.'
    },
    'ai': {
      title: 'Custom AI Applications',
      subtitle: 'featured works',
      description: 'Harnessing the power of artificial intelligence to solve complex business challenges and create innovative solutions.',
      servicesTitle: 'Our AI Services',
      services: [
        {
          title: 'Machine Learning Models',
          description: 'Custom ML models for predictive analytics and automation.'
        },
        {
          title: 'Computer Vision',
          description: 'Image and video analysis for various applications.'
        },
        {
          title: 'Natural Language Processing',
          description: 'Text analysis, chatbots, and language understanding.'
        },
        {
          title: 'AI Integration',
          description: 'Seamlessly integrate AI capabilities into existing systems.'
        }
      ],
      additionalText: 'We leverage cutting-edge AI technologies to help businesses automate processes, gain insights, and create intelligent applications that drive innovation.'
    }
  };

  // Function to render the work content
  function renderWorkContent(data) {
    if (!data) {
      document.getElementById('work-content').innerHTML = `
        <div class="text-center py-5">
          <h2>Content Not Found</h2>
          <p class="mt-3">The requested work category could not be found.</p>
          <a href="work.html?category=creative" class="btn btn-primary mt-3">View Our Work</a>
        </div>
      `;
      return;
    }

    const servicesHtml = data.services.map(service => 
      `<li><strong>${service.title}</strong>: ${service.description}</li>`
    ).join('');

    const content = `
      <h3 class="section-item-title-xs">${data.subtitle || 'featured works'}</h3>
      <h1 class="h2-flash font-abril">${data.title}</h1>
      <div class="lead lead-lg">${data.description}</div>
      <div class="mt-5">
        <h3 class="mb-4 fs-2 font-libre"><strong>${data.servicesTitle || 'Our Services'}</strong></h3>
        <div class="fs-5 lh-md">
          <ul class="mb-4 text-gray-700">
            ${servicesHtml}
          </ul>
          ${data.additionalText ? `<p class="mb-4 text-gray-700">${data.additionalText}</p>` : ''}
        </div>
      </div>
      <div class="mt-5">
        <a href="contact.html" class="btn btn-primary">Get In Touch</a>
      </div>
    `;
    
    document.getElementById('work-content').innerHTML = content;
  }

  // Update the browser history and document title
  function updatePageInfo(category) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    document.title = `${categoryName} - YnV`;
    
    // Update URL without page reload
    const newUrl = `${window.location.pathname}?category=${category}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }

  // Initialize the page
  function init() {
    // Set a default category if none is specified
    const validCategories = ['creative', 'publishing', 'software', 'ai'];
    const selectedCategory = validCategories.includes(category) ? category : 'creative';
    
    // Update page info
    updatePageInfo(selectedCategory);
    
    // Render the content
    renderWorkContent(workData[selectedCategory]);
  }

  // Initialize the page
  init();

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const newCategory = urlParams.get('category') || 'creative';
    const categoryData = workData[newCategory];
    
    if (categoryData) {
      renderWorkContent(categoryData);
      updatePageInfo(newCategory);
    }
  });
});
