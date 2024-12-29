import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogBySlug } from '../lib/api';
import '../styles/BlogDetail.css';

export function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const { slug } = useParams();
  const contentRef = useRef(null);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blog.content;
      
      const headingElements = tempDiv.querySelectorAll('h1');
      const headingsData = Array.from(headingElements).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent,
          level: 1
        };
      });
      
      setHeadings(headingsData);
      
      const contentWithIds = tempDiv.innerHTML;
      if (contentRef.current) {
        contentRef.current.innerHTML = contentWithIds;
      }
    }
  }, [blog]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const headingElements = contentRef.current.querySelectorAll('h1');
      const scrollPosition = window.scrollY + 100; // Viewport üstünden offset

      let currentHeading = null;
      
      // Başlıkları tersten kontrol edelim (aşağıdan yukarıya)
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        const headingTop = heading.offsetTop;
        
        if (scrollPosition >= headingTop) {
          currentHeading = heading;
          break;
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading.id);
      } else if (headingElements.length > 0) {
        // Eğer hiçbir başlık bulunamadıysa ve sayfanın en üstündeysek
        // ilk başlığı seçelim
        if (scrollPosition < headingElements[0].offsetTop) {
          setActiveId(headingElements[0].id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // İlk yüklemede de çalıştıralım
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function loadBlog() {
    try {
      const response = await getBlogBySlug(slug);
      if (response.isSuccess) {
        console.log(response.data);
        setBlog(response.data);
      }
    } catch (error) {
      console.error('Blog yüklenemedi:', error);
    }
  }

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Üstten boşluk bırakalım
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!blog) return <div>Yükleniyor...</div>;

  return (
    <div className="blog-detail-container">
      <div className="blog-detail">
        <div className="blog-header">
          <h1>{blog.title}</h1>
          <div className="blog-meta">
            <span>Yazar: {blog.authorName}</span>
            <span>Tarih: {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div
          ref={contentRef}
          className="blog-content"
        />
      </div>
      {headings.length > 0 && (
        <div className="table-of-contents">
          <nav>
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`toc-item ${activeId === heading.id ? 'active' : ''}`}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
} 