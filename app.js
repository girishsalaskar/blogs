// Blog functionality and enhancements

(function() {
  'use strict';

  // Theme management
  class ThemeManager {
    constructor() {
      this.currentTheme = this.getStoredTheme() || this.getSystemPreference();
      this.init();
    }

    init() {
      this.applyTheme(this.currentTheme);
      this.createThemeToggle();
      this.addSystemThemeListener();
    }

    getStoredTheme() {
      try {
        return localStorage.getItem('blog-theme');
      } catch (e) {
        return null;
      }
    }

    getSystemPreference() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-color-scheme', theme);
      this.currentTheme = theme;
      this.storeTheme(theme);
    }

    storeTheme(theme) {
      try {
        localStorage.setItem('blog-theme', theme);
      } catch (e) {
        // localStorage not available
      }
    }

    toggleTheme() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
      this.updateToggleButton();
    }

    createThemeToggle() {
      // Wait for docsify to load
      const addToggle = () => {
        const nav = document.querySelector('.app-nav');
        if (!nav) {
          setTimeout(addToggle, 100);
          return;
        }

        if (document.getElementById('theme-toggle')) return; // Already exists

        const toggle = document.createElement('button');
        toggle.id = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle theme');
        toggle.style.cssText = `
          background: none;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-base);
          padding: var(--space-8);
          margin-left: var(--space-16);
          cursor: pointer;
          color: var(--color-text);
          transition: all var(--duration-fast) var(--ease-standard);
          font-size: var(--font-size-lg);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        toggle.addEventListener('click', () => this.toggleTheme());
        toggle.addEventListener('mouseover', () => {
          toggle.style.background = 'var(--color-bg-1)';
          toggle.style.borderColor = 'var(--color-primary)';
        });
        toggle.addEventListener('mouseout', () => {
          toggle.style.background = 'none';
          toggle.style.borderColor = 'var(--color-border)';
        });

        nav.appendChild(toggle);
        this.updateToggleButton();
      };

      addToggle();
    }

    updateToggleButton() {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) {
        toggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', 
          this.currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        );
      }
    }

    addSystemThemeListener() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
          this.updateToggleButton();
        }
      });
    }
  }

  // Reading progress indicator
  class ReadingProgress {
    constructor() {
      this.init();
    }

    init() {
      this.createProgressBar();
      this.addScrollListener();
    }

    createProgressBar() {
      const progressBar = document.createElement('div');
      progressBar.id = 'reading-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--color-primary);
        z-index: 1000;
        transition: width 0.1s ease;
      `;
      document.body.appendChild(progressBar);
    }

    addScrollListener() {
      let ticking = false;
      
      const updateProgress = () => {
        const progressBar = document.getElementById('reading-progress');
        if (!progressBar) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateProgress);
          ticking = true;
        }
      });
    }
  }

  // Enhanced search functionality
  class SearchEnhancer {
    constructor() {
      this.init();
    }

    init() {
      // Wait for docsify search to initialize
      setTimeout(() => {
        this.enhanceSearch();
      }, 1000);
    }

    enhanceSearch() {
      const searchInput = document.querySelector('.search input[type="search"]');
      if (!searchInput) return;

      // Add search shortcuts
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchInput.focus();
        }
        
        if (e.key === 'Escape' && document.activeElement === searchInput) {
          searchInput.blur();
        }
      });

      // Add placeholder with shortcut hint
      searchInput.placeholder = 'Search posts... (Ctrl+K)';
    }
  }

  // Copy link functionality
  class LinkCopier {
    constructor() {
      this.init();
    }

    init() {
      // Add copy link buttons to headings
      setTimeout(() => {
        this.addCopyLinks();
      }, 1000);
    }

    addCopyLinks() {
      const headings = document.querySelectorAll('.markdown-section h2, .markdown-section h3');
      
      headings.forEach(heading => {
        if (heading.id && !heading.querySelector('.copy-link')) {
          const copyLink = document.createElement('button');
          copyLink.className = 'copy-link';
          copyLink.innerHTML = '🔗';
          copyLink.setAttribute('aria-label', 'Copy link to this section');
          copyLink.style.cssText = `
            background: none;
            border: none;
            color: var(--color-text-secondary);
            margin-left: var(--space-8);
            cursor: pointer;
            opacity: 0;
            transition: opacity var(--duration-fast) var(--ease-standard);
            font-size: var(--font-size-sm);
            padding: var(--space-4);
            border-radius: var(--radius-sm);
          `;

          copyLink.addEventListener('click', () => this.copyLink(heading.id, copyLink));
          
          heading.appendChild(copyLink);
          
          heading.addEventListener('mouseenter', () => {
            copyLink.style.opacity = '1';
          });
          
          heading.addEventListener('mouseleave', () => {
            copyLink.style.opacity = '0';
          });
        }
      });
    }

    async copyLink(headingId, button) {
      const url = `${window.location.origin}${window.location.pathname}#${headingId}`;
      
      try {
        await navigator.clipboard.writeText(url);
        this.showCopyFeedback(button, '✅');
      } catch (err) {
        // Fallback for older browsers
        this.fallbackCopy(url);
        this.showCopyFeedback(button, '✅');
      }
    }

    fallbackCopy(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }

    showCopyFeedback(button, icon) {
      const originalIcon = button.innerHTML;
      button.innerHTML = icon;
      button.style.color = 'var(--color-success)';
      
      setTimeout(() => {
        button.innerHTML = originalIcon;
        button.style.color = 'var(--color-text-secondary)';
      }, 2000);
    }
  }

  // Table of Contents generator
  class TableOfContents {
    constructor() {
      this.init();
    }

    init() {
      setTimeout(() => {
        this.generateTOC();
      }, 1500);
    }

    generateTOC() {
      const content = document.querySelector('.markdown-section');
      if (!content) return;

      const headings = content.querySelectorAll('h2, h3');
      if (headings.length < 3) return; // Only show TOC for longer articles

      const toc = this.createTOCElement();
      const tocList = this.createTOCList(headings);
      
      toc.appendChild(tocList);
      
      // Insert TOC after the first paragraph or heading
      const firstP = content.querySelector('p');
      const firstH = content.querySelector('h1, h2');
      const insertAfter = firstP || firstH;
      
      if (insertAfter && insertAfter.nextSibling) {
        insertAfter.parentNode.insertBefore(toc, insertAfter.nextSibling);
      }
    }

    createTOCElement() {
      const toc = document.createElement('nav');
      toc.className = 'table-of-contents';
      toc.style.cssText = `
        background: var(--color-bg-1);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: var(--space-16);
        margin: var(--space-24) 0;
      `;

      const title = document.createElement('h4');
      title.textContent = 'Table of Contents';
      title.style.cssText = `
        margin: 0 0 var(--space-12) 0;
        color: var(--color-text);
        font-size: var(--font-size-base);
      `;

      toc.appendChild(title);
      return toc;
    }

    createTOCList(headings) {
      const list = document.createElement('ul');
      list.style.cssText = `
        margin: 0;
        padding-left: var(--space-16);
        list-style: none;
      `;

      headings.forEach(heading => {
        if (!heading.id) {
          heading.id = this.generateId(heading.textContent);
        }

        const listItem = document.createElement('li');
        const link = document.createElement('a');
        
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.style.cssText = `
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: var(--font-size-sm);
          line-height: 1.6;
          display: block;
          padding: var(--space-4) 0;
          transition: color var(--duration-fast) var(--ease-standard);
          ${heading.tagName === 'H3' ? 'padding-left: var(--space-16);' : ''}
        `;

        link.addEventListener('mouseenter', () => {
          link.style.color = 'var(--color-primary)';
        });

        link.addEventListener('mouseleave', () => {
          link.style.color = 'var(--color-text-secondary)';
        });

        listItem.appendChild(link);
        list.appendChild(listItem);
      });

      return list;
    }

    generateId(text) {
      return text.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
  }

  // Smooth scrolling for anchor links
  class SmoothScroll {
    constructor() {
      this.init();
    }

    init() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    }
  }

  // Performance monitoring
  class PerformanceMonitor {
    constructor() {
      this.init();
    }

    init() {
      // Monitor page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.logPerformanceMetrics();
        }, 1000);
      });
    }

    logPerformanceMetrics() {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        console.log(`🚀 Blog loaded in ${loadTime.toFixed(2)}ms`);
        
        // Log any slow resources
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        
        if (slowResources.length > 0) {
          console.warn('⚠️ Slow loading resources:', slowResources);
        }
      }
    }
  }

  // Analytics and tracking (privacy-friendly)
  class Analytics {
    constructor() {
      this.pageViews = new Set();
      this.init();
    }

    init() {
      this.trackPageView();
      this.trackSearchUsage();
      this.trackThemePreference();
    }

    trackPageView() {
      const path = window.location.pathname + window.location.hash;
      if (!this.pageViews.has(path)) {
        this.pageViews.add(path);
        console.log(`📊 Page view: ${path}`);
      }
    }

    trackSearchUsage() {
      let searchCount = 0;
      document.addEventListener('input', (e) => {
        if (e.target.matches('.search input')) {
          searchCount++;
          if (searchCount === 1) {
            console.log('🔍 User started searching');
          }
        }
      });
    }

    trackThemePreference() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-color-scheme') {
            const theme = document.documentElement.getAttribute('data-color-scheme');
            console.log(`🎨 Theme changed to: ${theme}`);
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-color-scheme']
      });
    }
  }

  // Initialize all features when DOM is ready
  function initializeBlog() {
    // Core features
    new ThemeManager();
    new ReadingProgress();
    new SmoothScroll();
    
    // Enhanced features (with slight delay to ensure docsify is loaded)
    setTimeout(() => {
      new SearchEnhancer();
      new LinkCopier();
      new TableOfContents();
    }, 1000);

    // Monitoring (non-critical)
    setTimeout(() => {
      new PerformanceMonitor();
      new Analytics();
    }, 2000);

    console.log('🎉 Blog initialized successfully!');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlog);
  } else {
    initializeBlog();
  }

  // Add some helpful console messages
  console.log(`
🚀 Welcome to My Dev Blog!

Keyboard shortcuts:
- Ctrl/Cmd + K: Focus search
- Escape: Exit search

Features:
- 🌙 Dark/light theme toggle
- 📊 Reading progress indicator  
- 🔗 Copy section links
- 📑 Automatic table of contents
- ⚡ Enhanced search

Built with Docsify + Custom enhancements
  `);

})();