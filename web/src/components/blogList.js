import { useEffect, useState } from 'react';
import { Row, Col, Card, Placeholder, Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { BlogCard } from './BlogCard';
import { getBlogsByCategory } from '../lib/api';

// Yapay gecikme için yardımcı fonksiyon
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function BlogSkeleton() {
  return (
    <Row>
      {[1, 2, 3].map(i => (
        <Col key={i} xs={12} >
          <Card>
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow" >
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                <Placeholder xs={6} /> <Placeholder xs={8} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const currentPage = parseInt(searchParams.get('PageNumber')) || 1;
  const pageSize = parseInt(searchParams.get('PageSize')) || 9;

  async function loadPosts() {
    setLoading(true);
    try {
      const params = {
        PageNumber: currentPage,
        PageSize: pageSize,
        CategoryId: searchParams.get('CategoryId') || '',
        Search: searchParams.get('Search') || ''
      };

      const categoryId = searchParams.get('CategoryId');
      if (categoryId) {
        params.CategoryId = categoryId;
      }

      const search = searchParams.get('Search');
      if (search && search.trim() !== '') {
        params.Search = search;
      }

      await sleep(400);

      const response = await getBlogsByCategory(params);
      
      if (response.isSuccess) {
        setPosts(response.data);
        setTotalCount(response.count);
        setTotalPages(Math.ceil(response.count / pageSize));
        
        // Debug için
        console.log('Total Count:', response.count);
        console.log('Total Pages:', Math.ceil(response.count / pageSize));
      }
    } catch (error) {
      console.error('Bloglar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [searchParams]);

  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('PageNumber', pageNumber);
    setSearchParams(newParams);
  };

  const renderPagination = () => {
    let items = [];
    
    // İlk sayfa
    items.push(
      <Pagination.First 
        key="first"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      />
    );

    // Önceki sayfa
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    // Sayfa numaraları
    for (let number = 1; number <= totalPages; number++) {
      if (
        number === 1 || // İlk sayfa
        number === totalPages || // Son sayfa
        (number >= currentPage - 1 && number <= currentPage + 1) // Aktif sayfanın etrafındaki sayfalar
      ) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      } else if (
        number === currentPage - 2 ||
        number === currentPage + 2
      ) {
        items.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
      }
    }

    // Sonraki sayfa
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );

    // Son sayfa
    items.push(
      <Pagination.Last
        key="last"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      />
    );

    return <Pagination className="justify-content-center mt-4">{items}</Pagination>;
  };

  if (loading) {
    return <BlogSkeleton />;
  }

  return (
    <>
      <Row>
        {Array.isArray(posts) && posts.map(blog => (
          <Col key={blog.id} xs={12} >
            <BlogCard blog={blog} />
          </Col>
        ))}
      </Row>
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            Toplam {totalCount} kayıttan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} arası gösteriliyor
          </div>
          {renderPagination()}
        </div>
      )}
    </>
  );
}
