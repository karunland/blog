import { ListGroup, Placeholder } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllCategories } from '../lib/api';

function SideBarSkeleton() {
  return (
    <div className="sidebar mb-4">
      <ListGroup>
        {[1, 2, 3].map(i => (
          <ListGroup.Item key={i}>
            <Placeholder animation="glow">
              <Placeholder xs={8} />
            </Placeholder>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategoryId = searchParams.get('CategoryId');

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.isSuccess) {
        setCategories(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('CategoryId', categoryId);
    newParams.set('PageNumber', '1');
    newParams.set('PageSize', '9');
    navigate(`/?${newParams.toString()}`);
  };

  if (loading) {
    return <SideBarSkeleton />;
  }

  return (
    <div className="sidebar mb-4">
      <ListGroup>
        <ListGroup.Item 
          action 
          active={!activeCategoryId}
          onClick={() => {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('CategoryId');
            navigate(`/?${newParams.toString()}`);
          }}
          className="d-flex justify-content-between align-items-center"
        >
          <span>Tüm Yazılar</span>
          <span className="badge bg-secondary rounded-pill">
            {categories.reduce((total, cat) => total + (cat.blogsCount || 0), 0)}
          </span>
        </ListGroup.Item>
        {categories.map(category => (
          <ListGroup.Item 
            key={category.id}
            action
            active={activeCategoryId === category.id.toString()}
            onClick={() => handleCategoryClick(category.id)}
            className="d-flex justify-content-between align-items-center"
          >
            <span>{category.name}</span>
            <span className="badge bg-secondary rounded-pill">
              {category.blogsCount || 0}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
